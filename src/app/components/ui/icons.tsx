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
