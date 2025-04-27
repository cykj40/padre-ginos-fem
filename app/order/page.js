'use client';

import { useState, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { CartContext } from '../contexts/CartContext';
import useCurrency from '../../hooks/useCurrency';

// Fallback pizza data for static rendering
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

export default function Order() {
    const { cart, addToCart } = useContext(CartContext);
    const router = useRouter();
    const { format } = useCurrency();
    const [order, setOrder] = useState({
        size: 'medium',
        toppings: [],
        crust: 'regular',
        quantity: 1
    });

    const { data: pizzas = FALLBACK_PIZZAS, isLoading } = useQuery({
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

    const [selectedPizza, setSelectedPizza] = useState(null);

    const handlePizzaSelect = (id) => {
        const pizza = pizzas.find(p => p.id === id);
        setSelectedPizza(pizza);
    };

    const handleSizeChange = (e) => {
        setOrder({ ...order, size: e.target.value });
    };

    const handleCrustChange = (e) => {
        setOrder({ ...order, crust: e.target.value });
    };

    const handleToppingChange = (e) => {
        const topping = e.target.value;
        const isChecked = e.target.checked;

        if (isChecked) {
            setOrder({ ...order, toppings: [...order.toppings, topping] });
        } else {
            setOrder({
                ...order,
                toppings: order.toppings.filter(t => t !== topping)
            });
        }
    };

    const handleQuantityChange = (e) => {
        setOrder({ ...order, quantity: parseInt(e.target.value) || 1 });
    };

    const handleAddToCart = () => {
        if (!selectedPizza) return;

        const newItem = {
            pizzaId: selectedPizza.id,
            name: selectedPizza.name,
            size: order.size,
            crust: order.crust,
            toppings: order.toppings,
            quantity: order.quantity,
            price: calculatePrice()
        };

        addToCart(newItem);

        // Reset form
        setOrder({
            size: 'medium',
            toppings: [],
            crust: 'regular',
            quantity: 1
        });
        setSelectedPizza(null);

        router.push('/cart');
    };

    const calculatePrice = () => {
        if (!selectedPizza) return 0;

        let price = Number(selectedPizza.price) || 0;

        // Adjust for size
        if (order.size === 'small') price *= 0.8;
        if (order.size === 'large') price *= 1.2;

        // Add for premium crust
        if (order.crust === 'thin') price += 1;
        if (order.crust === 'stuffed') price += 2;

        // Add for toppings
        price += (order.toppings?.length || 0) * 0.75;

        // Multiply by quantity
        price *= (order.quantity || 1);

        return price;
    };

    const safePizzas = pizzas || FALLBACK_PIZZAS;

    return (
        <>
            <div className="order-page">
                <Header />
                <h2>Create Your Order</h2>

                <div className="order">
                    {isLoading ? (
                        <div className="loading-spinner">Loading pizza options...</div>
                    ) : (
                        <form>
                            <div>
                                <div>
                                    <label>Select a Pizza</label>
                                    <select
                                        value={selectedPizza ? selectedPizza.id : ''}
                                        onChange={(e) => handlePizzaSelect(e.target.value)}
                                    >
                                        <option value="">-- Select a Pizza --</option>
                                        {safePizzas.map(pizza => (
                                            <option key={pizza.id || Math.random().toString()} value={pizza.id}>
                                                {pizza.name || 'Pizza'} - {format(Number(pizza.price) || 0)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label>Size</label>
                                    <div>
                                        <input
                                            type="radio"
                                            id="small"
                                            name="size"
                                            value="small"
                                            checked={order.size === 'small'}
                                            onChange={handleSizeChange}
                                        />
                                        <label htmlFor="small">S</label>

                                        <input
                                            type="radio"
                                            id="medium"
                                            name="size"
                                            value="medium"
                                            checked={order.size === 'medium'}
                                            onChange={handleSizeChange}
                                        />
                                        <label htmlFor="medium">M</label>

                                        <input
                                            type="radio"
                                            id="large"
                                            name="size"
                                            value="large"
                                            checked={order.size === 'large'}
                                            onChange={handleSizeChange}
                                        />
                                        <label htmlFor="large">L</label>
                                    </div>
                                </div>

                                <div>
                                    <label>Crust</label>
                                    <div>
                                        <input
                                            type="radio"
                                            id="regular"
                                            name="crust"
                                            value="regular"
                                            checked={order.crust === 'regular'}
                                            onChange={handleCrustChange}
                                        />
                                        <label htmlFor="regular">Regular</label>

                                        <input
                                            type="radio"
                                            id="thin"
                                            name="crust"
                                            value="thin"
                                            checked={order.crust === 'thin'}
                                            onChange={handleCrustChange}
                                        />
                                        <label htmlFor="thin">Thin</label>

                                        <input
                                            type="radio"
                                            id="stuffed"
                                            name="crust"
                                            value="stuffed"
                                            checked={order.crust === 'stuffed'}
                                            onChange={handleCrustChange}
                                        />
                                        <label htmlFor="stuffed">Stuffed</label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div>
                                    <label>Extra Toppings</label>
                                    <div>
                                        {['Pepperoni', 'Mushrooms', 'Onions', 'Sausage', 'Bacon', 'Extra cheese', 'Black olives', 'Green peppers', 'Pineapple', 'Spinach'].map(topping => (
                                            <div key={topping}>
                                                <input
                                                    type="checkbox"
                                                    id={topping}
                                                    value={topping}
                                                    checked={order.toppings.includes(topping)}
                                                    onChange={handleToppingChange}
                                                />
                                                <label htmlFor={topping}>{topping}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label>Quantity</label>
                                    <select value={order.quantity} onChange={handleQuantityChange}>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>

                                {selectedPizza && (
                                    <div>
                                        <h3>Order Summary</h3>
                                        <p>Pizza: {selectedPizza.name || 'Selected Pizza'}</p>
                                        <p>Size: {order.size || 'Medium'}</p>
                                        <p>Crust: {order.crust || 'Regular'}</p>
                                        <p>Toppings: {order.toppings && order.toppings.length > 0 ? order.toppings.join(', ') : 'None'}</p>
                                        <p>Quantity: {order.quantity || 1}</p>
                                        <p>Total: {format(calculatePrice())}</p>
                                        <button type="button" onClick={handleAddToCart}>
                                            Add to Cart
                                        </button>
                                    </div>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
} 