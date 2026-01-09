import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'https://lecture-titten-huge-going.trycloudflare.com',
      },
    ],
  },

  async rewrites() {
    return [
      {
        // When you fetch('/api/courses'), it goes to http://localhost:4000/api/courses
        source: '/api/:path*',
        destination: 'https://lecture-titten-huge-going.trycloudflare.com/:path*', 
      },
      {
        // For your faculty/course images stored in the uploads folder
        source: '/uploads/:path*',
        destination: 'https://lecture-titten-huge-going.trycloudflare.com/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
