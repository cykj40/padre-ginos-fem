/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: 'export', // Change to export for static site generation
    images: {
        unoptimized: true, // Required for static exports
    },
    // Add trailing slashes for consistent paths
    trailingSlash: true,
    // Disable image optimization for static export
    optimizeFonts: false,
    // Transpile modules
    transpilePackages: ['@tanstack/react-query'],
};

module.exports = nextConfig; 