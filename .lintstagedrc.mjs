import path from 'node:path';

/**
 * @param {string[]} filenames
 */
function buildEslintCommand(filenames) {
  const stagedFiles = filenames.map((file) => path.relative(process.cwd(), file)).join(' --file ');
  const options = [
    '--cache-location .cache/.eslintcache',
    '--cache-strategy metadata',
    '--cache',
    '--dir src',
    '--fix',
    // keep --file option last
    '--file',
  ].join(' ');
  const command = `next lint ${options} ${stagedFiles}`;

  return command;
}

/**
 * @param {string[]} filenames
 */
function buildPrettierCommand(filenames) {
  const stagedFiles = filenames.map((file) => path.relative(process.cwd(), file)).join(' ');
  const options = [
    '--cache-location .cache/.prettiercache',
    '--cache-strategy metadata',
    '--cache',
    '--write',
  ].join(' ');
  const command = `npx prettier ${options} ${stagedFiles}`;

  return command;
}

/** @type {import('lint-staged').Config} */
const lintStagedConfig = {
  'src/**/*.{ts,tsx}': [buildEslintCommand, buildPrettierCommand],
  '**/*.{css,cjs,json,md,mjs}': [buildPrettierCommand],
};

export default lintStagedConfig;
