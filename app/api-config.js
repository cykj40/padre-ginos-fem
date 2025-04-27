// This file controls whether to include API routes in the static build

// For static builds, export an empty configuration
export const config = {
    api: {
        // This will be ignored in the static export
        bodyParser: false,
    },
};

// Flag to check if we're in a static build environment
export const isStaticBuild = process.env.NEXT_PUBLIC_SKIP_API_ROUTES === 'true';

// Helper function to check if we should include API routes
export function shouldIncludeApiRoutes() {
    return !isStaticBuild;
} 