'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function PizzaCard({ pizza }) {
    const [size, setSize] = useState('medium');
    const [crust, setCrust] = useState('regular');
    const [toppings, setToppings] = useState([]);
    const queryClient = useQueryClient();

    const addToCartMutation = useMutation({
        mutationFn: async (item) => {
            const cartId = localStorage.getItem('cartId');
            const response = await fetch(`/api/cart/add?cartId=${cartId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item),
            });
            
            if (!response.ok) {
                throw new Error('Failed to add to cart');
            }
            
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    const handleAddToCart = () => {
        const price = pizza.prices[size];
        addToCartMutation.mutate({
            pizzaId: pizza.id,
            name: pizza.name,
            size,
            crust,
            quantity: 1,
            toppings,
            price,
        });
    };

    const toggleTopping = (topping) => {
        setToppings((prev) =>
            prev.includes(topping)
                ? prev.filter((t) => t !== topping)
                : [...prev, topping]
        );
    };

    return (
        <div className="pizza-card">
            <img src={pizza.image} alt={pizza.name} />
            <h3>{pizza.name}</h3>
            <p>{pizza.description}</p>
            <div className="pizza-options">
                <div>
                    <label>Size:</label>
                    <select value={size} onChange={(e) => setSize(e.target.value)}>
                        {Object.entries(pizza.prices).map(([size, price]) => (
                            <option key={size} value={size}>
                                {size} - ${price}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Crust:</label>
                    <select value={crust} onChange={(e) => setCrust(e.target.value)}>
                        <option value="regular">Regular</option>
                        <option value="thin">Thin</option>
                        <option value="thick">Thick</option>
                    </select>
                </div>
                {pizza.availableToppings && (
                    <div>
                        <label>Toppings:</label>
                        <div className="toppings-grid">
                            {pizza.availableToppings.map((topping) => (
                                <label key={topping} className="topping-option">
                                    <input
                                        type="checkbox"
                                        checked={toppings.includes(topping)}
                                        onChange={() => toggleTopping(topping)}
                                    />
                                    {topping}
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <button onClick={handleAddToCart}>Add to Cart</button>
        </div>
    );
} 