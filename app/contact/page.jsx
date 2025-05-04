'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        topic: 'general',
        message: '',
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // Here you would typically send the form data to your backend
            console.log('Form submitted:', formData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Reset form and show success message
            setFormData({ name: '', email: '', phone: '', topic: 'general', message: '' });
            setShowSuccess(true);
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                setShowSuccess(false);
            }, 5000);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="contact-container">
            {showSuccess && (
                <div className="success-notification">
                    <div className="success-content">
                        <div className="success-icon">✓</div>
                        <div className="success-message">
                            <h3>Message Sent!</h3>
                            <p>Thanks for reaching out. We'll get back to you soon.</p>
                        </div>
                        <button 
                            className="close-notification"
                            onClick={() => setShowSuccess(false)}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
            
            <div className="contact-content">
                <div className="contact-text">
                    <h1>We'd Love to Hear from You!</h1>
                    <p>
                        Have a question about our menu? Want to place a large catering order? 
                        Share your dining experience or provide feedback? We're here to help!
                    </p>
                    <p>
                        Whether you're planning a special event, have dietary concerns, or just want 
                        to tell us how much you enjoyed our authentic Italian pizza, please fill out 
                        the form and we'll get back to you as soon as possible.
                    </p>
                </div>
                
                <div className="contact-form-container">
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Name"
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone number"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="form-group">
                            <select
                                id="topic"
                                name="topic"
                                value={formData.topic}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className="topic-select"
                            >
                                <option value="general">General Inquiry</option>
                                <option value="reservation">Reservation Question</option>
                                <option value="catering">Catering & Events</option>
                                <option value="feedback">Feedback & Reviews</option>
                                <option value="orders">Order Support</option>
                                <option value="dietary">Dietary Concerns</option>
                                <option value="employment">Employment Opportunities</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tell us more about your inquiry..."
                                required
                                rows={5}
                                disabled={isSubmitting}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="send-message-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                        </button>
                        
                        <p className="privacy-notice">
                            This site is protected by reCAPTCHA and the Google{' '}
                            <Link href="/privacy-policy">Privacy Policy</Link> and{' '}
                            <Link href="/terms-of-service">Terms of Service</Link> apply.
                        </p>
                    </form>
                </div>
            </div>
            
            <div className="location-section">
                <h2>Visit Us</h2>
                <div className="map-container">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.2375559623377!2d-74.0060!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjEiTiA3NMKwMDAnMjEuNiJX!5e0!3m2!1sen!2sus!4v1651234567890!5m2!1sen!2sus" 
                        width="100%" 
                        height="450" 
                        style={{ border: 0 }} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', width: '100%' }}>
                    <div style={{ flex: 1, padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: 'rgba(218,47,4,0.1)', borderRadius: '50%', color: '#da2f04' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} width="24" height="24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        </div>
                        <h3 style={{ textAlign: 'center', fontSize: '1.1rem', marginBottom: '8px', color: '#da2f04' }}>Our Address</h3>
                        <p style={{ textAlign: 'center', margin: '4px 0', fontSize: '0.95rem' }}>123 Pizza Street</p>
                        <p style={{ textAlign: 'center', margin: '4px 0', fontSize: '0.95rem' }}>New York, NY 10001</p>
                    </div>
                    
                    <div style={{ flex: 1, padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: 'rgba(218,47,4,0.1)', borderRadius: '50%', color: '#da2f04' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} width="24" height="24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <h3 style={{ textAlign: 'center', fontSize: '1.1rem', marginBottom: '8px', color: '#da2f04' }}>Opening Hours</h3>
                        <p style={{ textAlign: 'center', margin: '4px 0', fontSize: '0.95rem' }}>Monday - Friday: 11am - 10pm</p>
                        <p style={{ textAlign: 'center', margin: '4px 0', fontSize: '0.95rem' }}>Saturday - Sunday: 11am - 11pm</p>
                    </div>
                    
                    <div style={{ flex: 1, padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: 'rgba(218,47,4,0.1)', borderRadius: '50%', color: '#da2f04' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} width="24" height="24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                        </div>
                        <h3 style={{ textAlign: 'center', fontSize: '1.1rem', marginBottom: '8px', color: '#da2f04' }}>Contact</h3>
                        <p style={{ textAlign: 'center', margin: '4px 0', fontSize: '0.95rem' }}>Phone: (555) 123-4567</p>
                        <p style={{ textAlign: 'center', margin: '4px 0', fontSize: '0.95rem' }}>Email: info@papagiorgios.com</p>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .contact-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem 1rem;
                    font-family: 'Inter', sans-serif;
                    position: relative;
                }
                
                .success-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1000;
                    animation: slideIn 0.5s forwards;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                .success-content {
                    background-color: #4CAF50;
                    color: white;
                    padding: 1rem;
                    border-radius: 4px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    display: flex;
                    align-items: center;
                    max-width: 400px;
                }
                
                .success-icon {
                    background-color: white;
                    color: #4CAF50;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 1rem;
                    font-weight: bold;
                }
                
                .success-message {
                    flex: 1;
                }
                
                .success-message h3 {
                    margin: 0;
                    font-size: 1.1rem;
                }
                
                .success-message p {
                    margin: 0.25rem 0 0 0;
                    font-size: 0.9rem;
                }
                
                .close-notification {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0 0 0 1rem;
                }
                
                .contact-content {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    margin-bottom: 3rem;
                }
                
                @media (min-width: 768px) {
                    .contact-content {
                        flex-direction: row;
                        align-items: flex-start;
                    }
                    
                    .contact-text,
                    .contact-form-container {
                        flex: 1;
                    }
                }
                
                .contact-text {
                    padding-right: 2rem;
                }
                
                .contact-text h1 {
                    color: #666;
                    font-size: 2.5rem;
                    font-weight: 500;
                    margin-bottom: 1.5rem;
                }
                
                .contact-text p {
                    color: #666;
                    font-size: 1.1rem;
                    line-height: 1.6;
                    margin-bottom: 1rem;
                }
                
                .contact-form-container {
                    background-color: #fff;
                    border-radius: 4px;
                }
                
                .contact-form {
                    width: 100%;
                }
                
                .form-group {
                    margin-bottom: 1rem;
                }
                
                .form-group input,
                .form-group textarea,
                .form-group select {
                    width: 100%;
                    padding: 0.8rem;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 1rem;
                    transition: border-color 0.3s;
                }
                
                .form-group input:focus,
                .form-group textarea:focus,
                .form-group select:focus {
                    outline: none;
                    border-color: #e63946;
                }
                
                .form-group input:disabled,
                .form-group textarea:disabled,
                .form-group select:disabled {
                    background-color: #f9f9f9;
                    cursor: not-allowed;
                }
                
                .topic-select {
                    appearance: none;
                    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
                    background-position: right 0.5rem center;
                    background-repeat: no-repeat;
                    background-size: 1.5em 1.5em;
                    padding-right: 2.5rem;
                }
                
                .send-message-btn {
                    background-color: #e63946;
                    color: white;
                    border: none;
                    padding: 0.8rem 2rem;
                    border-radius: 4px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background-color 0.3s;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-top: 1rem;
                    width: 100%;
                }
                
                .send-message-btn:hover:not(:disabled) {
                    background-color: #d62f3c;
                }
                
                .send-message-btn:disabled {
                    background-color: #e6a0a5;
                    cursor: not-allowed;
                }
                
                .privacy-notice {
                    margin-top: 1.5rem;
                    font-size: 0.8rem;
                    color: #999;
                    text-align: center;
                }
                
                .privacy-notice a {
                    color: #666;
                    text-decoration: underline;
                }
                
                /* Location section styles */
                .location-section {
                    margin-top: 3rem;
                }
                
                .location-section h2 {
                    text-align: center;
                    margin-bottom: 2rem;
                    font-size: 1.8rem;
                    color: var(--primary);
                    font-family: var(--font);
                }
                
                .map-container {
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    height: 400px;
                    margin-bottom: 2rem;
                    width: 100%;
                }
                
                .map-container iframe {
                    height: 100%;
                }
            `}</style>
        </div>
    );
} 