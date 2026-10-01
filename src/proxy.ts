import { type NextRequest, NextResponse } from 'next/server';
import { locales } from './app/libs/i18n';
import { NEXT_LOCALE_COOKIE } from './app/libs/constants';

const DEFAULT_LOCALE = 'en';

/** Match the request's preferred language against the supported locales. */
function detectLocale(request: NextRequest): string {
  const header = request.headers.get('accept-language') ?? '';
  const preferences = header
    .split(',')
    .map((part) => {
      const [tag = '', q = 'q=1'] = part.trim().split(';');
      const quality = Number.parseFloat(q.split('=')[1] ?? '') || 0;
      return { tag: tag.toLowerCase(), quality };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of preferences) {
    for (const locale of locales) {
      if (tag === locale || tag.startsWith(`${locale}-`)) return locale;
    }
  }

  return DEFAULT_LOCALE;
}

/** Locale the visitor explicitly picked, when it's still a supported one. */
function getSelectedLocale(request: NextRequest): string | undefined {
  const selected = request.cookies.get(NEXT_LOCALE_COOKIE)?.value;
  return locales.includes(selected as (typeof locales)[number]) ? selected : undefined;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // A prefixed default locale is canonicalized to the unprefixed URL.
  if (pathname === `/${DEFAULT_LOCALE}` || pathname.startsWith(`/${DEFAULT_LOCALE}/`)) {
    return NextResponse.redirect(
      new URL(pathname.slice(DEFAULT_LOCALE.length + 1) || '/', request.url),
    );
  }

  // Prefixed non-default locales are served as-is.
  if (locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))) {
    return NextResponse.next();
  }

  if (pathname === '/') {
    const selected = getSelectedLocale(request);

    // Visitor explicitly picked a non-default locale → redirect to its prefix.
    if (selected && selected !== DEFAULT_LOCALE) {
      return NextResponse.redirect(new URL(`/${selected}`, request.url));
    }
    // Explicit default choice or no valid selection: fall back to browser language.
    if (!selected && detectLocale(request) !== DEFAULT_LOCALE) {
      return NextResponse.redirect(new URL('/id', request.url));
    }
    // Otherwise render the default locale content on the unprefixed URL.
    return NextResponse.rewrite(new URL(`/${DEFAULT_LOCALE}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
