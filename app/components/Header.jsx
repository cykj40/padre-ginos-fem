import Link from 'next/link';
import Image from 'next/image';
import Navigation from './Navigation';

export default function Header() {
    return (
        <header className="header">
            <div className="container">
                <div className="logo-container">
                    <Link href="/" className="logo-link">
                        <Image 
                            src="/assets/pizzas/papa-giogios.png" 
                            alt="Papa Giorgio's Pizza Logo" 
                            width={80} 
                            height={80} 
                            className="logo"
                        />
                        <span className="logo-text">Papa Giorgio's</span>
                    </Link>
                </div>
                <Navigation />
            </div>
        </header>
    );
} 