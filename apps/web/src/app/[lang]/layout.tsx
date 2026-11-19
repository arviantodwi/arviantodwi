import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Antonio, IBM_Plex_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import { notFound } from 'next/navigation';
import { getDictionary, hasLocale, locales } from '../lib/i18n';
import '../globals.css';

const antonioSans = Antonio({
  variable: '--font-antonio',
  weight: ['700'],
  subsets: ['latin'],
});

const jakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
});

// Mono voice of the AI toolkit band (pen: IBM Plex Mono on overlines,
// routing labels and model chips) — mapped as --font-mono in globals.css.
const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  weight: ['400', '500', '600'],
  subsets: ['latin'],
});

const SITE_URL = 'https://arvian.to';
const SITE_NAME = 'Arvianto Dwi Wicaksono';

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) return {};

  const { metadata } = getDictionary(lang);
  const description = metadata.description;
  const canonical = lang === 'en' ? '/' : `/${lang}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: SITE_NAME,
    description,
    alternates: {
      canonical,
      languages: { en: '/', id: '/id' },
    },
    openGraph: {
      type: 'website',
      title: SITE_NAME,
      description,
      url: canonical,
      siteName: SITE_NAME,
      images: [
        {
          url: `${SITE_URL}/opengraph-card.png`,
          width: 1200,
          height: 630,
        },
      ],
      locale: metadata.ogLocale,
      alternateLocale: lang === 'en' ? 'id_ID' : 'en_US',
      countryName: 'Indonesia',
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description,
      site: SITE_URL,
      images: [`${SITE_URL}/opengraph-card.png`],
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang}>
      <body
        className={`${antonioSans.variable} ${jakartaSans.variable} ${plexMono.variable} antialiased`}
      >
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
