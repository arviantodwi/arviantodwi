/**
 * Deployed version stamp. CI injects the real value at deploy time via
 * `wrangler deploy --define APP_VERSION:'"<X.Y.Z>"'` (extracted from the
 * `activity-vX.Y.Z` tag). Local runs (`wrangler dev`) leave the global
 * undefined and get `'dev'`.
 */
declare const APP_VERSION: string | undefined;

export const appVersion = (): string =>
  typeof APP_VERSION === 'string' && APP_VERSION !== '' ? APP_VERSION : 'dev';
