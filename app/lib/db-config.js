/**
 * Database configuration file
 * Handles different database connections based on environment
 */

const isNetlify = process.env.NETLIFY || false;
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Get database configuration based on environment
 */
export function getDatabaseConfig() {
    // For Netlify deployments, use in-memory mode only
    if (isNetlify) {
        console.log('Running on Netlify - using in-memory database mode only');
        return {
            useServerApi: false,
            useInMemoryOnly: true
        };
    }

    // For local development, use SQLite with fallback to in-memory
    if (isDevelopment) {
        console.log('Running in development - using SQLite with in-memory fallback');
        return {
            useServerApi: true,
            useInMemoryOnly: false
        };
    }

    // Default fallback
    console.log('Using default database configuration with in-memory fallback');
    return {
        useServerApi: true,
        useInMemoryOnly: false
    };
}

export default getDatabaseConfig; 