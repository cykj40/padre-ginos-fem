export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function getFullUrl(path) {
    return `${API_URL}${path}`;
}

export function getImageUrl(path) {
    // If it's a full URL, return as is
    if (path.startsWith('http')) return path;
    // Remove /public prefix if it exists
    const cleanPath = path.replace('/public/', '/');
    return cleanPath;
} 