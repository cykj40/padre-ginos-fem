'use client';

import { useState, useContext } from 'react';
import { CartContext } from '../app/contexts';
import useCurrency from '../hooks/useCurrency';

export default function Pizza({ pizza, detailed = false }) {
    const [cart, setCart] = useContext(CartContext);
    const { format } = useCurrency();
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        const newItem = {
            id: Date.now(),
            pizza,
            size: 'medium',
            crust: 'regular',
            toppings: [],
            quantity: 1,
            price: pizza.price
        };

        setCart([...cart, newItem]);
        setAdded(true);

        setTimeout(() => {
            setAdded(false);
        }, 2000);
    };

    return (
        <div className="pizza">
            <div>
                <img src={pizza.image || '/assets/pizza-placeholder.jpg'} alt={pizza.name} />
            </div>
            <div>
                <h1>{pizza.name}</h1>
                <p>{detailed ? pizza.description : pizza.description.substring(0, 100) + '...'}</p>
                <p>{format(pizza.price)}</p>

                {detailed && (
                    <>
                        <p><strong>Ingredients:</strong> {pizza.ingredients.join(', ')}</p>
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