# Index

Personal portfolio site (arvian.to). Single page: Header → Hero → About → TechStack → AiWorkflow → Portfolio → Testimonial → Footer (band + contact scaffold). Next.js 16, React 19, Tailwind 4, TypeScript. No CMS, no DB, no tests — all content hardcoded in components/data. Dark theme, gold accent. Bilingual (en at `/`, id at `/id`, dictionaries in `src/app/lib/i18n/`).

**Read this file first. Read only the doc your task needs.**

## Router

| Task                            | Doc                                                                               |
| ------------------------------- | --------------------------------------------------------------------------------- |
| Add/edit content (any section)  | [structure.md](./structure.md)                                                    |
| Styling, theme, layout patterns | [design.md](./design.md)                                                          |
| Commands, lint, config          | [tooling.md](./tooling.md)                                                        |
| Figma → Code via MCP            | [figma.md](./figma.md)                                                            |
| Next.js 16 API specifics        | `node_modules/next/dist/docs/` (breaking vs. training data — check before coding) |

## Where content lives (truth table)

| Content                         | Location                                                                                             |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| All visible copy (both locales) | `src/app/lib/i18n/en.ts` + `id.ts` (`Dictionary` shape in `types.ts`)                                |
| Locale routing / redirects      | `src/proxy.ts` (Accept-Language detect, `/` → `/en` rewrite, `/en` → `/`, `/id` direct)              |
| Social links, tech tools        | `src/app/lib/constants/` (`index.ts` URLs/cookie, `stack.ts` `TECH_STACK` — barrel re-export)        |
| Page title / SEO / OG cards     | `src/app/[lang]/layout.tsx` `generateMetadata` (text per locale from dicts; images unchanged)        |
| Availability badge              | variant in `Header.tsx` (currently `Status.AVAILABLE`); label text in dictionaries (`header.status`) |
| Footer mast links/labels        | labels in dictionaries (`footer.mast.*`); hrefs/anchors composed in `Footer.tsx` (section ids `#about`, `#human-ai`, `#portfolio`, `#testimonials`, `#contact`) |
| Theme tokens, custom CSS        | `src/app/globals.css`                                                                                |
| Page composition                | `src/app/[lang]/page.tsx`                                                                            |
| Portrait, logo                  | `public/photo.png`, `public/logo.svg` (header + footer — footer at `h-20 opacity-15`); `public/footer-aurora.png` (footer band, exported from the .pen Main artboard) |

<!-- verified against: working tree, 2026-10-19 (footer band content + aurora/glass; move SHA on next commit) -->
