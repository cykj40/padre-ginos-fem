'use client';

import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CartContext } from '../contexts/CartContext';
import useCurrency from '../../hooks/useCurrency';

// Format currency
const intl = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export default function Cart() {
    const { cart, loading, updateCartItem, removeFromCart, clearCart } = useContext(CartContext);
    const router = useRouter();
    const { format } = useCurrency();

    // Handle quantity change
    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        const item = cart.items.find(item => item.id === itemId);
        if (!item) return;

        // Calculate new price based on quantity
        const unitPrice = item.price / item.quantity;
        const newPrice = unitPrice * newQuantity;

        await updateCartItem(itemId, {
            quantity: newQuantity,
            price: newPrice
        });
    };

    // Handle remove item
    const handleRemoveItem = async (itemId) => {
        if (confirm('Are you sure you want to remove this item?')) {
            try {
                console.log(`Attempting to remove item: ${itemId}`);
                const success = await removeFromCart(itemId);
                
                if (!success) {
                    console.error('Failed to remove item');
                    alert('There was a problem removing the item. Please try again.');
                }
            } catch (error) {
                console.error('Error removing item:', error);
                alert('There was a problem removing the item. Please try again.');
            }
        }
    };

    // Handle proceed to checkout
    const handleProceedToCheckout = () => {
        router.push('/checkout');
    };

    if (loading) {
        return (
            <div className="container">
                <h2>Loading Cart...</h2>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h2>Your Cart</h2>

            {(!cart.items || cart.items.length === 0) ? (
                <div className="cart-empty">
                    <h3>Your cart is empty</h3>
                    <p>Looks like you haven't added any pizzas to your cart yet.</p>
                    <Link href="/menu">
                        <button className="btn">Browse Menu</button>
                    </Link>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {cart.items.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item-image">
                                    <img
                                        src={'/assets/pizzas/veggie.webp'}
                                        alt={item.name || 'Pizza'}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </div>

                                <div className="cart-item-content">
                                    <h3>{item.name || 'Pizza'}</h3>

                                    <div className="cart-item-details">
                                        <p>
                                            <strong>Size:</strong> {item.size} |
                                            <strong> Crust:</strong> {item.crust}
                                            {item.toppings?.length > 0 && (
                                                <span> | <strong>Extra Toppings:</strong> {item.toppings.join(', ')}</span>
                                            )}
                                        </p>
                                    </div>

                                    <div className="cart-item-price">
                                        {intl.format(item.price)}
                                    </div>

                                    <div className="cart-item-actions">
                                        <div className="quantity-control">
                                            <button
                                                className="quantity-btn"
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <input
                                                className="quantity-input"
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                            />
                                            <button
                                                className="quantity-btn"
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            className="remove-btn"
                                            onClick={() => handleRemoveItem(item.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <div className="cart-total">
                            <strong>Total:</strong> {intl.format(cart.total)}
                        </div>

                        <div className="cart-actions">
                            <Link href="/menu">
                                <button className="btn continue-shopping">
                                    Continue Shopping
                                </button>
                            </Link>
                            
                            <button
                                className="btn clear-cart"
                                onClick={() => {
                                    if (confirm('Are you sure you want to clear your cart?')) {
                                        clearCart();
                                    }
                                }}
                            >
                                Clear Cart
                            </button>

                            <button
                                className="btn checkout-btn"
                                onClick={handleProceedToCheckout}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
} 