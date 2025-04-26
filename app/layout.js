import { CartProvider } from './contexts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './globals.css'

export const metadata = {
    title: 'Padre Gino\'s Pizza',
    description: 'Delicious pizza delivered to your door',
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
        },
    },
})

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
            </head>
            <body>
                <QueryClientProvider client={queryClient}>
                    <CartProvider>
                        {children}
                    </CartProvider>
                </QueryClientProvider>
                <div id="modal"></div>
            </body>
        </html>
    )
} 