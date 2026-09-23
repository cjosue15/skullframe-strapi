import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: new URL('http://localhost:1337').hostname, // ✅ only your backend
      },
    ],
  },
};

export default nextConfig;
