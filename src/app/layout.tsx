import type { Metadata } from 'next';
import { Antonio, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

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

const title = 'Arvianto Dwi Wicaksono';
const description =
  'Top-rated UI and front-end developer known for pixel-perfect design, clean code, creative vision, and outstanding collaboration. Trusted by teams and project managers for delivering high-quality, eye-catching interfaces that elevate user experience.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    title,
    description,
    url: 'https://arvian.to',
    siteName: title,
    images: [
      {
        url: 'https://arvian.to/opengraph-card.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    countryName: 'Indonesia',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    site: 'https://arvian.to',
    images: [
      {
        url: 'https://arvian.to/opengraph-card.png',
        width: 1200,
        height: 675,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${antonioSans.variable} ${jakartaSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
