import { useState, useEffect } from 'react';
import { createLazyFileRoute } from "@tanstack/react-router";

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

  useEffect(() => {
    async function fetchPizzas() {
      const response = await fetch("/api/pizzas");
      const data = await response.json();
      setPizzas(data);
      setLoading(false);
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
            <img src={pizza.image} alt={pizza.name} />
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

export default Menu; 