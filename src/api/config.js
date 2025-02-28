// Get the API URL from environment variables, with a fallback
const DEFAULT_API_URL = 'https://padre-ginos-fem.onrender.com';
export const API_URL = (() => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (!envUrl) {
        console.warn('VITE_API_URL not set, using default:', DEFAULT_API_URL);
        return DEFAULT_API_URL;
    }
    return envUrl.replace(/\/+$/, '');
})();

// Validate API URL format
if (!API_URL.startsWith('http')) {
    console.error('Invalid API_URL format:', API_URL);
    throw new Error(`Invalid API_URL format: ${API_URL}`);
}

// Log API configuration in development
if (import.meta.env.DEV) {
    console.log('API Configuration:', {
        API_URL,
        NODE_ENV: import.meta.env.MODE,
        isDev: import.meta.env.DEV,
        origin: window.location.origin
    });
}

// Helper to ensure URL has no trailing slash
const cleanUrl = (url) => url?.replace(/\/+$/, '') || '';

export function getFullUrl(path) {
    if (!path) return cleanUrl(API_URL);
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/^\/+/, '');
    return `${cleanUrl(API_URL)}/${cleanPath}`;
}

export function getImageUrl(path) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    // Remove any leading slashes and 'public' from the path
    const cleanPath = path.replace(/^\/?(public\/)?/, '');
    // Ensure we're using HTTPS in production
    const baseUrl = import.meta.env.PROD
        ? 'https://padre-ginos-fem.onrender.com'
        : import.meta.env.VITE_API_URL || 'http://localhost:3000';
    return `${baseUrl}/public/${cleanPath}`;
}

// Maximum number of retries for API calls
const MAX_RETRIES = 1;
// Delay between retries in milliseconds
const RETRY_DELAY = 1000;

export async function fetchApi(path, options = {}) {
    const url = getFullUrl(path);
    const requestId = Math.random().toString(36).substring(7);
    const { retries = 0 } = options;

    console.log(`[${requestId}] Starting API request:`, {
        url,
        method: options.method || 'GET',
        path,
        baseUrl: API_URL,
        retryAttempt: retries
    });

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Request-ID': requestId,
                ...options.headers,
            },
            mode: 'cors',
            credentials: 'omit' // Changed from 'same-origin' to 'omit' for cross-origin requests
        });

        const contentType = response.headers.get('content-type');
        const text = await response.text();

        console.log(`[${requestId}] Response received:`, {
            status: response.status,
            contentType,
            headers: Object.fromEntries(response.headers.entries()),
            preview: text.substring(0, 150)
        });

        // Handle non-JSON responses
        if (!contentType?.includes('application/json')) {
            console.error(`[${requestId}] Invalid content type:`, {
                contentType,
                status: response.status,
                preview: text.substring(0, 150)
            });
            throw new Error(`Expected JSON response but got ${contentType || 'unknown'} (Status: ${response.status})`);
        }

        // Parse JSON response
        let data;
        try {
            data = JSON.parse(text);
        } catch (error) {
            console.error(`[${requestId}] JSON parse error:`, {
                error: error.message,
                text: text.substring(0, 150)
            });
            throw new Error(`Invalid JSON response: ${error.message}`);
        }

        // Handle non-200 responses
        if (!response.ok) {
            console.error(`[${requestId}] API error:`, {
                status: response.status,
                data
            });
            throw new Error(data?.message || `API error: ${response.status} ${response.statusText}`);
        }

        return data;
    } catch (error) {
        console.error(`[${requestId}] Request failed:`, {
            url,
            error: error.message,
            stack: error.stack
        });

        // Retry logic for connection errors
        if (retries < MAX_RETRIES &&
            (error.message.includes('Failed to fetch') ||
                error.message.includes('NetworkError') ||
                error.message.includes('Network request failed'))) {
            console.log(`[${requestId}] Retrying request (${retries + 1}/${MAX_RETRIES})...`);

            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));

            // Retry with incremented retry count
            return fetchApi(path, {
                ...options,
                retries: retries + 1
            });
        }

        throw error;
    }
} 