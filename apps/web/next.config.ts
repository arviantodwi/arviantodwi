import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // output: 'export',
  images: {
    qualities: [85, 100],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
