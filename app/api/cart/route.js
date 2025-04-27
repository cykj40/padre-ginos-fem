import { NextResponse } from 'next/server';
import { getCart } from '../../lib/db';

// Initialize the database on the first request
import { initializeDatabase } from '../../lib/db';
let initialized = false;

export async function GET(request) {
    // Initialize database if not already done
    if (!initialized) {
        try {
            await initializeDatabase();
            initialized = true;
        } catch (error) {
            console.error('Failed to initialize database:', error);
            return NextResponse.json(
                { error: 'Failed to initialize database' },
                { status: 500 }
            );
        }
    }

    // Get cart ID from query parameters
    const { searchParams } = new URL(request.url);
    const cartId = searchParams.get('cartId');

    if (!cartId) {
        return NextResponse.json(
            { error: 'Cart ID is required' },
            { status: 400 }
        );
    }

    try {
        const cart = await getCart(cartId);

        return NextResponse.json(cart);
    } catch (error) {
        console.error('Error getting cart:', error);
        return NextResponse.json(
            { error: 'Failed to get cart', message: error.message },
            { status: 500 }
        );
    }
}