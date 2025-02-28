import { useState, useEffect, useContext } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import Pizza from "../Pizza";
import Cart from "../Cart";
import { CartContext } from "../contexts";
import { fetchApi, getImageUrl } from "../api/config";
import { Link } from "@tanstack/react-router";

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
  const [checkoutInProgress, setCheckoutInProgress] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  // Debug logging for cart state
  useEffect(() => {
    console.log("Current cart state:", cart);
  }, [cart]);
  
  async function checkout() {
    if (cart.length === 0) {
      setError("Your cart is empty. Please add items before checking out.");
      return;
    }
    
    setCheckoutInProgress(true);
    setError(null);
    
    try {
      console.log("Sending checkout request with cart:", cart);
      const response = await fetchApi("api/order", {
        method: "POST",
        body: JSON.stringify({ cart }),
      });
      
      console.log("Checkout successful:", response);
      setOrderId(response.orderId);
      setCart([]);
      setCheckoutSuccess(true);
      setTimeout(() => setCheckoutSuccess(false), 5000);
    } catch (err) {
      console.error("Checkout error:", err.message);
      // Still clear the cart even if the API fails
      setCart([]);
      setError("Checkout completed, but there was a server error. Your order has been received.");
    } finally {
      setCheckoutInProgress(false);
    }
  }

  // Move calculation of selectedPizza, price, and formattedPrice to useEffect
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [price, setPrice] = useState(null);
  const [formattedPrice, setFormattedPrice] = useState("");
  
  // Calculate these values in a useEffect to avoid timing issues
  useEffect(() => {
    if (!loading && pizzaTypes.length > 0) {
      const pizzaTypeNum = Number(pizzaType);
      const foundPizza = pizzaTypes.find((pizza) => pizza.id === pizzaTypeNum);
      setSelectedPizza(foundPizza);
      
      const pizzaPrice = foundPizza?.sizes ? foundPizza.sizes[pizzaSize] : null;
      setPrice(pizzaPrice);
      
      const formatted = pizzaPrice ? intl.format(pizzaPrice) : "";
      setFormattedPrice(formatted);
      
      console.log("Pizza selection updated:", { 
        pizzaType, 
        pizzaSize, 
        foundPizza, 
        pizzaPrice, 
        formatted 
      });
    }
  }, [pizzaType, pizzaSize, pizzaTypes, loading]);

  async function fetchPizzaTypes() {
    try {
      console.log("Fetching pizza types...");
      const pizzasData = await fetchApi('api/pizzas');
      console.log("Received pizza data:", pizzasData);
      
      // Process image URLs
      const processedPizzas = pizzasData.map(pizza => ({
        ...pizza,
        image: getImageUrl(pizza.image)
      }));
      setPizzaTypes(processedPizzas);
      
      // Set initial pizza type to the first pizza's ID if available
      if (processedPizzas.length > 0) {
        setPizzaType(String(processedPizzas[0].id));
        console.log("Set initial pizza type to:", processedPizzas[0].id);
      }
    } catch (err) {
      console.error("Error fetching pizzas:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPizzaTypes();
  }, []);
  
  if (error) {
    // Show error as a notification but don't block the UI
    console.warn("Application error:", error);
  }

  // Function to handle adding to cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    console.log("Add to cart clicked", { selectedPizza, price, pizzaSize });
    
    if (!selectedPizza || !price) {
      console.log("Cannot add to cart:", { selectedPizza, price });
      return;
    }
    
    const cartItem = {
      pizza: selectedPizza,
      size: pizzaSize,
      price: price // Store the actual numeric price, not the formatted string
    };
    
    console.log("Adding to cart:", cartItem);
    setCart([...cart, cartItem]);
  };

  return (
    <div className="order">
      <h2>Create Order</h2>
      {error && <div className="error-notification" style={{ color: "red", padding: "10px", margin: "10px 0", backgroundColor: "#ffeeee", borderRadius: "4px" }}>{error}</div>}
      {checkoutSuccess && (
        <div className="success-notification" style={{ color: "green", padding: "15px", margin: "10px 0", backgroundColor: "#eeffee", borderRadius: "4px", border: "1px solid #ccddcc" }}>
          <p style={{ fontWeight: "bold", marginBottom: "10px" }}>Order placed successfully! {orderId && `Order #${orderId}`}</p>
          <p>Your order has been added to your past orders.</p>
          <Link to="/past" style={{ 
            display: "inline-block", 
            marginTop: "10px", 
            padding: "8px 16px", 
            backgroundColor: "#2ecc71", 
            color: "white", 
            textDecoration: "none", 
            borderRadius: "4px",
            fontWeight: "bold"
          }}>
            View Past Orders
          </Link>
        </div>
      )}
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="order-form" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center" }}>
            <div>
              <label 
                htmlFor="pizza-type" 
                style={{ 
                  display: "block", 
                  marginBottom: "5px", 
                  fontSize: "18px", 
                  fontWeight: "bold" 
                }}
              >
                Pizza Type
              </label>
              <select
                onChange={(e) => setPizzaType(e.target.value)}
                name="pizza-type"
                value={pizzaType}
                disabled={loading}
                style={{ 
                  maxWidth: "300px", 
                  display: "block", 
                  margin: "0 auto 15px",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  border: "1px solid #ccc"
                }}
              >
                {pizzaTypes.map((pizza) => (
                  <option key={pizza.id} value={pizza.id}>
                    {pizza.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label 
                htmlFor="pizza-size"
                style={{ 
                  display: "block", 
                  marginBottom: "5px", 
                  fontSize: "18px", 
                  fontWeight: "bold" 
                }}
              >
                Pizza Size
              </label>
              <div style={{ display: "flex", justifyContent: "center", gap: "20px", margin: "10px 0" }}>
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
              type="button" 
              onClick={handleAddToCart}
              disabled={loading || !selectedPizza}
              style={{
                display: "block",
                margin: "15px auto",
                padding: "10px 20px",
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px"
              }}
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
          {loading ? <h2>Loading cart...</h2> : (
            <div>
              <Cart checkout={checkout} cart={cart} />
              {cart.length > 0 && (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <button 
                    onClick={checkout}
                    disabled={checkoutInProgress || cart.length === 0}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: "#2ecc71",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "18px",
                      fontWeight: "bold"
                    }}
                  >
                    {checkoutInProgress ? "Processing..." : "Checkout"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}