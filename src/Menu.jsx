'use client';

import { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CartContext } from '../app/contexts/CartContext';

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// Fallback pizza data for static rendering
const FALLBACK_PIZZAS = [
  {
    id: 'margherita',
    name: 'Margherita',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 10.99,
    image: '/assets/pizzas/napolitana.webp',
    ingredients: ['Tomato Sauce', 'Mozzarella', 'Basil', 'Olive Oil'],
    vegetarian: true,
    spicy: false
  },
  {
    id: 'pepperoni',
    name: 'Pepperoni',
    description: 'Traditional pizza topped with pepperoni and cheese',
    price: 12.99,
    image: '/assets/pizzas/pepperoni.webp',
    ingredients: ['Tomato Sauce', 'Mozzarella', 'Pepperoni'],
    vegetarian: false,
    spicy: true
  }
];

export default function Menu() {
  const [pizzas, setPizzas] = useState(FALLBACK_PIZZAS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [filter, setFilter] = useState('all');
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [orderOptions, setOrderOptions] = useState({
    size: 'M',
    crust: 'regular',
    quantity: 1,
    toppings: []
  });
  
  // Get cart functions from context
  const { addToCart } = useContext(CartContext);

  const fetchPizzas = async (filterType = null) => {
    setLoading(true);
    try {
      const url = filterType && filterType !== 'all' 
        ? `/api/pizzas?type=${filterType}`
        : '/api/pizzas';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch pizzas');
      }
      const data = await response.json();
      setPizzas(data.length ? data : FALLBACK_PIZZAS);
    } catch (err) {
      console.error('Error fetching pizzas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPizzas(filter);
  }, [filter]);

  const handleFilter = (type) => {
    setFilter(type);
  };

  const handleImageError = (pizzaId) => {
    setImageErrors(prev => ({
      ...prev,
      [pizzaId]: true
    }));
    console.error(`Failed to load image for pizza ${pizzaId}`);
  };
  
  const handleSelectPizza = (pizza) => {
    setSelectedPizza(pizza);
    
    // Set default options based on pizza
    setOrderOptions({
      size: 'M',
      crust: 'regular',
      quantity: 1,
      toppings: []
    });
  };
  
  const handleCloseOrder = () => {
    setSelectedPizza(null);
  };
  
  const handleOptionChange = (option, value) => {
    setOrderOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };
  
  const handleToppingToggle = (topping) => {
    setOrderOptions(prev => {
      const currentToppings = [...prev.toppings];
      
      if (currentToppings.includes(topping)) {
        return {
          ...prev,
          toppings: currentToppings.filter(t => t !== topping)
        };
      } else {
        return {
          ...prev,
          toppings: [...currentToppings, topping]
        };
      }
    });
  };
  
  const calculatePrice = () => {
    if (!selectedPizza) return 0;
    
    let basePrice = selectedPizza.sizes?.[orderOptions.size] || selectedPizza.price;
    
    // Extra for premium crust
    if (orderOptions.crust === 'thin') basePrice += 1;
    if (orderOptions.crust === 'stuffed') basePrice += 2;
    
    // Add for toppings ($0.75 each)
    basePrice += (orderOptions.toppings.length * 0.75);
    
    // Multiply by quantity
    return basePrice * orderOptions.quantity;
  };
  
  const handleAddToCart = async () => {
    if (!selectedPizza) return;
    
    const item = {
      pizzaId: selectedPizza.id,
      name: selectedPizza.name,
      size: orderOptions.size,
      crust: orderOptions.crust,
      quantity: orderOptions.quantity,
      toppings: orderOptions.toppings,
      price: calculatePrice()
    };
    
    const success = await addToCart(item);
    
    if (success) {
      // Reset and close the order form
      setSelectedPizza(null);
      alert('Added to cart!');
    } else {
      alert('Failed to add to cart. Please try again.');
    }
  };

  if (loading) return (
    <>
      <Header />
      <div className="container">
        <h2>Loading Menu...</h2>
      </div>
      <Footer />
    </>
  );
  
  if (error) return (
    <>
      <Header />
      <div className="container">
        <h2>Error: {error}</h2>
        <p>Please try again later</p>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Header />
      <div className="menu container">
        <h2>Our Menu</h2>
        
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => handleFilter('all')}
          >
            All Pizzas
          </button>
          <button 
            className={filter === 'vegetarian' ? 'active' : ''} 
            onClick={() => handleFilter('vegetarian')}
          >
            Vegetarian
          </button>
          <button 
            className={filter === 'spicy' ? 'active' : ''} 
            onClick={() => handleFilter('spicy')}
          >
            Spicy
          </button>
          <button 
            className={filter === 'popular' ? 'active' : ''} 
            onClick={() => handleFilter('popular')}
          >
            Popular
          </button>
        </div>
        
        <div className="menu-grid">
          {pizzas.map((pizza) => (
            <div key={pizza.id} className="menu-item">
              <img 
                src={pizza.image || '/assets/pizzas/veggie.webp'} 
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
                <div className="tags">
                  {pizza.vegetarian && <span className="tag vegetarian">Vegetarian</span>}
                  {pizza.spicy && <span className="tag spicy">Spicy</span>}
                  {pizza.popular && <span className="tag popular">Popular</span>}
                </div>
                <p className="price">
                  {intl.format(pizza.price)}
                </p>
                {pizza.sizes && (
                  <div className="sizes">
                    <span>Available sizes: </span>
                    {Object.entries(pizza.sizes).map(([size, price]) => (
                      <span key={size}>{size}: {intl.format(price)} </span>
                    ))}
                  </div>
                )}
                {imageErrors[pizza.id] && (
                  <p className="image-error">Image temporarily unavailable</p>
                )}
                <button className="btn" onClick={() => handleSelectPizza(pizza)}>
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {selectedPizza && (
          <div className="order-modal">
            <div className="order-modal-content">
              <button className="close-btn" onClick={handleCloseOrder}>×</button>
              <h3>Create Your Order</h3>
              <div className="selected-pizza">
                <img 
                  src={selectedPizza.image || '/assets/pizzas/veggie.webp'} 
                  alt={selectedPizza.name}
                  style={{ 
                    maxWidth: '150px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
                <div>
                  <h4>{selectedPizza.name}</h4>
                  <p>{selectedPizza.description}</p>
                </div>
              </div>
              
              <div className="order-options">
                <div className="option-group">
                  <label>Size:</label>
                  <div className="radio-group">
                    <label>
                      <input 
                        type="radio" 
                        name="size" 
                        value="S" 
                        checked={orderOptions.size === 'S'} 
                        onChange={() => handleOptionChange('size', 'S')} 
                      />
                      Small
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        name="size" 
                        value="M" 
                        checked={orderOptions.size === 'M'} 
                        onChange={() => handleOptionChange('size', 'M')} 
                      />
                      Medium
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        name="size" 
                        value="L" 
                        checked={orderOptions.size === 'L'} 
                        onChange={() => handleOptionChange('size', 'L')} 
                      />
                      Large
                    </label>
                  </div>
                </div>
                
                <div className="option-group">
                  <label>Crust:</label>
                  <div className="radio-group">
                    <label>
                      <input 
                        type="radio" 
                        name="crust" 
                        value="regular" 
                        checked={orderOptions.crust === 'regular'} 
                        onChange={() => handleOptionChange('crust', 'regular')} 
                      />
                      Regular
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        name="crust" 
                        value="thin" 
                        checked={orderOptions.crust === 'thin'} 
                        onChange={() => handleOptionChange('crust', 'thin')} 
                      />
                      Thin (+$1.00)
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        name="crust" 
                        value="stuffed" 
                        checked={orderOptions.crust === 'stuffed'} 
                        onChange={() => handleOptionChange('crust', 'stuffed')} 
                      />
                      Stuffed (+$2.00)
                    </label>
                  </div>
                </div>
                
                <div className="option-group">
                  <label>Extra Toppings (+$0.75 each):</label>
                  <div className="checkbox-group">
                    {['Pepperoni', 'Mushrooms', 'Onions', 'Sausage', 'Extra cheese', 'Bell Peppers'].map(topping => (
                      <label key={topping}>
                        <input 
                          type="checkbox" 
                          checked={orderOptions.toppings.includes(topping)} 
                          onChange={() => handleToppingToggle(topping)} 
                        />
                        {topping}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="option-group">
                  <label>Quantity:</label>
                  <select 
                    value={orderOptions.quantity} 
                    onChange={(e) => handleOptionChange('quantity', parseInt(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="order-summary">
                <h4>Order Summary</h4>
                <p><strong>Size:</strong> {orderOptions.size}</p>
                <p><strong>Crust:</strong> {orderOptions.crust}</p>
                <p><strong>Toppings:</strong> {orderOptions.toppings.length > 0 ? orderOptions.toppings.join(', ') : 'None'}</p>
                <p><strong>Quantity:</strong> {orderOptions.quantity}</p>
                <p className="total-price"><strong>Total:</strong> {intl.format(calculatePrice())}</p>
                <button className="btn add-to-cart" onClick={handleAddToCart}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
} 