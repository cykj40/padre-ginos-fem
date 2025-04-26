'use client';

import { useState, useContext } from 'react';
import { CartContext } from '../app/contexts';
import useCurrency from '../hooks/useCurrency';

// Default fallback pizza data
const DEFAULT_PIZZA = {
    id: 'default',
    name: 'Delicious Pizza',
    description: 'A delicious pizza with the finest ingredients.',
    price: 0,
    image: '/assets/pizzas/veggie.webp',
    ingredients: ['Secret ingredient'],
    vegetarian: false,
    spicy: false
};

export default function Pizza({ pizza = DEFAULT_PIZZA, detailed = false }) {
    // Use fallback data if no pizza is provided
    const safePizza = pizza || DEFAULT_PIZZA;

    const [cart, setCart] = useContext(CartContext);
    const { format } = useCurrency();
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        const newItem = {
            id: Date.now(),
            pizza: safePizza,
            size: 'medium',
            crust: 'regular',
            toppings: [],
            quantity: 1,
            price: Number(safePizza.price) || 0
        };

        setCart([...cart, newItem]);
        setAdded(true);

        setTimeout(() => {
            setAdded(false);
        }, 2000);
    };

    // Safe access to description
    const description = safePizza.description || 'A delicious pizza';
    const displayDescription = detailed
        ? description
        : (description.substring(0, Math.min(100, description.length)) + '...');

    const ingredients = safePizza.ingredients || [];

    return (
        <div className="pizza">
            <div>
                <img
                    src={safePizza.image || '/assets/pizzas/veggie.webp'}
                    alt={safePizza.name || 'Pizza'}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/pizzas/veggie.webp';
                    }}
                />
            </div>
            <div>
                <h1>{safePizza.name || 'Delicious Pizza'}</h1>
                <p>{displayDescription}</p>
                <p>{format(Number(safePizza.price) || 0)}</p>

                {detailed && (
                    <>
                        <p><strong>Ingredients:</strong> {ingredients.join(', ')}</p>
                        {safePizza.vegetarian && <p><strong>Vegetarian</strong></p>}
                        {safePizza.spicy && <p><strong>Spicy</strong></p>}
                    </>
                )}

                <button
                    onClick={handleAddToCart}
                    disabled={added}
                >
                    {added ? 'Added to Cart!' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
} 