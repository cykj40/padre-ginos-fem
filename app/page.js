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
        <>
            <Header />
            <div className="index">
                <h1>Padre Gino&apos;s Pizza</h1>
                <div className="index-brand">
                    <p>Welcome to Padre Gino&apos;s, where tradition meets taste! Our authentic recipes have been passed down through generations, ensuring every bite is a piece of culinary history.</p>
                </div>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <PizzaOfTheDay pizza={pizzaData} />
                )}
                <ul>
                    <li>
                        <Link href="/menu">Menu</Link>
                    </li>
                    <li>
                        <Link href="/order">Order</Link>
                    </li>
                    <li>
                        <Link href="/past">Past Orders</Link>
                    </li>
                    <li>
                        <Link href="/contact">Contact</Link>
                    </li>
                </ul>
            </div>
            <Footer />
        </>
    );
} 