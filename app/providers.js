'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CartProvider } from './contexts'

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