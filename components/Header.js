'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { CartContext } from '../app/contexts';

export default function Header() {
    const [cart] = useContext(CartContext);
    const cartCount = cart?.length || 0;

    return (
        <header className="main-header">
            <div className="container">
                <div className="logo-container">
                    <Link href="/">
                        <img src="/assets/papa-giogios.png" alt="Papa Giorgio's" className="logo" />
                        <span className="logo-text">Papa Giorgio's</span>
                    </Link>
                </div>
                <nav className="main-nav">
                    <ul>
                        <li>
                            <Link href="/">Home</Link>
                        </li>
                        <li>
                            <Link href="/menu">Menu</Link>
                        </li>
                        <li>
                            <Link href="/order">Order</Link>
                        </li>
                        <li className="cart-link">
                            <Link href="/cart">
                                Cart <span className="cart-count">{cartCount}</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
} 