/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Optimize images
  images: {
    formats: ['image/webp'],
  },

  // Enable compression
  compress: true,
};

export default nextConfig;
