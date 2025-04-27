import { useContext } from 'react';
import { CartContext } from '../app/contexts/CartContext';

const intl = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export default function Cart() {
    const { cart, removeFromCart } = useContext(CartContext);
    const { items = [] } = cart || {};
    
    // Calculate total price - this is now handled in the context
    const total = cart?.total || 0;
    
    if (!items || items.length === 0) {
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
                {items.map((item) => {
                    try {
                        if (!item) {
                            console.warn("Invalid cart item:", item);
                            return null;
                        }
                        
                        const formattedPrice = intl.format(item.price);
                        
                        return (
                            <li key={item.id} style={{
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
                                    <span className="type" style={{ marginLeft: '5px' }}>{item.name}</span> - 
                                    <span className="price" style={{ color: '#e74c3c', marginLeft: '5px' }}>{formattedPrice}</span>
                                    {item.quantity > 1 && (
                                        <span className="quantity" style={{ marginLeft: '5px' }}>x{item.quantity}</span>
                                    )}
                                </div>
                                <button 
                                    onClick={() => removeFromCart(item.id)}
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
