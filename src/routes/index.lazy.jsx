import { createLazyFileRoute, Link } from "@tanstack/react-router";
import PizzaOfTheDay from "../PizzaOfTheDay";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="index">
      <div className="index-brand">
        <h1>Padre Gino's</h1>
        <p>Pizza & Art at a location near you</p>
      </div>
      
      <ul>
        <li>
          <Link to="/order">Order</Link>
        </li>
        <li>
          <Link to="/past">Past Orders</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
      
      <footer className="index-footer" style={{ 
        marginTop: '2rem', 
        padding: '1rem',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        maxWidth: '800px',
        margin: '2rem auto 0'
      }}>
        <PizzaOfTheDay />
      </footer>
    </div>
  );
}
