'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { CartContext } from '../app/contexts';
import useCurrency from '../hooks/useCurrency';

export default function PizzaOfTheDay({ pizza }) {
    const [cart, setCart] = useContext(CartContext);
    const { format } = useCurrency();

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
    };

    if (!pizza) return null;

    return (
        <div className="pizza-of-the-day">
            <h2>Pizza of the Day</h2>
            <div className="pizza-spotlight">
                <div className="pizza-image">
                    <img src={pizza.image || '/assets/pizza-placeholder.jpg'} alt={pizza.name} />
                </div>
                <div className="pizza-details">
                    <h3>{pizza.name}</h3>
                    <p>{pizza.description}</p>
                    <p className="price">{format(pizza.price)}</p>
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