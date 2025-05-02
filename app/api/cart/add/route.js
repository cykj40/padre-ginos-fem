import { NextResponse } from 'next/server';
import { addToCart } from '../../../lib/db';

export async function POST(request) {
    try {
        // Get cartId from query string
        const { searchParams } = new URL(request.url);
        const cartId = searchParams.get('cartId');

        if (!cartId) {
            return NextResponse.json(
                { error: 'Cart ID is required' },
                { status: 400 }
            );
        }

        // Get item data from request body
        const item = await request.json();

        // Add item to cart
        const updatedCart = await addToCart(cartId, item);

        return NextResponse.json(updatedCart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        return NextResponse.json(
            { error: 'Failed to add to cart' },
            { status: 500 }
        );
    }
}