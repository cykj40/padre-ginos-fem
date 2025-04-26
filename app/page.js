'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import PizzaOfTheDay from '../components/PizzaOfTheDay';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Hardcoded fallback data for static rendering
const fallbackPizzaData = {
    id: 'potd1',
    name: 'Special of the Day: Margherita Supreme',
    description: 'Our classic Margherita pizza elevated with premium buffalo mozzarella, fresh basil from our garden, vine-ripened tomatoes, and a drizzle of extra virgin olive oil. A taste of Naples with every bite!',
    price: 13.99,
    image: '/assets/pizzas/napolitana.webp',
    ingredients: ['Premium buffalo mozzarella', 'Fresh basil', 'Vine-ripened tomatoes', 'Extra virgin olive oil', 'Sea salt'],
    vegetarian: true,
    spicy: false
};

export default function Home() {
    const [pizzaData, setPizzaData] = useState(fallbackPizzaData);

    useEffect(() => {
        async function fetchPizzaOfTheDay() {
            try {
                const response = await fetch('/api/pizza-of-the-day');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                if (data && Object.keys(data).length > 0) {
                    setPizzaData(data);
                }
            } catch (error) {
                console.error('Error fetching pizza of the day:', error);
                // Keep using fallback data
            }
        }

        // Only fetch if we're in the browser
        if (typeof window !== 'undefined') {
            fetchPizzaOfTheDay();
        }
    }, []);

    return (
        <main>
            <Header />
            <div className="container">
                <section className="hero">
                    <h1>Papa Giorgio&apos;s Pizza</h1>
                    <div className="index-brand">
                        <p>Welcome to Papa Giorgio&apos;s, where tradition meets taste! Our authentic recipes have been passed down through generations, ensuring every bite is a piece of culinary history.</p>
                    </div>
                </section>

                <section>
                    <PizzaOfTheDay pizza={pizzaData} />
                </section>

                <section className="quick-links">
                    <div className="container">
                        <h2>Quick Links</h2>
                        <ul>
                            <li>
                                <Link href="/menu">Our Menu</Link>
                            </li>
                            <li>
                                <Link href="/order">Order Now</Link>
                            </li>
                            <li>
                                <Link href="/past">Past Orders</Link>
                            </li>
                            <li>
                                <Link href="/contact">Contact Us</Link>
                            </li>
                        </ul>
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    );
} 