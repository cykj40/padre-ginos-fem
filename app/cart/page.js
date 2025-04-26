'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { CartContext } from '../contexts';
import useCurrency from '../../hooks/useCurrency';

export default function Cart() {
    const [cart, setCart] = useContext(CartContext);
    const { format } = useCurrency();
    const [orderInfo, setOrderInfo] = useState({
        name: '',
        address: '',
        phone: '',
        email: '',
        paymentMethod: 'cash'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const router = useRouter();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderInfo({
            ...orderInfo,
            [name]: value
        });
    };

    const handleRemoveItem = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const calculateTotal = () => {
        if (!cart || !cart.length) return 0;
        const total = cart.reduce((total, item) => {
            const price = Number(item?.price) || 0;
            return total + price;
        }, 0);
        return total;
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();

        if (!cart || cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerInfo: orderInfo,
                    items: cart,
                    total: calculateTotal(),
                    date: new Date().toISOString()
                })
            });

            if (response.ok) {
                setSubmitted(true);
                setCart([]);
                setTimeout(() => {
                    router.push('/past');
                }, 3000);
            } else {
                alert('There was an error placing your order. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('There was an error placing your order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <>
                <div className="cart">
                    <Header />
                    <h2>Thank You for Your Order!</h2>
                    <p>Your order has been placed successfully.</p>
                    <p>You will be redirected to your order history shortly...</p>
                </div>
                <Footer />
            </>
        );
    }

    const safeCart = cart || [];
    const total = calculateTotal();

    return (
        <>
            <div className="cart">
                <Header />
                <h2>Your Cart</h2>

                {safeCart.length === 0 ? (
                    <p>Your cart is empty. <a href="/menu">Go to Menu</a></p>
                ) : (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Size</th>
                                    <th>Crust</th>
                                    <th>Toppings</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {safeCart.map(item => (
                                    <tr key={item.id || Math.random().toString()}>
                                        <td>{item?.pizza?.name || 'Pizza'}</td>
                                        <td>{item?.size || 'Medium'}</td>
                                        <td>{item?.crust || 'Regular'}</td>
                                        <td>{item?.toppings?.length > 0 ? item.toppings.join(', ') : 'None'}</td>
                                        <td>{item?.quantity || 1}</td>
                                        <td>{format(Number(item?.price) || 0)}</td>
                                        <td>
                                            <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total:</td>
                                    <td colSpan="2" style={{ fontWeight: 'bold' }}>{format(total)}</td>
                                </tr>
                            </tbody>
                        </table>

                        <h3>Complete Your Order</h3>
                        <form onSubmit={handleSubmitOrder}>
                            <div>
                                <label htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={orderInfo.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="address">Address:</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={orderInfo.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="phone">Phone:</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={orderInfo.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={orderInfo.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="paymentMethod">Payment Method:</label>
                                <select
                                    id="paymentMethod"
                                    name="paymentMethod"
                                    value={orderInfo.paymentMethod}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="cash">Cash on Delivery</option>
                                    <option value="card">Credit Card</option>
                                </select>
                            </div>

                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Place Order'}
                            </button>
                        </form>
                    </>
                )}
            </div>
            <Footer />
        </>
    );
} 