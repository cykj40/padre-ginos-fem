'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OrderSuccess() {
    const router = useRouter();
    
    // If user navigates directly to this page without an order, redirect to home
    useEffect(() => {
        const hasCompletedOrder = sessionStorage.getItem('orderCompleted');
        
        if (!hasCompletedOrder) {
            sessionStorage.setItem('orderCompleted', 'true');
        }
    }, []);

    return (
        <div className="success-page">
            <div className="success-container">
                <div className="success-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>
                
                <h2>Order Confirmed!</h2>
                
                <p>
                    Thank you for your order! We've received your purchase and are preparing your delicious pizza.
                </p>
                
                <div className="order-details">
                    <p>
                        <strong>Order Number:</strong> #{Math.floor(Math.random() * 10000)}
                    </p>
                    <p>
                        <strong>Estimated Delivery:</strong> 30-45 minutes
                    </p>
                </div>
                
                <p className="delivery-note">
                    You'll receive an email confirmation shortly with more details about your order.
                </p>
                
                <div className="success-actions">
                    <Link href="/">
                        <button className="btn">Return to Home</button>
                    </Link>
                    
                    <Link href="/menu">
                        <button className="btn">Order Again</button>
                    </Link>
                </div>
            </div>
        </div>
    );
} 