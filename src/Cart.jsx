const intl = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export default function Cart({cart, checkout}) {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        const current = cart[i];
        total += current.pizza.sizes[current.size]
    }
    
    if (cart.length === 0) {
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
            <ul>
                {cart.map((item, index) => (
                    <li key={index}>
                        <span className="size">{item.size}</span> - 
                        <span className="type">{item.pizza.name}</span> - 
                        <span className="price">{intl.format(item.pizza.sizes[item.size])}</span>
                    </li>
                ))}
            </ul>
            <p>Total: {intl.format(total)}</p>
        </div>
    )
}
