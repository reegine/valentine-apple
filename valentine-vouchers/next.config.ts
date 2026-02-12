import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // This tells Next.js to handle these packages correctly on Vercel
  serverExternalPackages: ['cloudinary'],
  
  // Configure images
  images: {
    domains: ['res.cloudinary.com'],
  },
  
  // Disable static optimization for routes that use server-side features
  experimental: {
    serverComponentsExternalPackages: ['cloudinary'],
  },
};

export default nextConfig;