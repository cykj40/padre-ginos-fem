'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Modal from '../../components/Modal';
import Pizza from '../../components/Pizza';
import useCurrency from '../../hooks/useCurrency';

// Fallback data for static rendering
const FALLBACK_PIZZAS = [
    {
        id: 'p1',
        name: 'Margherita',
        description: 'Classic pizza with tomato sauce, mozzarella, and basil',
        price: 10.99,
        image: '/assets/pizzas/margherita.webp',
        ingredients: ['Tomato Sauce', 'Mozzarella', 'Basil', 'Olive Oil'],
        vegetarian: true,
        spicy: false
    },
    {
        id: 'p2',
        name: 'Pepperoni',
        description: 'Traditional pizza topped with pepperoni and cheese',
        price: 12.99,
        image: '/assets/pizzas/pepperoni.webp',
        ingredients: ['Tomato Sauce', 'Mozzarella', 'Pepperoni'],
        vegetarian: false,
        spicy: true
    }
];

export default function Menu() {
    const [selectedPizza, setSelectedPizza] = useState(null);
    const { format } = useCurrency();

    const { data: pizzas = FALLBACK_PIZZAS, isLoading, error } = useQuery({
        queryKey: ['pizzas'],
        queryFn: async () => {
            try {
                const response = await fetch('/api/pizzas');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                return data && data.length ? data : FALLBACK_PIZZAS;
            } catch (error) {
                console.error('Error fetching pizzas:', error);
                return FALLBACK_PIZZAS;
            }
        },
        initialData: FALLBACK_PIZZAS // Provide initial data for static rendering
    });

    return (
        <>
            <div className="menu">
                <Header />
                <h2>Our Menu</h2>
                {isLoading ? (
                    <div className="loading-spinner">Loading menu...</div>
                ) : error ? (
                    <div>Sorry, we couldn't load the menu. Please try again later.</div>
                ) : (
                    <div className="menu-grid">
                        {pizzas.map(pizza => (
                            <div key={pizza.id || Math.random().toString()} className="menu-item">
                                <img
                                    src={pizza.image || '/assets/pizzas/veggie.webp'}
                                    alt={pizza.name || 'Delicious Pizza'}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/assets/pizzas/veggie.webp';
                                    }}
                                />
                                <div className="menu-item-content">
                                    <h3>{pizza.name || 'Pizza'}</h3>
                                    <p className="description">{pizza.description || 'A delicious pizza'}</p>
                                    <p className="price">{format(Number(pizza.price) || 0)}</p>
                                    <button onClick={() => setSelectedPizza(pizza)}>View Details</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {selectedPizza && (
                    <Modal onClose={() => setSelectedPizza(null)}>
                        <Pizza pizza={selectedPizza} detailed={true} />
                    </Modal>
                )}
            </div>
            <Footer />
        </>
    );
} 