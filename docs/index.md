# Index

Personal portfolio site (arvian.to). Single page: Header → Hero → About → TechStack → Portfolio → Testimonial → Footer. Next.js 16, React 19, Tailwind 4, TypeScript. No CMS, no DB, no tests — all content hardcoded in components/data. Dark theme, gold accent.

**Read this file first. Read only the doc your task needs.**

## Router

| Task                            | Doc                                                                               |
| ------------------------------- | --------------------------------------------------------------------------------- |
| Add/edit content (any section)  | [structure.md](./structure.md)                                                    |
| Styling, theme, layout patterns | [design.md](./design.md)                                                          |
| Commands, lint, config          | [tooling.md](./tooling.md)                                                        |
| Next.js 16 API specifics        | `node_modules/next/dist/docs/` (breaking vs. training data — check before coding) |

## Where content lives (truth table)

| Content                     | Location                                                                                                   |
| --------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Social links, tech tools    | `src/app/libs/constants.ts` (`GITHUB_URL`, `LINKEDIN_URL`, `TECH_STACK`)                                   |
| Testimonials (data + order) | `src/app/components/ui/TestimonyCarousel.tsx` (inline array)                                               |
| Hero stats (128/32/12)      | `src/app/components/Hero.tsx`                                                                              |
| Rotating role text          | `src/app/components/ui/TypeAnimation.tsx` (sequence array)                                                 |
| Projects                    | images `public/projects/*.webp` + grid in `src/app/components/Portfolio.tsx`                               |
| Availability badge          | `src/app/components/ui/AvailabilityStatus.tsx`; variant set in `Header.tsx` (currently `Status.AVAILABLE`) |
| Page title / SEO / OG cards | `src/app/layout.tsx` metadata; images `public/opengraph-card.png`, `public/twitter-card.png`               |
| Page composition            | `src/app/page.tsx`                                                                                         |
| Theme tokens, custom CSS    | `src/app/globals.css`                                                                                      |
| Portrait, logo              | `public/photo.png`, `public/logo.svg`                                                                      |

<!-- verified against: 28d8aec, 2026-09-30 -->
