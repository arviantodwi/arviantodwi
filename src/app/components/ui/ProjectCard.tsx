import { getImageProps } from 'next/image';
import type { FC } from 'react';
import { TbArrowUpRight } from 'react-icons/tb';
import { cx } from '@/app/lib/utils';
import { IconHash } from './icons';

/**
 * One portfolio item, per Figma node 681-441: full-bleed-scaled preview
 * panel above a details row (gold brand marker + title + `#`-prefixed
 * discipline tags + description + circular "open project" link).
 *
 * - `wide`   — full-width featured item (desktop preview 510px tall).
 * - `compact`— half-column card in a two-per-row collection (360px tall).
 * On mobile (<md) both variants render at the same size, and the preview
 * panel bleeds to the viewport edges (the section's horizontal gutters
 * are cancelled with negative margins).
 *
 * Images are placeholder exports at their exact final paths; swapping the
 * files under `public/projects/` never changes this component.
 */
export interface ProjectCardProps {
  variant: 'wide' | 'compact';
  /** "Open project" target; when omitted the arrow button is not rendered. */
  href?: string;
  title: string;
  tags: string[];
  description: string;
  /** WebP primary source, PNG fallback — same chain as the old section. */
  image: string;
  imageFallback: string;
  /** Tailwind bg for the preview surface shown behind/around the image. */
  surface: string;
  alt: string;
  /** Extra classes on the root <article> (e.g. the scroll-fade hook). */
  className?: string;
}

/** Per-variant preview classes; mobile rules are shared by both. */
const PREVIEW: Record<ProjectCardProps['variant'], string> = {
  wide: 'md:h-[510px]',
  compact: 'md:h-[360px]',
};

/** Notable widths shared by webp source + png fallback (wide = full bleed). */
const SIZES: Record<ProjectCardProps['variant'], string> = {
  wide: '(max-width: 767px) 100vw, (max-width: 1023px) 640px, (max-width: 1279px) 848px, (max-width: 1439px) calc(100vw - 240px), 1200px',
  compact:
    '(max-width: 767px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 416px, (max-width: 1439px) calc((100vw - 272px)/2), 584px',
};

export const ProjectCard: FC<ProjectCardProps> = ({
  variant,
  href,
  title,
  tags,
  description,
  image,
  imageFallback,
  surface,
  alt,
  className,
}) => (
  <article className={cx('flex w-full flex-col', className)}>
    {/* Preview panel — edge-to-edge on mobile, rounded inside gutters from md. */}
    <div
      className={cx(
        'relative -mx-6 h-[280px] overflow-hidden md:mx-0 md:rounded-lg',
        surface,
        PREVIEW[variant],
      )}
    >
      {/* Explicit webp→png fallback chain built from getImageProps: both
          variants flow through the Next image optimizer, modern browsers
          pick the webp source, legacy browsers get the optimized png.
          object-cover + object-center: today's placeholder exports and the
          future flat device-mockup exports both frame correctly. */}
      <picture>
        <source
          srcSet={
            getImageProps({ src: image, alt: '', fill: true, sizes: SIZES[variant] }).props.srcSet
          }
          type="image/webp"
          sizes={SIZES[variant]}
        />
        <img
          {...getImageProps({ src: imageFallback, alt: '', fill: true, sizes: SIZES[variant] })
            .props}
          alt={alt}
          className="absolute inset-0 size-full object-cover object-center"
        />
      </picture>
    </div>

    {/* Details — title row is its own flex line: the 8px gold marker is the
        title's ::before, flex-centered to the text and spaced 16px from it
        (per Figma: dot 8px at x=0, title text starts at x=24). Tags +
        description get pl-[24px] so they align with the title text start. */}
    <div className="flex w-full items-start gap-[16px] pt-[20px] pb-[8px]">
      <div className="flex min-w-px flex-1 flex-col items-start gap-[12px]">
        <h3
          className={cx(
            'flex items-center gap-[16px] font-general font-semibold text-white leading-[1.3]',
            'text-[19px] tracking-[-0.38px]',
            'md:text-[24px] md:tracking-[-0.48px]',
            variant === 'wide' && 'md:text-[30px] md:tracking-[-0.6px]',
            'before:size-[8px] before:shrink-0 before:bg-gold before:content-[""]',
          )}
        >
          {title}
        </h3>
        <div className="flex w-full flex-wrap content-start items-start gap-x-[12px] gap-y-2 pl-[24px]">
          {tags.map((tag) => (
            <span key={tag} className="flex items-center gap-[2px]">
              <IconHash size={16} className="text-white/75" />
              <span className="font-general text-[12px] text-white/75 leading-[1.4]">{tag}</span>
            </span>
          ))}
        </div>
        <p className="w-full font-general text-[16px] text-white/75 pl-[24px] leading-[1.5]">
          {description}
        </p>
      </div>
      {href && (
        <a
          href={href}
          aria-label={`Open project: ${title}`}
          className="flex size-[40px] shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition-colors duration-150 hover:border-gold hover:text-gold"
        >
          <TbArrowUpRight size={20} />
        </a>
      )}
    </div>
  </article>
);
