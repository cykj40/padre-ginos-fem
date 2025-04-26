/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: 'standalone', // Optimizes for Netlify deployment
    images: {
        unoptimized: true, // Helps with static exports
    },
    // Add trailing slashes for consistent paths
    trailingSlash: true,
};

module.exports = nextConfig; 