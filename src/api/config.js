export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

export function getFullUrl(path) {
    // Remove leading slash if it exists
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${API_URL}${cleanPath}`;
}

export function getImageUrl(path) {
    // If it's a full URL, return as is
    if (path.startsWith('http')) return path;

    // Remove /public prefix if it exists
    const cleanPath = path.startsWith('/public/') ? path.slice(8) : path;

    // In production, use the full API URL
    if (import.meta.env.PROD) {
        return `${API_URL}public/${cleanPath}`;
    }

    // In development, keep the /public prefix
    return `/public/${cleanPath}`;
}

export async function fetchApi(path, options = {}) {
    const url = getFullUrl(path);
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
    }
    return response.json();
} 