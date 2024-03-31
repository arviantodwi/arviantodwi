/** @type {import('lint-staged').Config} */
const lintStagedConfig = {
    'src/**/*.{ts,tsx}': [],
    '**/*.{css,cjs,json,md,mjs}': []
};

export default lintStagedConfig;
