import { useState, useEffect } from 'react';
import { createLazyFileRoute } from "@tanstack/react-router";

function Menu() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('API URL:', import.meta.env.VITE_API_URL);
    async function fetchPizzas() {
      console.log('Fetching from:', `${import.meta.env.VITE_API_URL}/api/pizzas`);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pizzas`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new TypeError("Oops, we haven't got JSON!");
        }
        const data = await response.json();
        console.log('Pizza data:', data);
        setPizzas(data);
      } catch (error) {
        console.error('Error fetching pizzas:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPizzas();
  }, []);

  if (loading) return <h2>Loading Menu...</h2>;

  return (
    <div className="menu">
      <h2>Menu</h2>
      <div className="menu-grid">
        {pizzas.map((pizza) => (
          <div key={pizza.id} className="menu-item">
            <img src={`${import.meta.env.VITE_API_URL}${pizza.image}`} alt={pizza.name} />
            <div className="menu-item-content">
              <h3>{pizza.name}</h3>
              <p className="description">{pizza.description}</p>
              <p className="price">From {intl.format(pizza.sizes.S)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const Route = createLazyFileRoute("/menu")({
  component: Menu
});

export default Menu; 