import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
    return (
        <div className="home">
            <section className="hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>Welcome to Papa Giorgio's</h1>
                    <p>Authentic Italian Pizza</p>
                    <Link href="/menu" className="cta-button">
                        View Our Menu
                    </Link>
                </div>
            </section>

            <section className="features">
                <div className="feature fresh-ingredients">
                    <h2>Fresh Ingredients</h2>
                    <p>We use only the finest, freshest ingredients in all our pizzas.</p>
                </div>
                <div className="feature hand-tossed">
                    <h2>Hand-Tossed Dough</h2>
                    <p>Our dough is made fresh daily and hand-tossed to perfection.</p>
                </div>
                <div className="feature family-owned">
                    <h2>Family Owned</h2>
                    <p>Family owned and operated since 1985.</p>
                </div>
            </section>

            <section className="testimonials">
                <h2>What Our Customers Say</h2>
                <div className="testimonial">
                    <p>"The best pizza I've ever had! The crust is perfect and the toppings are always fresh."</p>
                    <cite>- John D.</cite>
                </div>
                <div className="testimonial">
                    <p>"Papa Giorgio's is our go-to spot for family pizza night. The kids love it!"</p>
                    <cite>- Sarah M.</cite>
                </div>
            </section>

            <section className="ready-to-order">
                <div className="ready-to-order-content">
                    <h2>Ready to Order?</h2>
                    <div className="checkered-pattern"></div>
                    <Link href="/menu" className="order-button">
                        Order Now
                    </Link>
                </div>
            </section>
        </div>
    );
} 