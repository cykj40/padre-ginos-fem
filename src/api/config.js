export const API_URL = import.meta.env.VITE_API_URL;

export function getFullUrl(path) {
    // Remove leading slash if it exists
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${API_URL}/${cleanPath}`;
}

export function getImageUrl(path) {
    // If it's a full URL, return as is
    if (path.startsWith('http')) return path;

    // Remove /public prefix if it exists
    const cleanPath = path.startsWith('/public/') ? path.slice(7) : path;

    // Always use the full API URL for images
    if (path.includes('pizzas/')) {
        // For pizza images, use the ID-based naming
        const pizzaId = path.split('/').pop().split('.')[0];
        return `${API_URL}/public/pizzas/${pizzaId}.webp`;
    }
    return `${API_URL}/public/${cleanPath}`;
}

export async function fetchApi(path, options = {}) {
    const url = getFullUrl(path);
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
    }
    return response.json();
} 