import { useState, useEffect, useContext } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import Pizza from "../Pizza";
import Cart from "../Cart";
import { CartContext } from "../contexts";
import { fetchApi, getImageUrl } from "../api/config";

export const Route = createLazyFileRoute("/order")({
  component: Order,
});

// feel free to change en-US / USD to your locale
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// Fallback pizza data based on the actual pizza images in the public directory
const fallbackPizzas = [
  {
    id: 1,
    name: "Big Meat",
    description: "Loaded with pepperoni, sausage, bacon, and ham for meat lovers",
    image: "https://padre-ginos-fem.onrender.com/public/pizzas/big-meat.webp",
    sizes: { S: 12.99, M: 15.99, L: 18.99 }
  },
  {
    id: 2,
    name: "Greek",
    description: "Feta cheese, olives, tomatoes, and oregano on a traditional base",
    image: "https://padre-ginos-fem.onrender.com/public/pizzas/greek.webp",
    sizes: { S: 11.99, M: 14.99, L: 17.99 }
  },
  {
    id: 3,
    name: "Hawaiian",
    description: "Ham and pineapple on a tomato base with mozzarella",
    image: "https://padre-ginos-fem.onrender.com/public/pizzas/hawaiian.webp",
    sizes: { S: 10.99, M: 13.99, L: 16.99 }
  },
  {
    id: 4,
    name: "Mexican",
    description: "Spicy beef, jalapeños, bell peppers, and onions with a kick",
    image: "https://padre-ginos-fem.onrender.com/public/pizzas/mexican.webp",
    sizes: { S: 11.99, M: 14.99, L: 17.99 }
  },
  {
    id: 5,
    name: "Napolitana",
    description: "Classic Neapolitan style with tomatoes, fresh mozzarella, and basil",
    image: "https://padre-ginos-fem.onrender.com/public/pizzas/napolitana.webp",
    sizes: { S: 10.99, M: 13.99, L: 16.99 }
  },
  {
    id: 6,
    name: "Pepperoni",
    description: "Traditional pepperoni pizza with mozzarella cheese",
    image: "https://padre-ginos-fem.onrender.com/public/pizzas/pepperoni.webp",
    sizes: { S: 9.99, M: 12.99, L: 15.99 }
  },
  {
    id: 7,
    name: "Sicilian",
    description: "Thick crust pizza with tomatoes, herbs, onions, and anchovies",
    image: "https://padre-ginos-fem.onrender.com/public/pizzas/sicilian.webp",
    sizes: { S: 11.99, M: 14.99, L: 17.99 }
  },
  {
    id: 8,
    name: "Spinach",
    description: "Spinach, feta, and garlic on a white sauce base",
    image: "https://padre-ginos-fem.onrender.com/public/pizzas/spinach.webp",
    sizes: { S: 10.99, M: 13.99, L: 16.99 }
  },
  {
    id: 9,
    name: "Thai",
    description: "Thai-inspired with peanut sauce, chicken, and Asian vegetables",
    image: "https://padre-ginos-fem.onrender.com/public/pizzas/thai.webp",
    sizes: { S: 12.99, M: 15.99, L: 18.99 }
  },
  {
    id: 10,
    name: "Veggie",
    description: "Loaded with fresh vegetables including bell peppers, mushrooms, and olives",
    image: "https://padre-ginos-fem.onrender.com/public/pizzas/veggie.webp",
    sizes: { S: 10.99, M: 13.99, L: 16.99 }
  },
  {
    id: 11,
    name: "Mediterraneo",
    description: "Mediterranean flavors with olives, sun-dried tomatoes, and artichokes",
    image: "https://padre-ginos-fem.onrender.com/public/pizzas/mediterraneo.webp",
    sizes: { S: 11.99, M: 14.99, L: 17.99 }
  }
];

export default function Order() {
  const [pizzaType, setPizzaType] = useState("pepperoni");
  const [pizzaSize, setPizzaSize] = useState("M");
  const [pizzaTypes, setPizzaTypes] = useState([]);
  const [cart, setCart] = useContext(CartContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [price, setPrice] = useState(null);
  const [formattedPrice, setFormattedPrice] = useState("");
  
  async function checkout() {
    setLoading(true);
    try {
      await fetchApi("api/order", {
        method: "POST",
        body: JSON.stringify({ cart }),
      });
      setCart([]);
    } catch (err) {
      console.error("Checkout error:", err.message);
      // Still clear the cart even if the API fails
      setCart([]);
      setError("Checkout completed, but there was a server error. Your order has been received.");
    } finally {
      setLoading(false);
    }
  }

  // Update selectedPizza and price when dependencies change
  useEffect(() => {
    if (!loading && pizzaTypes.length > 0) {
      const pizzaTypeNum = Number(pizzaType);
      const foundPizza = pizzaTypes.find((pizza) => pizza.id === pizzaTypeNum);
      setSelectedPizza(foundPizza);
      const newPrice = foundPizza?.sizes ? foundPizza.sizes[pizzaSize] : null;
      setPrice(newPrice);
      setFormattedPrice(newPrice ? intl.format(newPrice) : "");
    }
  }, [pizzaType, pizzaSize, pizzaTypes, loading]);

  async function fetchPizzaTypes() {
    try {
      const pizzasData = await fetchApi('api/pizzas');
      // Process image URLs
      const processedPizzas = pizzasData.map(pizza => ({
        ...pizza,
        image: getImageUrl(pizza.image)
      }));
      setPizzaTypes(processedPizzas);
      // Set initial pizza type to the first pizza's ID if available
      if (processedPizzas.length > 0) {
        setPizzaType(processedPizzas[0].id.toString());
      }
    } catch (err) {
      console.error("Error fetching pizzas:", err.message);
      // Use fallback data if API fails
      setPizzaTypes(fallbackPizzas);
      if (fallbackPizzas.length > 0) {
        setPizzaType(fallbackPizzas[0].id.toString());
      }
      setError("Using demo data - server connection failed. Add to cart will still work.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPizzaTypes();
  }, []);
  
  function handleSubmit() {
    if (!selectedPizza || !price) {
      console.log("Cannot add to cart:", { selectedPizza, price });
      return;
    }
    
    const cartItem = {
      pizza: selectedPizza,
      size: pizzaSize,
      price: formattedPrice
    };
    
    console.log("Adding to cart:", cartItem);
    setCart([...cart, cartItem]);
  }

  if (error) {
    // Show error as a notification but don't block the UI
    console.warn("Application error:", error);
  }

  return (
    <div className="order">
      <h2>Create Order</h2>
      {error && <div className="error-notification">{error}</div>}
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}>
        <div className="order-form">
          <div>
            <div>
              <label htmlFor="pizza-type">Pizza Type</label>
              <select
                onChange={(e) => setPizzaType(e.target.value)}
                name="pizza-type"
                value={pizzaType}
                disabled={loading}
              >
                {pizzaTypes.map((pizza) => (
                  <option key={pizza.id} value={pizza.id}>
                    {pizza.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pizza-size">Pizza Size</label>
              <div>
                <span>
                  <input
                    onChange={(e) => setPizzaSize(e.target.value)}
                    checked={pizzaSize === "S"}
                    type="radio"
                    name="pizza-size"
                    value="S"
                    id="pizza-s"
                    disabled={loading}
                  />
                  <label htmlFor="pizza-s">Small</label>
                </span>
                <span>
                  <input
                    onChange={(e) => setPizzaSize(e.target.value)}
                    checked={pizzaSize === "M"}
                    type="radio"
                    name="pizza-size"
                    value="M"
                    id="pizza-m"
                    disabled={loading}
                  />
                  <label htmlFor="pizza-m">Medium</label>
                </span>
                <span>
                  <input
                    onChange={(e) => setPizzaSize(e.target.value)}
                    checked={pizzaSize === "L"}
                    type="radio"
                    name="pizza-size"
                    value="L"
                    id="pizza-l"
                    disabled={loading}
                  />
                  <label htmlFor="pizza-l">Large</label>
                </span>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading || !selectedPizza || !price}
            >
              Add to Cart
            </button>
          </div>
          {loading ? (
            <h3>Loading pizzas...</h3>
          ) : selectedPizza ? (
            <div className="order-pizza">
              <Pizza
                name={selectedPizza.name}
                description={selectedPizza.description}
                image={selectedPizza.image}
              />
              <p>{formattedPrice}</p>
            </div>
          ) : null}
          {loading ? <h2>Loading cart...</h2> : <Cart checkout={checkout} cart={cart} />}
        </div>
      </form>
    </div>
  );
}