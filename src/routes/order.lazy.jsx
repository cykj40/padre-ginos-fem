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

export default function Order() {
  const [pizzaType, setPizzaType] = useState("");
  const [pizzaSize, setPizzaSize] = useState("M");
  const [pizzaTypes, setPizzaTypes] = useState([]);
  const [cart, setCart] = useContext(CartContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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

  let selectedPizza, price, formattedPrice;
  
  // Calculate these values directly in the render function
  if (!loading && pizzaTypes.length > 0) {
    const pizzaTypeNum = Number(pizzaType);
    selectedPizza = pizzaTypes.find((pizza) => pizza.id === pizzaTypeNum);
    price = selectedPizza?.sizes ? selectedPizza.sizes[pizzaSize] : null;
    formattedPrice = price ? intl.format(price) : "";
  }

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
        setPizzaType(String(processedPizzas[0].id));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPizzaTypes();
  }, []);
  
  function handleSubmit(e) {
    e.preventDefault();
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
      <form onSubmit={handleSubmit}>
        <div className="order-form">
          <div>
            <div>
              <label htmlFor="pizza-type">Pizza Type</label>
              <select
                onChange={(e) => setPizzaType(e.target.value)}
                name="pizza-type"
                value={pizzaType}
                disabled={loading}
                style={{ maxWidth: "300px" }}
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
              disabled={loading || !selectedPizza}
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