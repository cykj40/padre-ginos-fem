'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { CartContext } from '../app/contexts';

export default function Header() {
    const [cart] = useContext(CartContext);

    return (
        <header>
            <div className="logo">
                <Link href="/">
                    <img src="/assets/padre_gino.svg" alt="Padre Gino's" />
                </Link>
            </div>
            <nav>
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
                    <li>
                        <Link href="/cart">
                            Cart ({cart.length})
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
} 