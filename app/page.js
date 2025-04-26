'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import PizzaOfTheDay from '../components/PizzaOfTheDay';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
    const [pizzaData, setPizzaData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPizzaOfTheDay() {
            try {
                const response = await fetch('/api/pizza-of-the-day');
                const data = await response.json();
                setPizzaData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching pizza of the day:', error);
                setLoading(false);
            }
        }

        fetchPizzaOfTheDay();
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
                    {loading ? (
                        <div className="loading-spinner">Loading special offer...</div>
                    ) : (
                        <PizzaOfTheDay pizza={pizzaData} />
                    )}
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