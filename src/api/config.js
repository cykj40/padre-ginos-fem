// Get the API URL from environment variables, with a fallback
export const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || 'https://padre-ginos-fem.onrender.com';

// Validate API URL format
if (!API_URL.startsWith('http')) {
    console.error('Invalid API_URL format:', API_URL);
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
    // Always use the API_URL as the base for relative URLs
    return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

export function getFullUrl(path) {
    if (!path) return cleanUrl(API_URL);

    // If path is already a full URL, return it
    if (path.startsWith('http')) return path;

    // Remove leading slash if it exists
    const cleanPath = path.replace(/^\/+/, '');

    // Construct the full URL, ensuring no double slashes
    return `${cleanUrl(API_URL)}/${cleanPath}`;
}

export function getImageUrl(path) {
    if (!path) return '';

    // If it's already a full URL, return as is
    if (path.startsWith('http')) return path;

    // Clean the path and ensure it starts with public/
    const cleanPath = path.replace(/^\/?(public\/)?/, '');
    return ensureAbsoluteUrl(`public/${cleanPath}`);
}

export async function fetchApi(path, options = {}) {
    const url = getFullUrl(path);

    if (import.meta.env.DEV) {
        console.log('Fetching from:', url, {
            options,
            path,
            baseUrl: API_URL,
            origin: window.location.origin
        });
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...options.headers,
            },
            mode: 'cors',
            credentials: 'same-origin'
        });

        const contentType = response.headers.get('content-type');
        const text = await response.text();

        // Debug logging
        if (!response.ok || import.meta.env.DEV) {
            console.log('Response details:', {
                status: response.status,
                contentType,
                url,
                text: text.substring(0, 150), // Log first 150 chars
                headers: Object.fromEntries(response.headers.entries())
            });
        }

        // Try to parse as JSON only if content type is correct
        let data;
        if (contentType?.includes('application/json')) {
            try {
                data = JSON.parse(text);
            } catch (error) {
                console.error('JSON Parse Error:', {
                    error: error.message,
                    text: text.substring(0, 150),
                    url,
                    contentType,
                    status: response.status
                });
                throw new Error(`Invalid JSON response from server: ${error.message}`);
            }
        } else {
            const errorDetails = {
                contentType,
                status: response.status,
                url,
                responsePreview: text.substring(0, 150),
                headers: Object.fromEntries(response.headers.entries())
            };
            console.error('Invalid content type:', errorDetails);
            throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}. Status: ${response.status}`);
        }

        if (!response.ok) {
            throw new Error(data?.message || `API call failed: ${response.status} ${response.statusText}`);
        }

        return data;
    } catch (error) {
        // Enhanced error logging
        console.error('API Request Failed:', {
            url,
            error: error.message,
            stack: error.stack,
            origin: window.location.origin,
            apiUrl: API_URL
        });
        throw error;
    }
} 