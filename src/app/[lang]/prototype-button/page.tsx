import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { FC } from 'react';
import { PrototypeSwitcher } from '@/app/components/prototype-button/PrototypeSwitcher';
import { VariantA } from '@/app/components/prototype-button/VariantA';
import { VariantB } from '@/app/components/prototype-button/VariantB';
import { VariantC } from '@/app/components/prototype-button/VariantC';
import { VariantD } from '@/app/components/prototype-button/VariantD';
import {
  hasVariantKey,
  VARIANTS,
  type VariantKey,
} from '@/app/components/prototype-button/variants';
import { hasLocale } from '@/app/lib/i18n';

/*
 * PROTOTYPE (button spec, 2026-11-04) — throwaway route, dev-gated and
 * noindex. Entry URLs: /prototype-button (dev rewrite, see proxy.ts) and
 * /id/prototype-button; /en/prototype-button redirects to the unprefixed
 * one. Three structurally different button design systems rendering
 * the same matrix (primary/secondary × text / leading / trailing / icon-only
 * × default / loading / disabled + sizes), switchable via `?variant=`.
 * Hover and click act live on every button; the state rows pin loading and
 * disabled. Contact section is the deliberate exception: its send button
 * keeps the custom send-plane loading (never migrated to ui/Button) and —
 * on Variant D only — mounts as a comparison exhibit in ContactSend.
 */

const REGISTRY: Record<VariantKey, FC> = { A: VariantA, B: VariantB, C: VariantC, D: VariantD };

export const metadata: Metadata = {
  title: 'Button — prototype',
  robots: { index: false, follow: false },
};

export default async function ButtonPrototypePage({
  params,
  searchParams,
}: PageProps<'/[lang]/prototype-button'>) {
  if (process.env.NODE_ENV === 'production') notFound();

  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const { variant } = await searchParams;
  const current = typeof variant === 'string' && hasVariantKey(variant) ? variant : 'A';
  const Variant = REGISTRY[current];

  return (
    <main className="bg-background text-foreground min-h-screen w-screen">
      <div className="mx-auto flex max-w-4xl flex-col gap-16 px-6 py-24 pb-32">
        <header className="flex flex-col gap-3">
          <p className="text-gold text-xs font-medium tracking-widest uppercase">Prototype</p>
          <h1 className="font-headline text-4xl uppercase">Reusable button — spec sweep</h1>
          <p className="opacity-75">
            Same spec, three design systems.{' '}
            <strong className="text-gold">Hover and click any button</strong> — those states act
            live; loading and disabled are pinned in rows below each. Cycle variants with the bottom
            bar or the ←/→ arrow keys.
          </p>
        </header>

        <Variant />

        <p className="border-t border-white/15 pt-6 text-sm opacity-60">
          Contact section stays an exception: its send button keeps the custom send-plane loading
          animation (swap plane + trails + 3s cancel bar) and is never migrated into the shared
          button. Variant D carries it as an exhibit — shipped skin vs sharp-glass re-skin — with
          the pinned rows looping the cancel-bar sweep.
        </p>
      </div>

      <PrototypeSwitcher variants={VARIANTS} current={current} />
    </main>
  );
}
