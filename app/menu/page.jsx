'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function Menu() {
    const [pizzas, setPizzas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPizza, setSelectedPizza] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [size, setSize] = useState('medium');
    const [crust, setCrust] = useState('regular');
    const [toppings, setToppings] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const queryClient = useQueryClient();

    useEffect(() => {
        const fetchPizzas = async () => {
            try {
                const response = await fetch('/api/menu/');
                if (!response.ok) {
                    throw new Error('Failed to fetch menu');
                }
                const data = await response.json();
                setPizzas(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchPizzas();
    }, []);

    const openModal = (pizza) => {
        setSelectedPizza(pizza);
        setSize('medium');
        setCrust('regular');
        setToppings([]);
        setQuantity(1);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedPizza(null);
    };

    const toggleTopping = (topping) => {
        setToppings(prev =>
            prev.includes(topping)
                ? prev.filter(t => t !== topping)
                : [...prev, topping]
        );
    };

    const addToCartMutation = useMutation({
        mutationFn: async (item) => {
            // Get or create cart ID from localStorage
            let cartId = localStorage.getItem('cartId');
            if (!cartId) {
                cartId = `cart_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
                localStorage.setItem('cartId', cartId);
            }
            
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
            closeModal();
        },
    });

    const handleAddToCart = () => {
        const price = selectedPizza.prices[size];
        addToCartMutation.mutate({
            pizzaId: selectedPizza.id,
            name: selectedPizza.name,
            size,
            crust,
            quantity,
            toppings,
            price,
        });
    };

    if (loading) return <div className="loading">Loading menu...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="menu">
            <h1>Our Menu</h1>
            <div className="pizza-grid">
                {pizzas.map((pizza) => (
                    <div 
                        key={pizza.id} 
                        className="pizza-card" 
                        onClick={() => openModal(pizza)}
                    >
                        <div className="pizza-image">
                            <img src={pizza.image} alt={pizza.name} />
                        </div>
                        <div className="pizza-info">
                            <h3>{pizza.name}</h3>
                            <p>{pizza.description}</p>
                            <div className="pizza-price">
                                <span>${pizza.prices.medium}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Customization Modal */}
            {showModal && selectedPizza && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-modal" onClick={closeModal}>×</button>
                        <div className="modal-header">
                            <h2>{selectedPizza.name}</h2>
                        </div>
                        <div className="modal-body">
                            <div className="modal-image">
                                <img src={selectedPizza.image} alt={selectedPizza.name} />
                            </div>
                            <div className="customization-options">
                                <div className="option-group">
                                    <h3>Size</h3>
                                    <div className="size-options">
                                        {Object.entries(selectedPizza.prices).map(([sizeOption, price]) => (
                                            <label key={sizeOption} className={size === sizeOption ? 'selected' : ''}>
                                                <input
                                                    type="radio"
                                                    name="size"
                                                    value={sizeOption}
                                                    checked={size === sizeOption}
                                                    onChange={() => setSize(sizeOption)}
                                                />
                                                <span>{sizeOption.charAt(0).toUpperCase() + sizeOption.slice(1)} (${price})</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="option-group">
                                    <h3>Crust</h3>
                                    <div className="crust-options">
                                        {['regular', 'thin', 'thick'].map((crustOption) => (
                                            <label key={crustOption} className={crust === crustOption ? 'selected' : ''}>
                                                <input
                                                    type="radio"
                                                    name="crust"
                                                    value={crustOption}
                                                    checked={crust === crustOption}
                                                    onChange={() => setCrust(crustOption)}
                                                />
                                                <span>{crustOption.charAt(0).toUpperCase() + crustOption.slice(1)}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                
                                {selectedPizza.availableToppings && (
                                    <div className="option-group">
                                        <h3>Toppings</h3>
                                        <div className="toppings-grid">
                                            {selectedPizza.availableToppings.map((topping) => (
                                                <label key={topping} className={toppings.includes(topping) ? 'selected' : ''}>
                                                    <input
                                                        type="checkbox"
                                                        checked={toppings.includes(topping)}
                                                        onChange={() => toggleTopping(topping)}
                                                    />
                                                    <span>{topping}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="option-group">
                                    <h3>Quantity</h3>
                                    <div className="quantity-selector">
                                        <button 
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span>{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)}>
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="modal-total">
                                <span>Total: ${(selectedPizza.prices[size] * quantity).toFixed(2)}</span>
                            </div>
                            <button 
                                className="add-to-cart-btn" 
                                onClick={handleAddToCart}
                                disabled={addToCartMutation.isPending}
                            >
                                {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .menu {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem 1rem;
                }
                
                h1 {
                    text-align: center;
                    margin-bottom: 2rem;
                    color: #e63946;
                }
                
                .pizza-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                    gap: 1rem;
                }
                
                @media (min-width: 1200px) {
                    .pizza-grid {
                        grid-template-columns: repeat(4, 1fr);
                    }
                }
                
                @media (min-width: 768px) and (max-width: 1199px) {
                    .pizza-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
                
                @media (max-width: 767px) {
                    .pizza-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                
                @media (max-width: 480px) {
                    .pizza-grid {
                        grid-template-columns: 1fr;
                    }
                }
                
                .pizza-card {
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                    background: white;
                    height: 100%;
                }
                
                .pizza-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
                }
                
                .pizza-image {
                    height: 150px;
                    overflow: hidden;
                }
                
                .pizza-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s;
                }
                
                .pizza-card:hover .pizza-image img {
                    transform: scale(1.05);
                }
                
                .pizza-info {
                    padding: 0.75rem;
                }
                
                .pizza-info h3 {
                    margin: 0 0 0.25rem;
                    color: #333;
                    font-size: 1rem;
                }
                
                .pizza-info p {
                    font-size: 0.8rem;
                    color: #666;
                    margin-bottom: 0.5rem;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    line-height: 1.2;
                }
                
                .pizza-price {
                    font-weight: bold;
                    color: #e63946;
                    font-size: 0.9rem;
                }
                
                /* Modal styles */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    padding: 1rem;
                }
                
                .modal-content {
                    background: white;
                    border-radius: 8px;
                    width: 100%;
                    max-width: 800px;
                    max-height: 90vh;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }
                
                .close-modal {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #777;
                }
                
                .modal-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid #eee;
                }
                
                .modal-header h2 {
                    margin: 0;
                    color: #333;
                }
                
                .modal-body {
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                
                @media (min-width: 768px) {
                    .modal-body {
                        flex-direction: row;
                    }
                }
                
                .modal-image {
                    width: 100%;
                    max-width: 300px;
                    margin: 0 auto;
                }
                
                .modal-image img {
                    width: 100%;
                    height: auto;
                    border-radius: 8px;
                }
                
                .customization-options {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                
                .option-group {
                    border-bottom: 1px solid #eee;
                    padding-bottom: 1.5rem;
                }
                
                .option-group h3 {
                    margin-top: 0;
                    margin-bottom: 1rem;
                    color: #333;
                }
                
                .size-options, .crust-options {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .toppings-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                    gap: 0.5rem;
                }
                
                .option-group label {
                    display: flex;
                    align-items: center;
                    padding: 0.5rem;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .option-group label.selected {
                    border-color: #e63946;
                    background-color: rgba(230, 57, 70, 0.1);
                }
                
                .option-group label span {
                    margin-left: 0.5rem;
                }
                
                .quantity-selector {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                .quantity-selector button {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: 1px solid #ddd;
                    background: #f8f8f8;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 1.2rem;
                }
                
                .quantity-selector button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                .quantity-selector span {
                    font-weight: bold;
                    font-size: 1.1rem;
                }
                
                .modal-footer {
                    padding: 1.5rem;
                    border-top: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .modal-total {
                    font-size: 1.25rem;
                    font-weight: bold;
                }
                
                .add-to-cart-btn {
                    background-color: #e63946;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: background-color 0.2s;
                }
                
                .add-to-cart-btn:hover:not(:disabled) {
                    background-color: #d62f3c;
                }
                
                .add-to-cart-btn:disabled {
                    background-color: #f8a1a8;
                    cursor: not-allowed;
                }
                
                .loading, .error {
                    text-align: center;
                    padding: 3rem;
                    font-size: 1.2rem;
                }
                
                .error {
                    color: #e63946;
                }
            `}</style>
        </div>
    );
} 