'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Modal from '../../components/Modal';
import Pizza from '../../components/Pizza';

export default function Menu() {
    const [selectedPizza, setSelectedPizza] = useState(null);

    const { data: pizzas, isLoading, error } = useQuery({
        queryKey: ['pizzas'],
        queryFn: async () => {
            const response = await fetch('/api/pizzas');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <>
            <div className="menu">
                <Header />
                <h2>Our Menu</h2>
                <div className="menu-grid">
                    {pizzas && pizzas.map(pizza => (
                        <div key={pizza.id} className="menu-item">
                            <img
                                src={pizza.image || '/assets/pizzas/veggie.webp'}
                                alt={pizza.name}
                            />
                            <div className="menu-item-content">
                                <h3>{pizza.name}</h3>
                                <p className="description">{pizza.description}</p>
                                <p className="price">${pizza.price.toFixed(2)}</p>
                                <button onClick={() => setSelectedPizza(pizza)}>View Details</button>
                            </div>
                        </div>
                    ))}
                </div>
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