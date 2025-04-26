'use client';

import { createContext, useState, useEffect } from "react";

// Create the cart context with an empty array and a no-op function as default values
export const CartContext = createContext([[], () => { }]);

// Create a provider component for the cart context
export function CartProvider({ children }) {
    // Initialize cart from localStorage if available, otherwise use empty array
    const [cart, setCart] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const savedCart = localStorage.getItem('cart');
                return savedCart ? JSON.parse(savedCart) : [];
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
                return [];
            }
        }
        return [];
    });

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('cart', JSON.stringify(cart));
                console.log('Cart saved to localStorage:', cart);
            } catch (error) {
                console.error('Error saving cart to localStorage:', error);
            }
        }
    }, [cart]);

    return (
        <CartContext.Provider value={[cart, setCart]}>
            {children}
        </CartContext.Provider>
    );
} 