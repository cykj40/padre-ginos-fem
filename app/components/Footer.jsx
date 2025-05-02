export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Papa Giorgio's</h3>
                        <p>Authentic Italian Pizza</p>
                    </div>
                    <div className="footer-section">
                        <h3>Contact Us</h3>
                        <p>123 Pizza Street</p>
                        <p>New York, NY 10001</p>
                        <p>Phone: (555) 123-4567</p>
                    </div>
                    <div className="footer-section">
                        <h3>Hours</h3>
                        <p>Monday - Friday: 11am - 10pm</p>
                        <p>Saturday - Sunday: 11am - 11pm</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Papa Giorgio's. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
} 