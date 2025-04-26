'use client';

import { useState, useContext } from 'react';
import { CartContext } from '../app/contexts';
import useCurrency from '../hooks/useCurrency';

export default function Pizza({ pizza, detailed = false }) {
    const [cart, setCart] = useContext(CartContext);
    const { format } = useCurrency();
    const [added, setAdded] = useState(false);

    if (!pizza) {
        return <div className="pizza loading-spinner">Loading pizza...</div>;
    }

    const handleAddToCart = () => {
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
        setAdded(true);

        setTimeout(() => {
            setAdded(false);
        }, 2000);
    };

    const description = pizza?.description || 'A delicious pizza';
    const displayDescription = detailed
        ? description
        : (description.substring(0, 100) + '...');

    return (
        <div className="pizza">
            <div>
                <img src={pizza.image || '/assets/pizzas/veggie.webp'} alt={pizza.name || 'Pizza'} />
            </div>
            <div>
                <h1>{pizza.name || 'Delicious Pizza'}</h1>
                <p>{displayDescription}</p>
                <p>{format(pizza?.price || 0)}</p>

                {detailed && (
                    <>
                        <p><strong>Ingredients:</strong> {(pizza.ingredients || []).join(', ')}</p>
                        {pizza.vegetarian && <p><strong>Vegetarian</strong></p>}
                        {pizza.spicy && <p><strong>Spicy</strong></p>}
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