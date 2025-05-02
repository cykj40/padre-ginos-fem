/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    // Set output to standard for development
    // output: 'export', // Change to export for static site generation if needed
    images: {
        unoptimized: true, // Required for static exports
    },
    // Add trailing slashes for consistent paths
    trailingSlash: true,
    // Disable image optimization for static export
    optimizeFonts: false,
    // Transpile modules
    transpilePackages: ['@tanstack/react-query'],
    // Comment out distDir for development
    // distDir: 'out',
    // Remove exportPathMap - not compatible with app directory

    // Add webpack configuration for better-sqlite3
    webpack: (config, { isServer }) => {
        if (!isServer) {
            // Don't resolve 'fs' module on the client to prevent this error
            config.resolve.fallback = {
                fs: false,
                path: false,
                crypto: false,
            };
        }
        return config;
    },
};

module.exports = nextConfig; 