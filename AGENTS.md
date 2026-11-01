<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Agents language

Always give response in English. Sometimes I see a Chinese/Mandarin response, and I don't understand it. Keep it clear by using only English on every response.

## Project docs (progressive disclosure)

Read `docs/index.md` before making changes. It routes to `docs/structure.md`, `docs/design.md`, and `docs/tooling.md` — load only the doc your task needs.

When your changes touch anything documented there (components, content locations, theme, tooling config), update the related doc in the same task. Move the doc's `verified against` comment to the new commit SHA and date.

## Pencil MCP (design → code)

When doing design → code work with the pencil MCP, do not test the implementation results in pencil's built-in browser.

## Browser verification

Verify in a browser only when explicitly asked. When asked, use the Chrome DevTools MCP for browser verification.

When there is a need to run the dev server, always use port 3001 instead of 3000 so local dev server won't be killed.

## Git policy

Never commit after every change. Commit only when the user explicitly instructed.
