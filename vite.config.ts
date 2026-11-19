import { defineConfig } from 'vite-plus';

// Single root config: Vite+ disables nested lint/fmt configs, so every
// workspace package's checks are governed from here. Package- or
// file-specific settings live in the `overrides` arrays below.
// The fmt/lint style was ported 1:1 from the pre-monorepo biome.json
// (2026-11-19); comments mark where each Biome setting went.
export default defineConfig({
  fmt: {
    ignorePatterns: [
      '**/.next/**',
      '**/node_modules/**',
      '**/out/**',
      '**/public/**',
      '.agents/**',
      '.fallow/**',
      '.openchamber/**',
      'tmp/**',
    ],
    singleQuote: true,
    // Already Oxfmt defaults, listed for parity with biome.json:
    // indent space/2, printWidth 100, LF, semicolons, trailing commas
    // 'all', JSX double quotes, bracketSameLine false, arrow parens 'always'.
    sortImports: { newlinesBetween: false },
    sortTailwindcss: {
      stylesheet: 'apps/web/src/app/globals.css',
      functions: ['cx', 'clsx'],
    },
    sortPackageJson: false,
    overrides: [
      {
        // Biome: json.formatter.trailingCommas = none
        files: ['**/*.jsonc'],
        options: { trailingComma: 'none' },
      },
    ],
  },
  lint: {
    ignorePatterns: [
      '**/.next/**',
      '**/node_modules/**',
      '**/out/**',
      '.agents/**',
      '.fallow/**',
      '.openchamber/**',
      'tmp/**',
    ],
    plugins: ['eslint', 'typescript', 'react', 'nextjs', 'jsx-a11y'],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    // Baseline approximating Biome's 'recommended' preset; noisy rules
    // that Biome did not flag are tuned down in `rules` as they surface.
    categories: {
      correctness: 'error',
      suspicious: 'error',
    },
    rules: {
      // React 19 automatic JSX runtime — no React import needed; Biome's
      // recommended set never required one.
      'react/react-in-jsx-scope': 'off',
      // role="status" live regions are intentional (ContactForm aria-live
      // pattern); <output> is a form-result element, not an equivalent.
      'jsx-a11y/prefer-tag-over-role': 'off',
      // React Compiler analysis — stricter than the Biome baseline ever
      // was. Findings existed (render-time ref reads in LangSwitcher /
      // Select / Popover / ContactForm, Date.now in render, setState in
      // effects); adopting these rules is a deliberate follow-up.
      'react/refs': 'off',
      'react/purity': 'off',
      'react/set-state-in-effect': 'off',
      // Core style rules outside Biome's recommended set.
      'eslint/no-underscore-dangle': 'off',
      'eslint/no-shadow': 'off',
      // Type-aware extras beyond Biome parity (Biome ran without
      // type-aware linting). Re-enable deliberately if wanted later.
      'typescript/no-unsafe-type-assertion': 'off',
      'typescript/consistent-return': 'off',
      'typescript/no-misused-spread': 'off',
    },
    // `settings.next.rootDir` is not needed: the plugin auto-detects
    // next.config.* above the linted files.
    overrides: [
      {
        // Biome: performance/noImgElement off — raw <img> is needed by
        // the marquee strip.
        files: ['apps/web/src/app/components/ui/ToolsMarquee.tsx'],
        rules: {
          'nextjs/no-img-element': 'off',
        },
      },
    ],
  },
});
