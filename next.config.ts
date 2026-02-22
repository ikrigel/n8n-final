/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for dev
  reactStrictMode: true,
  // Image optimization
  images: {
    unoptimized: true, // For deployment flexibility
  },
};

export default nextConfig;
