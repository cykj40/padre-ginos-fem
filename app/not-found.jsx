'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="error-container">
      <h1>404 - Page Not Found</h1>
      <p>Oops! We couldn't find the page you're looking for.</p>
      <p>Maybe you'd like to try one of these instead:</p>
      <div className="links">
        <Link href="/" className="link-btn">
          Home
        </Link>
        <Link href="/menu" className="link-btn">
          Our Menu
        </Link>
        <Link href="/contact" className="link-btn">
          Contact Us
        </Link>
      </div>
      
      <style jsx>{`
        .error-container {
          max-width: 600px;
          margin: 5rem auto;
          text-align: center;
          padding: 2rem;
        }
        
        h1 {
          color: #e63946;
          margin-bottom: 1rem;
        }
        
        p {
          margin-bottom: 1.5rem;
          color: #555;
        }
        
        .links {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .link-btn {
          display: inline-block;
          padding: 0.8rem 1.5rem;
          background-color: #e63946;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
          transition: background-color 0.2s;
        }
        
        .link-btn:hover {
          background-color: #d62f3c;
        }
      `}</style>
    </div>
  );
} 