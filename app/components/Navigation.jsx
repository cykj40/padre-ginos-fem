'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CartIcon from './CartIcon';

export default function Navigation() {
    const pathname = usePathname();

    return (
        <nav className="navigation">
            <ul>
                <li>
                    <Link href="/" className={pathname === '/' ? 'active' : ''}>
                        Home
                    </Link>
                </li>
                <li>
                    <Link href="/menu" className={pathname === '/menu' ? 'active' : ''}>
                        Menu
                    </Link>
                </li>
                <li>
                    <Link href="/contact" className={pathname === '/contact' ? 'active' : ''}>
                        Contact
                    </Link>
                </li>
            </ul>
            <div className="nav-cart">
                <CartIcon />
            </div>
        </nav>
    );
} 