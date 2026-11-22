#!/usr/bin/env node
/**
 * Release core for the agent-activity pair.
 *
 * `packages/activity-plugin` (client) and `apps/activity-worker` (server) ship
 * as ONE version — the same X.Y.Z in both package.json files — under ONE tag,
 * `activity-vX.Y.Z`. `apps/web` is unversioned; the root package version is
 * decorative.
 *
 * Dependency-free; runs under Node type-stripping (>= 22.18):
 *
 *   node scripts/release-agent.ts check [<range>] [--deep]   dry-run: window, parsing, version, changelog draft
 *   node scripts/release-agent.ts apply [patch|minor|major] [--no-edit] [--force]
 *                                                            local fallback (on dev): bump + changelog + prep commit; never tags
 *   node scripts/release-agent.ts bot [--force]              CI (push to dev): rebuild release/next, maintain the release PR
 *   node scripts/release-agent.ts tag [--force]              CI (push to main): create+push activity-vX.Y.Z when the version changed
 *
 * Flow and rules: root AGENTS.md → "Versioning & releases".
 */

import { execSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

type Level = 'patch' | 'minor' | 'major';
type Section = 'Plugin' | 'Worker' | 'Repo';

interface Item {
  raw: string;
  type: string;
  scope: string | null;
  breaking: boolean;
  subject: string;
}

interface Commit {
  sha: string;
  subject: string;
  items: Item[];
  unparseable: string[];
  pr: number | null;
}

interface Versions {
  worker: string | null;
  plugin: string | null;
}

const WORKER_PKG = 'apps/activity-worker/package.json';
const PLUGIN_PKG = 'packages/activity-plugin/package.json';
const CHANGELOG = 'CHANGELOG.md';
const TAG_PREFIX = 'activity-v';
const RELEASE_BRANCH = 'release/next';
const BOT_NAME = 'github-actions[bot]';
const BOT_EMAIL = '41898282+github-actions[bot]@users.noreply.github.com';
const CONVENTIONAL = /^(\w+)(?:\(([^)]*)\))?(!)?:\s*(.+)$/;
const BULLET = /^\s*[*-]\s+(.+)$/;
const PR_SUFFIX = /\(#(\d+)\)\s*$/;

// ---------------------------------------------------------------- shell utils

function run(cmd: string): { ok: boolean; out: string; err: string } {
  try {
    const out = execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { ok: true, out: out.trim(), err: '' };
  } catch (e) {
    const err = e as { stderr?: unknown; message?: string };
    return { ok: false, out: '', err: String(err.stderr ?? err.message ?? e).trim() };
  }
}

function must(cmd: string): string {
  const r = run(cmd);
  if (!r.ok) throw new Error(`command failed: ${cmd}\n${r.err}`);
  return r.out;
}

const git = (args: string): string => must(`git ${args}`);

function tmpFile(name: string, content: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'release-agent-'));
  const file = join(dir, name);
  writeFileSync(file, content);
  return file;
}

function die(message: string): never {
  console.error(`release-agent: ${message}`);
  process.exit(1);
}

function requireCi(): void {
  if (process.env.GITHUB_ACTIONS !== 'true' && !FORCE) {
    die('bot/tag modes run in CI — pass --force to run them locally');
  }
}

// ------------------------------------------------------------------- parsing

interface Parsed {
  type: string;
  scope: string | null;
  breaking: boolean;
  subject: string;
}

function parseSubject(raw: string): Parsed | null {
  const m = CONVENTIONAL.exec(raw.trim());
  if (!m) return null;
  return {
    type: m[1].toLowerCase(),
    scope: m[2] ?? null,
    breaking: m[3] !== undefined,
    subject: m[4].trim(),
  };
}

function sectionOf(scope: string | null): Section {
  const s = (scope ?? '').toLowerCase();
  if (s.startsWith('plugin')) return 'Plugin';
  if (s.startsWith('worker')) return 'Worker';
  return 'Repo';
}

const LEVEL_RANK: Record<Level, number> = { patch: 1, minor: 2, major: 3 };

function itemLevel(item: Parsed): Level {
  return item.breaking ? 'major' : item.type === 'feat' ? 'minor' : 'patch';
}

/** Highest severity across all conventional items; null when none parse. */
function levelOf(commits: Commit[]): { level: Level | null; source: string } {
  let best: { level: Level; source: string } | null = null;
  for (const commit of commits) {
    for (const raw of commit.items) {
      const level = itemLevel(raw);
      if (!best || LEVEL_RANK[level] > LEVEL_RANK[best.level]) {
        const scope = raw.scope ? `(${raw.scope})` : '';
        best = { level, source: `${raw.type}${scope}: ${raw.subject}` };
      }
    }
  }
  return best ? { level: best.level, source: best.source } : { level: null, source: '' };
}

// -------------------------------------------------------------------- window

function loadWindow(range: string, deep: boolean): Commit[] {
  const raw = git(`log --no-merges --pretty=format:%H%x1f%s%x1f%b%x1e ${range}`);
  const commits: Commit[] = [];
  for (const record of raw
    .split('\x1e')
    .map((s) => s.trimStart())
    .filter(Boolean)) {
    const parts = record.split('\x1f');
    const sha = parts[0] ?? '';
    const subject = (parts[1] ?? '').trim();
    const body = parts.slice(2).join('\x1f').trim();
    const items: Item[] = [];
    const unparseable: string[] = [];
    const fromTitle = parseSubject(subject);
    if (fromTitle) items.push({ raw: subject, ...fromTitle });
    else unparseable.push(subject);
    for (const line of body.split('\n')) {
      const m = BULLET.exec(line);
      if (!m) continue;
      const parsed = parseSubject(m[1]);
      if (parsed) items.push({ raw: m[1], ...parsed });
      else unparseable.push(m[1]);
    }
    let pr: number | null = null;
    const prMatch = PR_SUFFIX.exec(subject);
    if (prMatch) pr = Number(prMatch[1]);
    if (items.length === 0 && pr !== null && deep) {
      for (const headline of ghPrHeadlines(pr)) {
        const parsed = parseSubject(headline);
        if (parsed) items.push({ raw: headline, ...parsed });
        else unparseable.push(headline);
      }
    }
    commits.push({ sha, subject, items, unparseable, pr });
  }
  return commits;
}

/** Fallback for squash bodies edited down to the title: recover the PR's commits via gh. */
function ghPrHeadlines(pr: number): string[] {
  // REST gives full commit subjects; GraphQL's messageHeadline truncates at ~72 chars.
  const m = /github\.com[:/]+([^/]+)\/([^/.]+?)(?:\.git)?$/.exec(
    run('git remote get-url origin').out,
  );
  const cmd = m
    ? `gh api repos/${m[1]}/${m[2]}/pulls/${pr}/commits --jq '.[].commit.message | split("\\n")[0]'`
    : `gh pr view ${pr} --json commits --jq '.commits[].messageHeadline'`;
  const r = run(cmd);
  if (!r.ok) console.error(`release-agent: gh fallback for PR #${pr} failed — ${r.err}`);
  return r.ok ? r.out.split('\n').filter(Boolean) : [];
}

// ------------------------------------------------------------------- version

function readVersions(): Versions {
  const read = (file: string): string | null =>
    existsSync(file)
      ? (JSON.parse(readFileSync(file, 'utf8')) as { version: string }).version
      : null;
  return { worker: read(WORKER_PKG), plugin: read(PLUGIN_PKG) };
}

function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) - (pb[i] ?? 0);
  }
  return 0;
}

/** Highest of the two versions; null while either package is absent. */
function prevVersion(versions: Versions): string | null {
  if (versions.worker === null || versions.plugin === null) return null;
  return compareVersions(versions.worker, versions.plugin) >= 0 ? versions.worker : versions.plugin;
}

function bump(version: string, level: Level): string {
  const [maj, min, pat] = version.split('.').map(Number);
  if (level === 'major') return `${maj + 1}.0.0`;
  if (level === 'minor') return `${maj}.${min + 1}.0`;
  return `${maj}.${min}.${pat + 1}`;
}

/** Surgical replace so package.json formatting stays untouched. */
function setVersion(file: string, version: string): void {
  const src = readFileSync(file, 'utf8');
  const next = src.replace(/"version":\s*"[^"]+"/, `"version": "${version}"`);
  if (next === src) throw new Error(`no "version" field found in ${file}`);
  writeFileSync(file, next);
}

// ----------------------------------------------------------------- changelog

function renderSections(items: Item[]): string {
  const buckets: Record<Section, string[]> = { Plugin: [], Worker: [], Repo: [] };
  for (const item of items) buckets[sectionOf(item.scope)].push(`- ${item.type}: ${item.subject}`);
  return (['Plugin', 'Worker', 'Repo'] as const)
    .filter((section) => buckets[section].length > 0)
    .map((section) => `### ${section}\n${buckets[section].join('\n')}`)
    .join('\n\n');
}

function buildEntry(version: string, items: Item[]): string {
  const date = new Date().toLocaleDateString('en-CA');
  return `## ${version} — ${date}\n\n${renderSections(items)}\n`;
}

function writeChangelog(entry: string): void {
  if (existsSync(CHANGELOG)) {
    const content = readFileSync(CHANGELOG, 'utf8');
    const idx = content.indexOf('\n## ');
    if (idx === -1) {
      writeFileSync(CHANGELOG, `${content.trimEnd()}\n\n${entry}\n`);
    } else {
      writeFileSync(CHANGELOG, `${content.slice(0, idx + 1)}${entry}\n\n${content.slice(idx + 1)}`);
    }
  } else {
    const header =
      '# Changelog\n\n' +
      'One version for the agent-activity pair — `packages/activity-plugin` (client) and\n' +
      '`apps/activity-worker` (server) — released together under `activity-vX.Y.Z`.\n' +
      '`apps/web` is unversioned.\n\n';
    writeFileSync(CHANGELOG, header + entry + '\n');
  }
}

// ---------------------------------------------------------------------- CLI

const argv = process.argv.slice(2);
const MODE = argv.shift();
const flags = argv.filter((a) => a.startsWith('--'));
const POSITIONAL = argv.filter((a) => !a.startsWith('--'));
const FORCE = flags.includes('--force');
const DEEP = flags.includes('--deep');
const NO_EDIT = flags.includes('--no-edit');

function editEntry(entry: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'release-agent-'));
  const file = join(dir, 'entry.md');
  writeFileSync(file, `${entry}\n`);
  const editor = process.env.EDITOR || 'vi';
  const res = spawnSync(editor, [file], { stdio: 'inherit' });
  rmSync(dir, { recursive: true, force: true });
  if (res.error || res.status !== 0) {
    console.error('release-agent: editor unavailable or failed — keeping the generated entry');
    return entry;
  }
  return readFileSync(file, 'utf8').trimEnd();
}

function fetchMainQuietly(): void {
  const r = run('git fetch origin main --quiet');
  if (!r.ok) console.error('release-agent: could not refresh origin/main — using the cached ref');
}

// ------------------------------------------------------------------- check

function modeCheck(range: string): void {
  const commits = loadWindow(range, DEEP);
  console.log(`window: ${range} — ${commits.length} commit(s)`);
  for (const commit of commits) {
    const note =
      commit.items.length > 0
        ? `${commit.items.length} item(s)`
        : commit.unparseable.length > 0
          ? `unparsed (${commit.unparseable.length})`
          : 'empty';
    console.log(`  ${commit.sha.slice(0, 7)} ${commit.subject}  [${note}]`);
  }
  if (commits.length === 0) {
    console.log('nothing to release.');
    return;
  }
  const { level, source } = levelOf(commits);
  const versions = readVersions();
  const prev = prevVersion(versions);
  console.log(
    level
      ? `suggested level: ${level} — driven by \`${source}\``
      : 'suggested level: unknown — no conventional commits in the window (pass patch|minor|major explicitly)',
  );
  console.log(`version: ${prev ?? 'pair absent'} → ${level && prev ? bump(prev, level) : '?'}`);
  if (versions.worker !== null && versions.plugin !== null && versions.worker !== versions.plugin) {
    console.log(
      `note: versions were misaligned (worker ${versions.worker}, plugin ${versions.plugin}) — aligning both`,
    );
  }
  const items = commits.flatMap((c) => c.items);
  if (level && prev) {
    console.log('--- changelog draft ---');
    console.log(buildEntry(bump(prev, level), items).trimEnd());
  }
  const unparsed = commits.flatMap((c) => c.unparseable);
  if (unparsed.length > 0) {
    console.log('--- unrecognized lines (not listed in the changelog) ---');
    for (const line of unparsed) console.log(`  ? ${line}`);
  }
}

// ------------------------------------------------------------------- apply

function modeApply(levelArg: string | undefined): void {
  const branch = git('rev-parse --abbrev-ref HEAD');
  if (branch !== 'dev' && !FORCE) die('apply runs on dev — use --force to run elsewhere');
  if (git('status --porcelain --untracked-files=no') !== '')
    die('tree is not clean — commit or stash first');
  fetchMainQuietly();
  const commits = loadWindow('origin/main..HEAD', DEEP);
  if (commits.length === 0) die('nothing to release — the window is empty');
  const { level, source } = levelOf(commits);
  const chosen = levelArg ?? level;
  if (!chosen) {
    die(
      'cannot determine the level (no conventional commits in the window) — pass patch|minor|major',
    );
  }
  if (levelArg && level && LEVEL_RANK[levelArg as Level] !== LEVEL_RANK[level]) {
    console.log(
      `release-agent: overriding suggested level ${level} with ${levelArg} (was driven by \`${source}\`)`,
    );
  }
  const versions = readVersions();
  const prev = prevVersion(versions);
  if (!prev)
    die(
      'agent-activity pair not found in the tree (apps/activity-worker, packages/activity-plugin) — nothing to release',
    );
  const next = bump(prev, chosen as Level);
  const alignNote =
    versions.worker !== null && versions.plugin !== null && versions.worker !== versions.plugin
      ? ` (aligned worker ${versions.worker})`
      : '';
  let entry = buildEntry(
    next,
    commits.flatMap((c) => c.items),
  );
  if (!NO_EDIT && process.stdout.isTTY) entry = editEntry(entry);
  writeChangelog(entry);
  setVersion(WORKER_PKG, next);
  setVersion(PLUGIN_PKG, next);
  git(`add ${CHANGELOG} ${WORKER_PKG} ${PLUGIN_PKG}`);
  git(`commit -m "chore(release): agent-activity ${next}"`);
  console.log(`release-agent: prepped ${next} on ${branch}${alignNote}`);
  console.log(
    'next: git push, then open the PR release/next → main manually (merge commit, never squash).',
  );
}

// --------------------------------------------------------------------- bot

function findOpenPr(): number | null {
  const r = run(
    `gh pr list --head ${RELEASE_BRANCH} --state open --json number --jq '.[0].number'`,
  );
  const n = Number(r.out);
  return r.ok && r.out !== '' && Number.isFinite(n) ? n : null;
}

function modeBot(): void {
  requireCi();
  git('fetch origin main dev --quiet');
  const remoteBranch = run(`git fetch origin ${RELEASE_BRANCH} --quiet`).ok;
  const hasRemoteBranch =
    remoteBranch &&
    run(`git rev-parse -q --verify refs/remotes/origin/${RELEASE_BRANCH}`).out !== '';
  const openPr = findOpenPr();
  const commits = loadWindow('origin/main..origin/dev', true);
  if (commits.length === 0) {
    if (openPr) {
      must(
        `gh pr comment ${openPr} --body-file ${tmpFile('comment.md', 'Nothing new to release — the window is empty.')}`,
      );
    }
    console.log('release-agent: window is empty — nothing to release');
    return;
  }
  const { level, source } = levelOf(commits);
  if (!level) {
    const detail = commits
      .map(
        (c) =>
          `  ${c.sha.slice(0, 7)} ${c.subject}${c.unparseable.length > 0 ? ` (${c.unparseable.length} unparsed)` : ''}`,
      )
      .join('\n');
    die(
      `cannot determine the release level — no conventional commits in the window:\n${detail}\n` +
        'Fix the commit subjects or run `apply` locally with an explicit level.',
    );
  }
  const versions = readVersions();
  const prev = prevVersion(versions);
  if (!prev) {
    console.log(
      'release-agent: agent-activity pair not present on dev yet — nothing releasable (waiting for the feature merge)',
    );
    return;
  }
  const next = bump(prev, level);
  const items = commits.flatMap((c) => c.items);

  // Curation guard: only while a release PR is open. Manual commits on
  // release/next (reverts, version overrides) mean the owner is steering —
  // do not clobber; hand the decision back.
  if (openPr !== null && hasRemoteBranch) {
    const count = Number(git(`rev-list --count origin/dev..origin/${RELEASE_BRANCH}`));
    const tipEmail = git(`log -1 --format=%ce origin/${RELEASE_BRANCH}`);
    if (count > 1 || tipEmail !== BOT_EMAIL) {
      must(
        `gh pr comment ${openPr} --body-file ${tmpFile(
          'comment.md',
          '🟡 **Manual commits detected on `release/next`** — the bot did **not** rebuild this cycle.\n\n' +
            `Review and merge as-is, or run \`git push origin --delete ${RELEASE_BRANCH}\` to hand the branch back to the bot.`,
        )}`,
      );
      console.log(
        `release-agent: manual commits on ${RELEASE_BRANCH} — paused, decision handed back`,
      );
      return;
    }
  }

  git(`checkout -B ${RELEASE_BRANCH} origin/dev`);
  writeChangelog(buildEntry(next, items));
  setVersion(WORKER_PKG, next);
  setVersion(PLUGIN_PKG, next);
  git(`add ${CHANGELOG} ${WORKER_PKG} ${PLUGIN_PKG}`);
  git(
    `-c user.name='${BOT_NAME}' -c user.email='${BOT_EMAIL}' commit -m "chore(release): agent-activity ${next}"`,
  );
  must(
    `git push ${hasRemoteBranch ? '--force-with-lease' : ''} origin ${RELEASE_BRANCH}:${RELEASE_BRANCH}`.replace(
      /\s+/g,
      ' ',
    ),
  );

  const title = `Release: agent-activity v${next}`;
  const body =
    `## Release preview: agent-activity v${next}\n\n` +
    `Suggested bump: **${level}** — driven by \`${source}\`.\n` +
    `Window: ${commits.length} commit(s) since the previous release.\n\n` +
    `${renderSections(items)}\n\n` +
    '---\n\n' +
    `Merging this PR with **Create a merge commit** ships v${next}: the \`activity-v${next}\` tag is applied ` +
    'automatically on merge; deploy the worker from the tag afterwards.\n\n' +
    `- Exclude something: add \`git revert\` commit(s) on \`${RELEASE_BRANCH}\` — the bot pauses on manual commits and leaves this PR to you.\n` +
    `- Override the version: commit a \`package.json\` version edit on \`${RELEASE_BRANCH}\` (the bot pauses too).\n`;
  if (openPr !== null) {
    must(`gh pr edit ${openPr} --title "${title}" --body-file ${tmpFile('body.md', body)}`);
    console.log(`release-agent: release PR #${openPr} updated → v${next} (${level})`);
  } else {
    const url = must(
      `gh pr create --base main --head ${RELEASE_BRANCH} --title "${title}" --body-file ${tmpFile('body.md', body)}`,
    );
    console.log(`release-agent: release PR opened → ${url}`);
  }
}

// --------------------------------------------------------------------- tag

function modeTag(): void {
  requireCi();
  must('git fetch origin --tags --quiet');
  const versions = readVersions();
  if (versions.worker === null || versions.plugin === null) {
    die('agent-activity pair not found in the tree — tag mode runs on main after a release merge');
  }
  if (versions.worker !== versions.plugin) {
    die(
      `lockstep violation: worker ${versions.worker} != plugin ${versions.plugin} — both must carry the same version`,
    );
  }
  const tag = `${TAG_PREFIX}${versions.worker}`;
  if (run(`git rev-parse -q --verify refs/tags/${tag}`).ok) {
    console.log(`release-agent: ${tag} already exists — nothing to do`);
    return;
  }
  git(
    `-c user.name='${BOT_NAME}' -c user.email='${BOT_EMAIL}' tag -a ${tag} -m "agent-activity ${versions.worker}"`,
  );
  must(`git push origin ${tag}`);
  console.log(
    `release-agent: ${tag} pushed. Next: deploy the worker from this tag (apps/activity-worker → pnpm deploy), ` +
      'then verify plugin pickup on your OpenCode instances.',
  );
}

// --------------------------------------------------------------------- main

const usage =
  'usage: node scripts/release-agent.ts check [<range>] [--deep] | apply [patch|minor|major] [--no-edit] [--force] | bot [--force] | tag [--force]';

switch (MODE) {
  case 'check':
    modeCheck(POSITIONAL[0] ?? 'origin/main..HEAD');
    break;
  case 'apply':
    modeApply(POSITIONAL[0]);
    break;
  case 'bot':
    modeBot();
    break;
  case 'tag':
    modeTag();
    break;
  default:
    console.error(usage);
    process.exit(1);
}
