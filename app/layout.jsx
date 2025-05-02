import './globals.css';
import { Inter } from 'next/font/google';
import Header from './components/Header';
import Footer from './components/Footer';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Papa Giorgio\'s Pizza',
    description: 'Authentic Italian Pizza',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <div className="app">
                        <Header />
                        <main>{children}</main>
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
} 