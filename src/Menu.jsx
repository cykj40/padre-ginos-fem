import { useState, useEffect } from 'react';
import { createFileRoute } from "@tanstack/react-router";

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function Menu() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    async function fetchPizzas() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pizzas`);
        const data = await response.json();
        if (mounted) {
          setPizzas(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    
    fetchPizzas();
    return () => { mounted = false; };
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

export const Route = createFileRoute('/menu')({
  component: Menu
}); 