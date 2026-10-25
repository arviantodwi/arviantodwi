import type { FC, SVGProps } from 'react';

/**
 * Custom inline icons styled after Tabler's conventions (24×24 viewBox,
 * 2px round-cap stroke, `currentColor`) — Tabler itself doesn't ship these
 * shapes, and self-hosting them keeps the icon set dependency-free.
 * Stroke geometry traced verbatim from the Figma design's stage glyphs.
 * Add further icons here instead of dropping more .svg files into `public/`.
 */
export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

/** Shape networks joined by spokes — used for the PLAN stage. */
export const IconPolygon: FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M10.5858 6.41421C10.2107 6.03914 10 5.53043 10 5C10 4.46957 10.2107 3.96086 10.5858 3.58579C10.9609 3.21071 11.4696 3 12 3C12.5304 3 13.0391 3.21071 13.4142 3.58579C13.7893 3.96086 14 4.46957 14 5C14 5.53043 13.7893 6.03914 13.4142 6.41421C13.0391 6.78929 12.5304 7 12 7C11.4696 7 10.9609 6.78929 10.5858 6.41421Z" />
    <path d="M17.5858 9.41421C17.2107 9.03914 17 8.53043 17 8C17 7.46957 17.2107 6.96086 17.5858 6.58579C17.9609 6.21071 18.4696 6 19 6C19.5304 6 20.0391 6.21071 20.4142 6.58579C20.7893 6.96086 21 7.46957 21 8C21 8.53043 20.7893 9.03914 20.4142 9.41421C20.0391 9.78929 19.5304 10 19 10C18.4696 10 17.9609 9.78929 17.5858 9.41421Z" />
    <path d="M3.58579 12.4142C3.21071 12.0391 3 11.53043 3 11C3 10.46957 3.21071 9.96086 3.58579 9.58579C3.96086 9.21071 4.46957 9 5 9C5.53043 9 6.03914 9.21071 6.41421 9.58579C6.78929 9.96086 7 10.4696 7 11C7 11.5304 6.78929 12.0391 6.41421 12.4142C6.03914 12.7893 5.53043 13 5 13C4.46957 13 3.96086 12.7893 3.58579 12.4142Z" />
    <path d="M13 19C13 19.5304 13.2107 20.0391 13.5858 20.4142C13.9609 20.7893 14.4696 21 15 21C15.5304 21 16.0391 20.7893 16.4142 20.4142C16.7893 20.0391 17 19.5304 17 19C17 18.4696 16.7893 17.9609 16.4142 17.5858C16.0391 17.2107 15.5304 17 15 17C14.4696 17 13.9609 17.2107 13.5858 17.5858C13.2107 17.9609 13 18.4696 13 19Z" />
    <path d="M6.5 9.5L10 6.5" />
    <path d="M14 5.5L17 7" />
    <path d="M18.5 10L16 17" />
    <path d="M13.5 17.5L6.5 12.5" />
  </svg>
);

/** Four hash strokes — used as the prefix glyph of portfolio item tags. */
export const IconHash: FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    /* Lighter than the set default — the # prefix reads as a quiet
       marker next to the tag label, not a full-strength glyph. */
    strokeWidth={1.25}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M5 9L19 9" />
    <path d="M5 15L19 15" />
    <path d="M11 4L7 20" />
    <path d="M17 4L13 20" />
  </svg>
);
/** Quarter-circle overlapping a rounded square — used for the DESIGN stage. */
export const IconCircleSquare: FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M4.90381 14.0962C3.68482 12.8772 3 11.2239 3 9.5C3 7.77609 3.68482 6.12279 4.90381 4.90381C6.12279 3.68482 7.77609 3 9.5 3C11.2239 3 12.8772 3.68482 14.0962 4.90381C15.3152 6.12279 16 7.77609 16 9.5C16 11.2239 15.3152 12.8772 14.0962 14.0962C12.8772 15.3152 11.2239 16 9.5 16C7.77609 16 6.12279 15.3152 4.90381 14.0962Z" />
    <path d="M10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10H19C19.5304 10 20.0391 10.2107 20.4142 10.5858C20.7893 10.9609 21 11.4696 21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H12C11.4696 21 10.9609 20.7893 10.5858 20.4142C10.2107 20.0391 10 19.5304 10 19V12Z" />
  </svg>
);

/** Isometric wireframe of a gem/icosahedron — used for the DEVELOP stage. */
export const IconIcosahedron: FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M21 15.993V8.007C20.9999 7.65484 20.9068 7.30894 20.7302 7.00429C20.5535 6.69963 20.2996 6.44702 19.994 6.272L12.994 2.265C12.6914 2.09168 12.3487 2.0005 12 2.0005C11.6513 2.0005 11.3086 2.09168 11.006 2.265L4.006 6.272C3.70041 6.44702 3.44645 6.69963 3.26981 7.00429C3.09316 7.30894 3.00009 7.65484 3 8.007V15.993C3.00009 16.3452 3.09316 16.6911 3.26981 16.9957C3.44645 17.3004 3.70041 17.553 4.006 17.728L11.006 21.735C11.3086 21.9083 11.6513 21.9995 12 21.9995C12.3487 21.9995 12.6914 21.9083 12.994 21.735L19.994 17.728C20.2996 17.553 20.5535 17.3004 20.7302 16.9957C20.9068 16.6911 20.9999 16.3452 21 15.993Z" />
    <path d="M3.29 6.97L7.5 9" />
    <path d="M20.71 6.97L16.5 9" />
    <path d="M20.7 17H3.3" />
    <path d="M11.76 2.03L7.5 9L3.2 16.84" />
    <path d="M12.24 2.03C14.1047 4.99 15.5247 7.31333 16.5 9C17.4753 10.6867 18.9087 13.3 20.8 16.84" />
    <path d="M12 17L7.5 9H16.5L12 17Z" />
    <path d="M12 17V22" />
  </svg>
);

/*
 * Icons below are traced verbatim from MIT-licensed icon sets (Tabler v2,
 * Phosphor, Ant Design) so the swap away from react-icons is pixel-identical.
 * Stroke icons keep the set defaults; filled marks use their native viewBox.
 */

/** Globe with "A" glyph — used as the label prefix in the language switcher. */
export const IconLanguage: FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M4 5h7" />
    <path d="M9 3v2c0 4.418 -2.239 8 -5 8" />
    <path d="M5 9c0 2.144 2.952 3.908 6.7 4" />
    <path d="M12 20l4 -9l4 9" />
    <path d="M19.1 18h-6.2" />
  </svg>
);

/** Up/down chevron pair — used as the dropdown affordance in the language switcher. */
export const IconSelector: FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M8 9l4 -4l4 4" />
    <path d="M16 15l-4 4l-4 -4" />
  </svg>
);

/** Diagonal arrow pointing up-right — used to mark external links/CTAs. */
export const IconArrowUpRight: FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M17 7l-10 10" />
    <path d="M8 7l9 0l0 9" />
  </svg>
);

/** Single checkmark — used as the contact form success badge. */
export const IconCheck: FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M5 12l5 5l10 -10" />
  </svg>
);

/**
 * Filled caret left/right — testimony carousel navigators.
 * Phosphor "bold" geometry (256 viewBox), MIT.
 */
export const IconCaretLeft: FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M168.49,199.51a12,12,0,0,1-17,17l-80-80a12,12,0,0,1,0-17l80-80a12,12,0,0,1,17,17L97,128Z" />
  </svg>
);

export const IconCaretRight: FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,1,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z" />
  </svg>
);

/**
 * Filled brand marks (Ant Design geometry, 1024 viewBox, MIT) — rendered
 * pixel-identical to the previous react-icons/ai versions in SocialNav.
 */
export const IconBrandGithub: FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 1024 1024"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0 1 38.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" />
  </svg>
);

export const IconBrandLinkedin: FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 1024 1024"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM349.3 793.7H230.6V411.9h118.7v381.8zm-59.3-434a68.8 68.8 0 1 1 68.8-68.8c-.1 38-30.9 68.8-68.8 68.8zm503.7 434H675.1V608c0-44.3-.8-101.2-61.7-101.2-61.7 0-71.2 48.2-71.2 98v188.9H423.7V411.9h113.8v52.2h1.6c15.8-30 54.5-61.7 112.3-61.7 120.2 0 142.3 79.1 142.3 181.9v209.4z" />
  </svg>
);
