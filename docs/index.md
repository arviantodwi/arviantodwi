# Index

Personal portfolio site (arvian.to). Single page: Header → Hero → About → TechStack → Portfolio → Testimonial → Footer. Next.js 16, React 19, Tailwind 4, TypeScript. No CMS, no DB, no tests — all content hardcoded in components/data. Dark theme, gold accent. Bilingual (en at `/`, id at `/id`, dictionaries in `src/app/libs/i18n/`).

**Read this file first. Read only the doc your task needs.**

## Router

| Task                            | Doc                                                                               |
| ------------------------------- | --------------------------------------------------------------------------------- |
| Add/edit content (any section)  | [structure.md](./structure.md)                                                    |
| Styling, theme, layout patterns | [design.md](./design.md)                                                          |
| Commands, lint, config          | [tooling.md](./tooling.md)                                                        |
| Next.js 16 API specifics        | `node_modules/next/dist/docs/` (breaking vs. training data — check before coding) |

## Where content lives (truth table)

| Content                         | Location                                                                                             |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| All visible copy (both locales) | `src/app/libs/i18n/en.ts` + `id.ts` (`Dictionary` shape in `types.ts`)                               |
| Locale routing / redirects      | `src/proxy.ts` (Accept-Language detect, `/` → `/en` rewrite, `/en` → `/`, `/id` direct)              |
| Social links, tech tools        | `src/app/libs/constants.ts` (`GITHUB_URL`, `LINKEDIN_URL`, `TECH_STACK`)                             |
| Page title / SEO / OG cards     | `src/app/[lang]/layout.tsx` `generateMetadata` (text per locale from dicts; images unchanged)        |
| Availability badge              | variant in `Header.tsx` (currently `Status.AVAILABLE`); label text in dictionaries (`header.status`) |
| Theme tokens, custom CSS        | `src/app/globals.css`                                                                                |
| Page composition                | `src/app/[lang]/page.tsx`                                                                            |
| Portrait, logo                  | `public/photo.png`, `public/logo.svg`                                                                |

<!-- verified against: 28d8aec, 2026-09-30 -->
