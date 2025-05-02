'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCart, addToCart, updateCart, removeFromCart, clearCart } from '../lib/db';

export default function Cart() {
    const [cartId, setCartId] = useState(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        // Get or create cart ID from localStorage
        let storedCartId = localStorage.getItem('cartId');
        if (!storedCartId) {
            storedCartId = `cart_${Date.now()}`;
            localStorage.setItem('cartId', storedCartId);
        }
        setCartId(storedCartId);
    }, []);

    const { data: cart, isLoading } = useQuery({
        queryKey: ['cart', cartId],
        queryFn: () => getCart(cartId),
        enabled: !!cartId,
    });

    const addToCartMutation = useMutation({
        mutationFn: (item) => addToCart(cartId, item),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart', cartId] });
        },
    });

    const updateCartMutation = useMutation({
        mutationFn: ({ itemId, updates }) => updateCart(cartId, itemId, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart', cartId] });
        },
    });

    const removeFromCartMutation = useMutation({
        mutationFn: (itemId) => removeFromCart(cartId, itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart', cartId] });
        },
    });

    const clearCartMutation = useMutation({
        mutationFn: () => clearCart(cartId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart', cartId] });
        },
    });

    if (isLoading || !cart) {
        return <div>Loading cart...</div>;
    }

    return (
        <div className="cart">
            <h2>Your Cart</h2>
            {cart.items.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    <ul>
                        {cart.items.map((item) => (
                            <li key={item.id}>
                                <div>
                                    <h3>{item.name}</h3>
                                    <p>Size: {item.size}</p>
                                    <p>Crust: {item.crust}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    {item.toppings.length > 0 && (
                                        <p>Toppings: {item.toppings.join(', ')}</p>
                                    )}
                                    <p>Price: ${item.price * item.quantity}</p>
                                </div>
                                <div>
                                    <button
                                        onClick={() =>
                                            updateCartMutation.mutate({
                                                itemId: item.id,
                                                updates: { quantity: item.quantity + 1 },
                                            })
                                        }
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() =>
                                            updateCartMutation.mutate({
                                                itemId: item.id,
                                                updates: { quantity: Math.max(1, item.quantity - 1) },
                                            })
                                        }
                                    >
                                        -
                                    </button>
                                    <button
                                        onClick={() => removeFromCartMutation.mutate(item.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="cart-total">
                        <h3>Total: ${cart.total}</h3>
                        <button onClick={() => clearCartMutation.mutate()}>
                            Clear Cart
                        </button>
                    </div>
                </>
            )}
        </div>
    );
} 