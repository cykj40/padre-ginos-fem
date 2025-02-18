export const API_URL = import.meta.env.VITE_API_URL;

// Helper to ensure URL has no trailing slash
const cleanUrl = (url) => url.replace(/\/+$/, '');

export function getFullUrl(path) {
    // Remove leading slash if it exists
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    // Ensure we don't have double slashes
    return `${cleanUrl(API_URL)}/${cleanPath}`;
}

export function getImageUrl(path) {
    // If it's a full URL, return as is
    if (path.startsWith('http')) return path;

    // Remove /public prefix if it exists
    const cleanPath = path.startsWith('/public/') ? path.slice(7) : path;

    // Always use the full API URL for images
    return `${cleanUrl(API_URL)}/public/${cleanPath}`;
}

export async function fetchApi(path, options = {}) {
    const url = getFullUrl(path);
    console.log('Fetching from:', url); // Debug log

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText); // Debug log
        throw new Error(`API call failed: ${response.statusText}`);
    }

    const text = await response.text();
    try {
        return JSON.parse(text);
    } catch (e) {
        console.error('JSON Parse Error:', text); // Debug log
        throw new Error('Invalid JSON response from server');
    }
} 