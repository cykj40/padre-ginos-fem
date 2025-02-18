export const API_URL = import.meta.env.VITE_API_URL || 'https://padre-ginos-fem.onrender.com';

if (!API_URL) {
    console.error('VITE_API_URL is not set in environment variables');
}

// Helper to ensure URL has no trailing slash
const cleanUrl = (url) => url?.replace(/\/+$/, '') || '';

export function getFullUrl(path) {
    if (!path) return cleanUrl(API_URL);

    // Remove leading slash if it exists, as we'll add it back in a controlled way
    const cleanPath = path.replace(/^\/+/, '');

    // Construct the full URL, ensuring no double slashes
    return `${cleanUrl(API_URL)}/${cleanPath}`;
}

export function getImageUrl(path) {
    if (!path) return '';
    // If it's a full URL, return as is
    if (path.startsWith('http')) return path;

    // Remove /public prefix if it exists
    const cleanPath = path.replace(/^\/?(public\/)?/, '');

    // Always use the full API URL for images
    return `${cleanUrl(API_URL)}/public/${cleanPath}`;
}

export async function fetchApi(path, options = {}) {
    const url = getFullUrl(path);
    console.log('Fetching from:', url); // Debug log

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...options.headers,
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                body: errorText
            });
            throw new Error(`API call failed: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch (error) {
            console.error('JSON Parse Error:', {
                text,
                error: error.message
            });
            throw new Error('Invalid JSON response from server');
        }
    } catch (error) {
        console.error('Fetch Error:', {
            url,
            error: error.message
        });
        throw error;
    }
} 