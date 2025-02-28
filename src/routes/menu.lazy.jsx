import { createLazyFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from 'react';
import { fetchApi, getImageUrl } from "../api/config";

export const Route = createLazyFileRoute("/menu")({
  component: MenuRoute,
});

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function MenuRoute() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPizzas() {
      try {
        console.log("Fetching menu pizzas...");
        const data = await fetchApi('api/pizzas');
        
        // Process image URLs
        const processedPizzas = data.map(pizza => ({
          ...pizza,
          image: getImageUrl(pizza.image)
        }));
        
        setPizzas(processedPizzas);
        console.log("Menu data loaded successfully:", processedPizzas);
      } catch (err) {
        console.error("Error fetching menu:", err);
        setError(err.message);
        
        // Set fallback pizza data if API fails
        const fallbackPizzas = [
          {
            id: 1,
            name: "Classic Margherita",
            description: "The timeless Italian favorite with fresh mozzarella, tomatoes, and basil",
            image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            sizes: {
              S: 9.99,
              M: 12.99,
              L: 15.99
            }
          },
          {
            id: 2,
            name: "Pepperoni",
            description: "A classic American favorite with spicy pepperoni slices",
            image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            sizes: {
              S: 10.99,
              M: 13.99,
              L: 16.99
            }
          },
          {
            id: 3,
            name: "Vegetarian",
            description: "Fresh vegetables including bell peppers, mushrooms, onions, and olives",
            image: "https://images.unsplash.com/photo-1604917877934-07d8d248d396?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            sizes: {
              S: 11.99,
              M: 14.99,
              L: 17.99
            }
          },
          {
            id: 4,
            name: "Hawaiian",
            description: "Sweet pineapple and savory ham on a tomato base",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            sizes: {
              S: 11.99,
              M: 14.99,
              L: 17.99
            }
          },
          {
            id: 5,
            name: "Meat Lover's",
            description: "Loaded with pepperoni, sausage, bacon, and ground beef",
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            sizes: {
              S: 12.99,
              M: 15.99,
              L: 18.99
            }
          }
        ];
        
        setPizzas(fallbackPizzas);
        console.log("Using fallback menu data due to API error");
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
      {error && (
        <div className="notification" style={{ 
          padding: "10px", 
          margin: "10px 0", 
          backgroundColor: "#fff8e1", 
          borderRadius: "4px",
          border: "1px solid #ffe082",
          color: "#ff8f00"
        }}>
          <p>Note: Using offline menu data. Some items may not be available.</p>
        </div>
      )}
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

export default MenuRoute;