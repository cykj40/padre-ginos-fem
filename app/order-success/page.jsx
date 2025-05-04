'use client';

import { useContext, useEffect } from 'react';
import Link from 'next/link';
import { CartContext } from '../contexts/CartContext';

export default function OrderSuccess() {
    const { clearCart } = useContext(CartContext);
    
    // Ensure cart is cleared when this page loads
    useEffect(() => {
        clearCart();
    }, [clearCart]);
    
    return (
        <div className="order-success-page">
            <div className="success-container">
                <div className="success-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>
                
                <h1>Order Successful!</h1>
                
                <p>Thank you for your order at Papa Giorgio's Pizza!</p>
                <p>Your delicious pizza is now being prepared with love and care.</p>
                
                <div className="order-details">
                    <p><strong>Estimated Delivery Time:</strong> 30-45 minutes</p>
                    <p><strong>Order Number:</strong> #{Math.floor(100000 + Math.random() * 900000)}</p>
                </div>
                
                <p className="follow-up">You will receive a confirmation email shortly with your order details.</p>
                
                <div className="action-buttons">
                    <Link href="/">
                        <button className="home-btn">Return to Home</button>
                    </Link>
                    
                    <Link href="/menu">
                        <button className="menu-btn">Order More</button>
                    </Link>
                </div>
            </div>
            
            <style jsx>{`
                .order-success-page {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 2rem;
                    min-height: 80vh;
                }
                
                .success-container {
                    max-width: 800px;
                    text-align: center;
                    padding: 3rem;
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                
                .success-icon {
                    color: #4CAF50;
                    margin-bottom: 1.5rem;
                }
                
                h1 {
                    font-size: 2.5rem;
                    margin-bottom: 1.5rem;
                    color: #333;
                }
                
                p {
                    font-size: 1.1rem;
                    color: #666;
                    margin-bottom: 1rem;
                    line-height: 1.6;
                }
                
                .order-details {
                    background-color: #f9f9f9;
                    padding: 1.5rem;
                    border-radius: 8px;
                    margin: 2rem 0;
                }
                
                .follow-up {
                    font-style: italic;
                    color: #888;
                }
                
                .action-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    margin-top: 2rem;
                }
                
                button {
                    padding: 0.8rem 1.5rem;
                    border-radius: 4px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: none;
                }
                
                .home-btn {
                    background-color: #e63946;
                    color: white;
                }
                
                .menu-btn {
                    background-color: white;
                    color: #e63946;
                    border: 2px solid #e63946;
                }
                
                button:hover {
                    opacity: 0.9;
                    transform: translateY(-2px);
                }
            `}</style>
        </div>
    );
} 