'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { CartContext } from '../app/contexts';
import useCurrency from '../hooks/useCurrency';

export default function PizzaOfTheDay({ pizza }) {
    const [cart, setCart] = useContext(CartContext);
    const { format } = useCurrency();

    const handleAddToCart = () => {
        if (!pizza) return;

        const newItem = {
            id: Date.now(),
            pizza,
            size: 'medium',
            crust: 'regular',
            toppings: [],
            quantity: 1,
            price: pizza?.price || 0
        };

        setCart([...cart, newItem]);
    };

    if (!pizza) {
        return (
            <div className="pizza-of-the-day">
                <h2>Pizza of the Day</h2>
                <div className="loading-spinner">Loading today's special...</div>
            </div>
        );
    }

    return (
        <div className="pizza-of-the-day">
            <h2>Pizza of the Day <span className="checkered"></span></h2>
            <div className="pizza-spotlight">
                <div className="pizza-image">
                    <img
                        src={pizza.image || '/assets/pizzas/napolitana.webp'}
                        alt={pizza.name || 'Pizza of the Day'}
                    />
                </div>
                <div className="pizza-details">
                    <h3>{pizza.name || 'Special Pizza'}</h3>
                    <p>{pizza.description || 'A delicious special pizza for today.'}</p>
                    <p className="price">{format(pizza.price || 0)}</p>
                    <div className="action-buttons">
                        <button onClick={handleAddToCart}>Add to Cart</button>
                        <Link href="/menu" className="view-menu-btn">
                            View Full Menu
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
} 