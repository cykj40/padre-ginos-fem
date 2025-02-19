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

// Helper to ensure URL starts with https:// or http://
const ensureAbsoluteUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

export function getFullUrl(path) {
    if (!path) return cleanUrl(API_URL);
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/^\/+/, '');
    return `${cleanUrl(API_URL)}/${cleanPath}`;
}

export function getImageUrl(path) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/^\/?(public\/)?/, '');
    return ensureAbsoluteUrl(`public/${cleanPath}`);
}

export async function fetchApi(path, options = {}) {
    const url = getFullUrl(path);
    const requestId = Math.random().toString(36).substring(7);

    console.log(`[${requestId}] Starting API request:`, {
        url,
        method: options.method || 'GET',
        path,
        baseUrl: API_URL
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
        throw error;
    }
} 