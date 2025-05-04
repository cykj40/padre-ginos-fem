'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { CartContext } from '../contexts/CartContext';
import useCurrency from '../../hooks/useCurrency';

// Default fallback pizza data
const DEFAULT_PIZZA = {
    id: 'potd-default',
    name: 'Special of the Day',
    description: 'Our chef\'s special pizza of the day, made with the finest ingredients.',
    price: 12.99,
    image: '/assets/pizzas/napolitana.webp',
    ingredients: ['Chef\'s secret ingredients'],
    vegetarian: false,
    spicy: false
};

export default function PizzaOfTheDay({ pizza }) {
    // Use fallback if pizza is not provided
    const safePizza = pizza || DEFAULT_PIZZA;

    const { addToCart } = useContext(CartContext);
    const { format } = useCurrency();

    const handleAddToCart = () => {
        const newItem = {
            pizzaId: safePizza.id,
            name: safePizza.name,
            size: 'medium',
            crust: 'regular',
            toppings: [],
            quantity: 1,
            price: Number(safePizza.price) || 0
        };

        addToCart(newItem);
    };

    return (
        <div className="pizza-of-the-day">
            <h2>Pizza of the Day <span className="checkered"></span></h2>
            <div className="pizza-spotlight">
                <div className="pizza-image">
                    <img
                        src={safePizza.image || '/assets/pizzas/napolitana.webp'}
                        alt={safePizza.name || 'Pizza of the Day'}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/assets/pizzas/napolitana.webp';
                        }}
                    />
                </div>
                <div className="pizza-details">
                    <h3>{safePizza.name || 'Special Pizza'}</h3>
                    <p>{safePizza.description || 'A delicious special pizza for today.'}</p>
                    <p className="price">{format(Number(safePizza.price) || 0)}</p>
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