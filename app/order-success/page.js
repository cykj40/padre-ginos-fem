'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function OrderSuccess() {
    // Generate a random order number
    const orderNumber = Math.floor(Math.random() * 100000).toString().padStart(5, '0');

    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Header />
            <div className="container" style={{
                textAlign: 'center',
                padding: '50px 20px',
                maxWidth: '600px',
                margin: '0 auto'
            }}>
                <div style={{ marginBottom: '30px' }}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="80"
                        height="80"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#28a745"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>

                <h2>Order Successfully Placed!</h2>
                <p>Thank you for your order. Your order number is <strong>#{orderNumber}</strong>.</p>
                <p style={{ marginBottom: '30px' }}>
                    We've sent a confirmation email with your order details.
                    Your delicious pizza will be on its way soon!
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                    <Link href="/menu">
                        <button className="btn">
                            Order More
                        </button>
                    </Link>
                    <Link href="/">
                        <button className="btn">
                            Return Home
                        </button>
                    </Link>
                </div>
            </div>
            <Footer />
        </>
    );
} 