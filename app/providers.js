'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CartProvider } from './contexts/CartContext'

// We'll use Next.js lifecycle hooks in the actual API routes
// for database initialization, rather than in the client component

export default function Providers({ children }) {
    // Create QueryClient inside the component to avoid serialization issues
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
            },
        },
    }))

    return (
        <QueryClientProvider client={queryClient}>
            <CartProvider>
                {children}
            </CartProvider>
        </QueryClientProvider>
    )
} 