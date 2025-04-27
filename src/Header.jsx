import { useContext } from "react";
import { CartContext } from "../app/contexts/CartContext";
import { Link } from "@tanstack/react-router";

export default function Header() {
    const { cart } = useContext(CartContext);
    const itemCount = cart?.items?.length || 0;
    
    return (
        <nav>
            <Link to="/">
                <h1 className="logo">Padre Gino's Pizza</h1>
            </Link>
            <div className="nav-cart">
               🛒 <span className="nav-cart-number">{itemCount}</span>
            </div>
        </nav>
    )
}
