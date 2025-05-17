'use client';

import { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getDatabaseConfig } from '../lib/db-config';

// Get database configuration
const dbConfig = getDatabaseConfig();
const initialUseServerApi = !dbConfig.useInMemoryOnly;

// Create the context
export const CartContext = createContext();

// Local memory store for cart data (used as fallback)
const inMemoryStore = {
    carts: {},
    items: {},
    itemIdCounter: 1
};

// Helper to generate a persistent cart ID
function getCartId() {
    if (typeof window === 'undefined') return null;

    let cartId = localStorage.getItem('cartId');
    if (!cartId) {
        cartId = `cart_${uuidv4()}`;
        localStorage.setItem('cartId', cartId);
    }
    return cartId;
}

// Cart provider component
export function CartProvider({ children }) {
    const [cart, setCart] = useState({ id: null, items: [], total: 0 });
    const [loading, setLoading] = useState(true);
    const [useServerApi, setUseServerApi] = useState(initialUseServerApi); // Flag to control API usage

    // Initialize the cart on component mount
    useEffect(() => {
        async function initializeCart() {
            setLoading(true);
            try {
                const cartId = getCartId();
                if (!cartId) {
                    setLoading(false);
                    return;
                }

                if (useServerApi) {
                    // Try to fetch cart from server
                    try {
                        const response = await fetch(`/api/cart?cartId=${cartId}`);
                        if (!response.ok) {
                            throw new Error('Failed to load cart from server');
                        }

                        const data = await response.json();

                        // Calculate total
                        const total = data.items.reduce(
                            (sum, item) => sum + (item.price * item.quantity),
                            0
                        );

                        setCart({
                            id: data.id,
                            items: data.items || [],
                            total
                        });

                        console.log('Cart loaded from server');
                        return;
                    } catch (apiError) {
                        console.error('API error, falling back to in-memory store:', apiError);
                        setUseServerApi(false); // Switch to local mode if API fails
                    }
                }

                // Fallback to in-memory store
                if (!inMemoryStore.carts[cartId]) {
                    inMemoryStore.carts[cartId] = {
                        id: cartId,
                        items: []
                    };
                }

                // Get items for this cart
                const cartItems = Object.values(inMemoryStore.items)
                    .filter(item => item.cart_id === cartId)
                    .map(item => ({
                        id: item.id,
                        pizzaId: item.pizza_id,
                        name: item.name,
                        size: item.size,
                        quantity: item.quantity,
                        crust: item.crust,
                        price: item.price,
                        toppings: item.toppings || []
                    }));

                // Calculate total
                const total = cartItems.reduce(
                    (sum, item) => sum + (item.price * item.quantity),
                    0
                );

                setCart({
                    id: cartId,
                    items: cartItems,
                    total
                });

                console.log('Cart loaded from in-memory store');
            } catch (error) {
                console.error('Error initializing cart:', error);
                setCart({
                    id: getCartId(),
                    items: [],
                    total: 0
                });
            } finally {
                setLoading(false);
            }
        }

        initializeCart();
    }, [useServerApi]);

    // Add an item to the cart
    const addToCart = async (item) => {
        try {
            setLoading(true);
            const cartId = getCartId();
            if (!cartId) return false;

            if (useServerApi) {
                // Try to add item via API
                try {
                    const response = await fetch(`/api/cart/add?cartId=${cartId}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(item)
                    });

                    if (!response.ok) {
                        throw new Error('Failed to add item to cart via API');
                    }

                    const data = await response.json();

                    // Update cart with the response from the API
                    setCart({
                        id: data.id,
                        items: data.items || [],
                        total: data.total
                    });

                    console.log('Item added to cart via API');
                    return true;
                } catch (apiError) {
                    console.error('API error, falling back to in-memory store:', apiError);
                    setUseServerApi(false); // Switch to local mode if API fails
                }
            }

            // Fallback to in-memory store
            // Initialize the cart if it doesn't exist
            if (!inMemoryStore.carts[cartId]) {
                inMemoryStore.carts[cartId] = {
                    id: cartId,
                    items: []
                };
            }

            // Create a new item with a unique ID
            const itemId = inMemoryStore.itemIdCounter++;
            const newItem = {
                id: itemId,
                cart_id: cartId,
                pizza_id: item.pizzaId || item.pizza?.id,
                name: item.name || item.pizza?.name,
                size: item.size,
                quantity: item.quantity,
                crust: item.crust,
                price: item.price,
                toppings: item.toppings || []
            };

            // Add to in-memory store
            inMemoryStore.items[itemId] = newItem;

            // Update the cart state
            const cartItems = Object.values(inMemoryStore.items)
                .filter(item => item.cart_id === cartId)
                .map(item => ({
                    id: item.id,
                    pizzaId: item.pizza_id,
                    name: item.name,
                    size: item.size,
                    quantity: item.quantity,
                    crust: item.crust,
                    price: item.price,
                    toppings: item.toppings || []
                }));

            const total = cartItems.reduce(
                (sum, item) => sum + (item.price * item.quantity),
                0
            );

            setCart({
                id: cartId,
                items: cartItems,
                total
            });

            console.log('Item added to cart via in-memory store');
            return true;
        } catch (error) {
            console.error('Error adding to cart:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Remove an item from the cart
    const removeFromCart = async (itemId) => {
        try {
            setLoading(true);
            const cartId = getCartId();

            if (useServerApi) {
                // Try to remove item via API
                try {
                    console.log(`Removing item: ${itemId} from cart: ${cartId}`);
                    const response = await fetch(`/api/cart/remove?itemId=${itemId}&cartId=${cartId}`, {
                        method: 'DELETE'
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Failed to remove item:', errorData);
                        throw new Error(`Failed to remove item via API: ${errorData.error || response.statusText}`);
                    }

                    const updatedCart = await response.json();

                    // Use the returned cart from the API
                    setCart({
                        id: updatedCart.id,
                        items: updatedCart.items || [],
                        total: updatedCart.total
                    });

                    console.log('Item removed from cart via API');
                    return true;
                } catch (apiError) {
                    console.error('API error, falling back to in-memory store:', apiError);
                    setUseServerApi(false); // Switch to local mode if API fails
                }
            }

            // Fallback to in-memory store
            // Delete from in-memory store
            delete inMemoryStore.items[itemId];

            // Update the cart state
            const cartItems = Object.values(inMemoryStore.items)
                .filter(item => item.cart_id === cartId)
                .map(item => ({
                    id: item.id,
                    pizzaId: item.pizza_id,
                    name: item.name,
                    size: item.size,
                    quantity: item.quantity,
                    crust: item.crust,
                    price: item.price,
                    toppings: item.toppings || []
                }));

            const total = cartItems.reduce(
                (sum, item) => sum + (item.price * item.quantity),
                0
            );

            setCart({
                id: cartId,
                items: cartItems,
                total
            });

            console.log('Item removed from cart via in-memory store');
            return true;
        } catch (error) {
            console.error('Error removing item from cart:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Update an item in the cart
    const updateCartItem = async (itemId, updates) => {
        try {
            setLoading(true);
            const cartId = getCartId();

            if (useServerApi) {
                // Try to update item via API
                try {
                    const response = await fetch(`/api/cart/update?cartId=${cartId}&itemId=${itemId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updates)
                    });

                    if (!response.ok) {
                        throw new Error('Failed to update item via API');
                    }

                    const updatedCart = await response.json();

                    // Use the returned cart from the API
                    setCart({
                        id: updatedCart.id,
                        items: updatedCart.items || [],
                        total: updatedCart.total
                    });

                    console.log('Cart item updated via API');
                    return true;
                } catch (apiError) {
                    console.error('API error, falling back to in-memory store:', apiError);
                    setUseServerApi(false); // Switch to local mode if API fails
                }
            }

            // Fallback to in-memory store
            const item = inMemoryStore.items[itemId];

            if (!item) {
                return false;
            }

            // Update the item properties
            if (updates.quantity !== undefined) {
                item.quantity = updates.quantity;
            }
            if (updates.size !== undefined) {
                item.size = updates.size;
            }
            if (updates.crust !== undefined) {
                item.crust = updates.crust;
            }
            if (updates.price !== undefined) {
                item.price = updates.price;
            }
            if (updates.toppings !== undefined) {
                item.toppings = updates.toppings;
            }

            // Update the cart state
            const cartItems = Object.values(inMemoryStore.items)
                .filter(item => item.cart_id === cartId)
                .map(item => ({
                    id: item.id,
                    pizzaId: item.pizza_id,
                    name: item.name,
                    size: item.size,
                    quantity: item.quantity,
                    crust: item.crust,
                    price: item.price,
                    toppings: item.toppings || []
                }));

            const total = cartItems.reduce(
                (sum, item) => sum + (item.price * item.quantity),
                0
            );

            setCart({
                id: cartId,
                items: cartItems,
                total
            });

            console.log('Cart item updated via in-memory store');
            return true;
        } catch (error) {
            console.error('Error updating cart item:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Clear the cart
    const clearCart = async () => {
        try {
            setLoading(true);
            const cartId = getCartId();

            if (useServerApi) {
                // Try to clear cart via API
                try {
                    const response = await fetch(`/api/cart/clear?cartId=${cartId}`, {
                        method: 'DELETE'
                    });

                    if (!response.ok) {
                        throw new Error('Failed to clear cart via API');
                    }

                    const emptyCart = await response.json();

                    // Use the returned empty cart from the API
                    setCart({
                        id: emptyCart.id,
                        items: [],
                        total: 0
                    });

                    console.log('Cart cleared via API');
                    return true;
                } catch (apiError) {
                    console.error('API error, falling back to in-memory store:', apiError);
                    setUseServerApi(false); // Switch to local mode if API fails
                }
            }

            // Fallback to in-memory store
            // Find all items for this cart
            const cartItemIds = Object.values(inMemoryStore.items)
                .filter(item => item.cart_id === cartId)
                .map(item => item.id);

            // Delete all items
            for (const id of cartItemIds) {
                delete inMemoryStore.items[id];
            }

            // Update cart state
            setCart({
                id: cartId,
                items: [],
                total: 0
            });

            console.log('Cart cleared via in-memory store');
            return true;
        } catch (error) {
            console.error('Error clearing cart:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Toggle API usage for testing
    const toggleServerApi = () => {
        setUseServerApi(!useServerApi);
        console.log(`Switched to ${!useServerApi ? 'server API' : 'in-memory store'} mode`);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                addToCart,
                removeFromCart,
                updateCartItem,
                clearCart,
                toggleServerApi,
                useServerApi
            }}
        >
            {children}
        </CartContext.Provider>
    );
} 