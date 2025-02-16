export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function getFullUrl(path) {
    return `${API_URL}${path}`;
}

export function getImageUrl(path) {
    // If it's a full URL, return as is
    if (path.startsWith('http')) return path;

    // If we're in production, use the full API URL
    if (import.meta.env.PROD) {
        // Remove /public prefix if it exists since it's already in the API URL
        const cleanPath = path.startsWith('/public/') ? path.slice(7) : path;
        return `${API_URL}public/${cleanPath}`;
    }

    // In development, keep the /public prefix for the proxy to work
    return path.startsWith('/public/') ? path : `/public/${path}`;
} 