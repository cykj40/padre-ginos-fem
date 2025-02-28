import { useContext } from 'react';
import { CartContext } from './contexts';

const intl = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export default function Cart({cart}) {
    const [, setCart] = useContext(CartContext);
    console.log("Cart component received cart:", cart);
    
    // Calculate total price
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        try {
            const current = cart[i];
            if (current && current.pizza && current.pizza.sizes && current.size) {
                const price = current.pizza.sizes[current.size];
                if (typeof price === 'number') {
                    total += price;
                } else {
                    console.warn("Invalid price for item:", current);
                }
            } else {
                console.warn("Invalid cart item structure:", current);
            }
        } catch (error) {
            console.error("Error processing cart item:", error);
        }
    }
    
    // Function to remove an item from the cart
    const removeFromCart = (index) => {
        try {
            const newCart = [...cart];
            newCart.splice(index, 1);
            setCart(newCart);
            
            const removeMsg = document.createElement('div');
            removeMsg.textContent = 'Item removed from cart';
            removeMsg.style.position = 'fixed';
            removeMsg.style.bottom = '20px';
            removeMsg.style.right = '20px';
            removeMsg.style.backgroundColor = '#e74c3c';
            removeMsg.style.color = 'white';
            removeMsg.style.padding = '10px 20px';
            removeMsg.style.borderRadius = '4px';
            removeMsg.style.zIndex = '1000';
            removeMsg.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
            document.body.appendChild(removeMsg);
            
            setTimeout(() => {
                if (document.body.contains(removeMsg)) {
                    document.body.removeChild(removeMsg);
                }
            }, 2000);
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };
    
    if (!cart || cart.length === 0) {
        return (
            <div className="cart">
                <h2>Cart</h2>
                <p>Your cart is empty. Add some pizzas!</p>
            </div>
        );
    }
    
    return (
        <div className="cart">
            <h2>Cart</h2>
            <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: '15px 0',
                maxHeight: '300px',
                overflowY: 'auto'
            }}>
                {cart.map((item, index) => {
                    try {
                        if (!item || !item.pizza || !item.size) {
                            console.warn("Invalid cart item:", item);
                            return null;
                        }
                        
                        const price = item.pizza.sizes ? item.pizza.sizes[item.size] : null;
                        const formattedPrice = price ? intl.format(price) : "Price unavailable";
                        
                        return (
                            <li key={index} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px',
                                margin: '5px 0',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '4px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}>
                                <div>
                                    <span className="size" style={{ fontWeight: 'bold' }}>{item.size}</span> - 
                                    <span className="type" style={{ marginLeft: '5px' }}>{item.pizza.name}</span> - 
                                    <span className="price" style={{ color: '#e74c3c', marginLeft: '5px' }}>{formattedPrice}</span>
                                </div>
                                <button 
                                    onClick={() => removeFromCart(index)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#e74c3c',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        padding: '5px'
                                    }}
                                >
                                    ✕
                                </button>
                            </li>
                        );
                    } catch (error) {
                        console.error("Error rendering cart item:", error);
                        return null;
                    }
                })}
            </ul>
            <p style={{ 
                fontWeight: 'bold', 
                fontSize: '18px',
                borderTop: '1px solid #ddd',
                paddingTop: '10px',
                marginTop: '10px'
            }}>
                Total: {intl.format(total)}
            </p>
        </div>
    );
}
