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
      setError(err.message);
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
      
      console.log("Pizza selection updated:", {
        pizzaTypeNum,
        foundPizza,
        newPrice,
        formattedPrice: newPrice ? intl.format(newPrice) : ""
      });
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
      setError(err.message);
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

  // Debug useEffect to trace state changes
  useEffect(() => {
    console.log("State updated:", {
      selectedPizza: selectedPizza?.name,
      price,
      formattedPrice
    });
  }, [selectedPizza, price, formattedPrice]);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="order">
      <h2>Create Order</h2>
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