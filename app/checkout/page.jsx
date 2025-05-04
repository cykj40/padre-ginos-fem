'use client';

import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CartContext } from '../contexts/CartContext';
import useCurrency from '../../hooks/useCurrency';

export default function Checkout() {
    const { cart, loading, clearCart } = useContext(CartContext);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const router = useRouter();
    const { format } = useCurrency();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
    });
    const [errors, setErrors] = useState({});
    
    // Redirect to cart if empty
    useEffect(() => {
        if (!loading && (!cart.items || cart.items.length === 0)) {
            router.push('/cart');
        }
    }, [cart, loading, router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Basic validation
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
        if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
        if (!formData.cardName.trim()) newErrors.cardName = 'Name on card is required';
        if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
        if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setCheckoutLoading(true);

        // Simulate payment processing
        setTimeout(() => {
            // Clear cart after successful checkout
            clearCart();
            
            // Redirect to success page
            router.push('/order-success');
        }, 2000);
    };

    if (loading) {
        return (
            <div className="checkout-page">
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <h2>Checkout</h2>
            
            <form onSubmit={handleSubmit} className="checkout-form">
                <div className="checkout-section">
                    <h3>Billing Details</h3>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className={errors.firstName ? 'error' : ''}
                            />
                            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className={errors.lastName ? 'error' : ''}
                            />
                            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                        </div>
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="phone">Phone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={errors.phone ? 'error' : ''}
                            />
                            {errors.phone && <span className="error-message">{errors.phone}</span>}
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className={errors.address ? 'error' : ''}
                        />
                        {errors.address && <span className="error-message">{errors.address}</span>}
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="city">City</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className={errors.city ? 'error' : ''}
                            />
                            {errors.city && <span className="error-message">{errors.city}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="state">State</label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                className={errors.state ? 'error' : ''}
                            />
                            {errors.state && <span className="error-message">{errors.state}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="zipCode">ZIP Code</label>
                            <input
                                type="text"
                                id="zipCode"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                className={errors.zipCode ? 'error' : ''}
                            />
                            {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                        </div>
                    </div>
                </div>
                
                <div className="checkout-section">
                    <h3>Payment Information</h3>
                    
                    <div className="form-group">
                        <label htmlFor="cardNumber">Card Number</label>
                        <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="XXXX XXXX XXXX XXXX"
                            className={errors.cardNumber ? 'error' : ''}
                        />
                        {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="cardName">Name on Card</label>
                        <input
                            type="text"
                            id="cardName"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            className={errors.cardName ? 'error' : ''}
                        />
                        {errors.cardName && <span className="error-message">{errors.cardName}</span>}
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="expiryDate">Expiry Date</label>
                            <input
                                type="text"
                                id="expiryDate"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleInputChange}
                                placeholder="MM/YY"
                                className={errors.expiryDate ? 'error' : ''}
                            />
                            {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="cvv">CVV</label>
                            <input
                                type="text"
                                id="cvv"
                                name="cvv"
                                value={formData.cvv}
                                onChange={handleInputChange}
                                placeholder="XXX"
                                className={errors.cvv ? 'error' : ''}
                            />
                            {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                        </div>
                    </div>
                </div>
                
                <div className="checkout-summary">
                    <h3>Order Summary</h3>
                    
                    {cart.items && cart.items.map((item) => (
                        <div key={item.id} className="checkout-item">
                            <span>
                                {item.quantity} x {item.name} ({item.size})
                            </span>
                            <span>{format(item.price)}</span>
                        </div>
                    ))}
                    
                    <div className="checkout-total">
                        <strong>Total:</strong> {format(cart.total)}
                    </div>
                    
                    <div className="checkout-actions">
                        <Link href="/cart">
                            <button type="button" className="btn continue-shopping">
                                Back to Cart
                            </button>
                        </Link>
                        
                        <button
                            type="submit"
                            className="btn checkout-btn"
                            disabled={checkoutLoading}
                        >
                            {checkoutLoading ? 'Processing...' : 'Complete Order'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
} 