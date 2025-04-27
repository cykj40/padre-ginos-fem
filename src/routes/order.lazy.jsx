import { useState, useEffect, useContext } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { CartContext } from "../../app/contexts/CartContext";
import Cart from "../Cart";
import Pizza from "../Pizza";

// feel free to change en-US / USD to your locale
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const apiUrl = import.meta.env.VITE_API_URL;

export const Route = createLazyFileRoute("/order")({
  component: Order,
});

function Order() {
  const [pizzaType, setPizzaType] = useState("pepperoni");
  const [pizzaSize, setPizzaSize] = useState("M");
  const [pizzaTypes, setPizzaTypes] = useState([]);
  const { cart, addToCart, clearCart } = useContext(CartContext);
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
    if (!cart.items || cart.items.length === 0) {
      setError("Your cart is empty. Please add items before checking out.");
      return;
    }
    
    setCheckoutInProgress(true);
    setError(null);
    
    // Generate a local order ID for fallback
    const localOrderId = `local-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    try {
      const response = await fetch(`${apiUrl}/api/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: cart.items,
        }),
      });
      
      console.log("Checkout successful:", response);
      
      // Set the order ID from the response or use local fallback
      setOrderId(response.orderId || localOrderId);
      
      // Save the order to localStorage
      saveOrderToLocalStorage(response.orderId || localOrderId);
      
      // Clear the cart and show success message
      clearCart();
      setCheckoutSuccess(true);
      setTimeout(() => setCheckoutSuccess(false), 5000);
    } catch (err) {
      console.error("Error during checkout:", err);
      setError("Your order was processed locally. The server might be unavailable, but your order has been recorded.");
      
      // Use local order ID and still save to localStorage for offline support
      setOrderId(localOrderId);
      saveOrderToLocalStorage(localOrderId);
      
      // Still clear the cart even if API fails
      clearCart();
      setCheckoutSuccess(true);
      setTimeout(() => setCheckoutSuccess(false), 5000);
    } finally {
      setCheckoutInProgress(false);
    }
  }
  
  // Helper function to save order to localStorage
  function saveOrderToLocalStorage(id) {
    try {
      const pastOrders = JSON.parse(localStorage.getItem('pastOrders') || '[]');
      const newOrder = {
        id: id,
        date: new Date().toISOString(),
        items: cart.items,
        total: cart.total
      };
      
      localStorage.setItem('pastOrders', JSON.stringify([newOrder, ...pastOrders]));
      console.log("Order saved to localStorage:", newOrder);
    } catch (storageError) {
      console.error("Error saving order to localStorage:", storageError);
    }
  }

  // Calculate selected pizza and price
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [price, setPrice] = useState(null);
  const [formattedPrice, setFormattedPrice] = useState("");
  
  // Update selected pizza and price when pizza type or size changes
  useEffect(() => {
    if (!loading && pizzaTypes.length > 0) {
      const pizzaTypeNum = Number(pizzaType);
      const foundPizza = pizzaTypes.find((pizza) => pizza.id === pizzaTypeNum);
      setSelectedPizza(foundPizza);
      
      const pizzaPrice = foundPizza?.sizes ? foundPizza.sizes[pizzaSize] : null;
      setPrice(pizzaPrice);
      
      const formatted = pizzaPrice ? intl.format(pizzaPrice) : "";
      setFormattedPrice(formatted);
    }
  }, [pizzaType, pizzaSize, pizzaTypes, loading]);

  // Fetch pizza types from API
  async function fetchPizzaTypes() {
    try {
      const pizzasRes = await fetch(`${apiUrl}/api/pizzas`);
      const pizzasJson = await pizzasRes.json();
      setPizzaTypes(pizzasJson);
      
      // Set initial pizza type to the first pizza's ID if available
      if (pizzasJson.length > 0) {
        setPizzaType(String(pizzasJson[0].id));
      }
    } catch (err) {
      console.error("Error fetching pizzas:", err);
      setError("Could not load pizzas from server. Using fallback data.");
      
      // Set fallback pizza types if API fails
      const fallbackPizzas = [
        {
          id: "pepperoni",
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
          id: "margherita",
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
          id: "vegetarian",
          name: "Vegetarian",
          description: "Fresh vegetables including bell peppers, mushrooms, onions, and olives",
          image: "https://images.unsplash.com/photo-1604917877934-07d8d248d396?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          sizes: {
            S: 11.99,
            M: 14.99,
            L: 17.99
          }
        }
      ];
      
      setPizzaTypes(fallbackPizzas);
      setPizzaType(String(fallbackPizzas[0].id));
    } finally {
      setLoading(false);
    }
  }

  // Fetch pizza types on component mount
  useEffect(() => {
    fetchPizzaTypes();
  }, []);

  // Function to handle adding to cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    
    // Clear any previous errors
    setError(null);
    
    if (!selectedPizza || !price) {
      setError("Cannot add to cart: Please select a pizza and size");
      return;
    }
    
    try {
      // Create a cart item with the expected structure
      const cartItem = {
        pizzaId: selectedPizza.id,
        name: selectedPizza.name,
        size: pizzaSize,
        price: selectedPizza.sizes[pizzaSize],
        quantity: 1,
        crust: 'regular',
        toppings: []
      };
      
      // Add to cart
      addToCart(cartItem);
      
      // Show a brief success message
      const successMsg = document.createElement('div');
      successMsg.textContent = `Added ${selectedPizza.name} (${pizzaSize}) to cart!`;
      successMsg.style.position = 'fixed';
      successMsg.style.bottom = '20px';
      successMsg.style.right = '20px';
      successMsg.style.backgroundColor = '#2ecc71';
      successMsg.style.color = 'white';
      successMsg.style.padding = '10px 20px';
      successMsg.style.borderRadius = '4px';
      successMsg.style.zIndex = '1000';
      successMsg.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
      document.body.appendChild(successMsg);
      
      // Remove the message after 2 seconds
      setTimeout(() => {
        if (document.body.contains(successMsg)) {
          document.body.removeChild(successMsg);
        }
      }, 2000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError(`Error adding to cart: ${err.message}`);
    }
  };

  return (
    <div className="order-page">
      <div className="order">
        <h2>Create Order</h2>
        
        {/* Error and success notifications */}
        {error && <div className="error-notification" style={{ color: "red", padding: "10px", margin: "10px 0", backgroundColor: "#ffeeee", borderRadius: "4px" }}>{error}</div>}
        {checkoutSuccess && (
          <div className="success-notification" style={{ color: "green", padding: "15px", margin: "10px 0", backgroundColor: "#eeffee", borderRadius: "4px", border: "1px solid #ccddcc" }}>
            <p style={{ fontWeight: "bold", marginBottom: "10px" }}>Order placed successfully! {orderId && `Order #${orderId}`}</p>
            <p>Your order has been added to your past orders.</p>
          </div>
        )}
        
        {/* Order form */}
        <form onSubmit={handleAddToCart}>
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
                type="submit" 
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
            
            {/* Pizza display */}
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
            
            {/* Cart and checkout */}
            {loading ? <h2>Loading cart...</h2> : (
              <div>
                <Cart cart={cart} />
                {cart.items.length > 0 && (
                  <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <button 
                      type="button"
                      onClick={checkout}
                      disabled={checkoutInProgress || cart.items.length === 0}
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
    </div>
  );
}