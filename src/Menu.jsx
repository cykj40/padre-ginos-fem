import { useState, useEffect } from 'react';
import { createLazyFileRoute } from "@tanstack/react-router";
import { fetchApi } from './api/config';

export const Route = createLazyFileRoute("/menu")({
  component: Menu,
});

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function Menu() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    async function fetchPizzas() {
      try {
        const data = await fetchApi('/api/pizzas');
        setPizzas(data);
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

  if (loading) return <h2>Loading Menu...</h2>;
  if (error) return <h2>Error: {error}</h2>;

  return (
    <div className="menu">
      <h2>Menu</h2>
      <div className="menu-grid">
        {pizzas.map((pizza) => (
          <div key={pizza.id} className="menu-item">
            <img 
              src={pizza.image} 
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
              <p className="price">From {intl.format(pizza.sizes.S)}</p>
              {imageErrors[pizza.id] && (
                <p className="image-error">Image temporarily unavailable</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu; 