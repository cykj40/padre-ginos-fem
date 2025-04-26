'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// Fallback pizza data for static rendering
const FALLBACK_PIZZAS = [
  {
    id: 'p1',
    name: 'Margherita',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 10.99,
    image: '/assets/pizzas/napolitana.webp',
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
  const [pizzas, setPizzas] = useState(FALLBACK_PIZZAS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    async function fetchPizzas() {
      try {
        const response = await fetch('/api/pizzas');
        if (!response.ok) {
          throw new Error('Failed to fetch pizzas');
        }
        const data = await response.json();
        setPizzas(data.length ? data : FALLBACK_PIZZAS);
      } catch (err) {
        console.error('Error fetching pizzas:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPizzas();
  }, []);

  const handleImageError = (pizzaId) => {
    setImageErrors(prev => ({
      ...prev,
      [pizzaId]: true
    }));
    console.error(`Failed to load image for pizza ${pizzaId}`);
  };

  if (loading) return (
    <>
      <Header />
      <div className="container">
        <h2>Loading Menu...</h2>
      </div>
      <Footer />
    </>
  );
  
  if (error) return (
    <>
      <Header />
      <div className="container">
        <h2>Error: {error}</h2>
        <p>Please try again later</p>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Header />
      <div className="menu container">
        <h2>Our Menu</h2>
        <div className="menu-grid">
          {pizzas.map((pizza) => (
            <div key={pizza.id} className="menu-item">
              <img 
                src={pizza.image || '/assets/pizzas/veggie.webp'} 
                alt={pizza.name}
                onError={() => handleImageError(pizza.id)}
                style={{ 
                  opacity: imageErrors[pizza.id] ? 0.5 : 1,
                  maxWidth: '300px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '1px solid #ccc'
                }}
              />
              <div className="menu-item-content">
                <h3>{pizza.name}</h3>
                <p className="description">{pizza.description}</p>
                <p className="price">
                  {intl.format(pizza.price)}
                </p>
                {imageErrors[pizza.id] && (
                  <p className="image-error">Image temporarily unavailable</p>
                )}
                <button className="btn">Order Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
} 