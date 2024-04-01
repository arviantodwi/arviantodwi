import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Arvian.to',
  description: 'Arvi is a TypeScript developer with a bunch of UI/UX design ideas on his mind.',
  keywords: [
    'professional freelancer',
    'indonesian developer',
    'remote worker',
    'front end portfolio',
    'software engineer',
    'javascript engineer',
    'typescript enthusiast',
    'hire me',
  ].join(','),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
