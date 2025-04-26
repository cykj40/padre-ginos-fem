'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSubmitted(true);
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            setError('Network error. Please try again.');
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="contact">
                <Header />
                <h2>Contact Us</h2>

                {submitted ? (
                    <div>
                        <h3>Thank You!</h3>
                        <p>Your message has been sent. We'll get back to you soon!</p>
                        <button onClick={() => setSubmitted(false)}>Send Another Message</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        <div>
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div>
                            <label htmlFor="subject">Subject:</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div>
                            <label htmlFor="message">Message:</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                required
                                disabled={isSubmitting}
                                rows="6"
                            ></textarea>
                        </div>

                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                )}

                <div>
                    <h3>Visit Us</h3>
                    <p>123 Pizza Street<br />Anytown, USA 12345</p>

                    <h3>Call Us</h3>
                    <p>(555) 123-4567</p>

                    <h3>Hours</h3>
                    <p>Monday - Thursday: 11am - 10pm<br />
                        Friday - Saturday: 11am - 11pm<br />
                        Sunday: 12pm - 9pm</p>
                </div>
            </div>
            <Footer />
        </>
    );
} 