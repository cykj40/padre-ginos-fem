import { NextResponse } from 'next/server';
import { updateCart } from '../../../lib/db';

export async function PUT(request) {
    try {
        // Get cartId and itemId from query string
        const { searchParams } = new URL(request.url);
        const cartId = searchParams.get('cartId');
        const itemId = searchParams.get('itemId');

        // Get updates from request body
        const updates = await request.json();

        if (!cartId) {
            return NextResponse.json(
                { error: 'Cart ID is required' },
                { status: 400 }
            );
        }

        if (!itemId) {
            return NextResponse.json(
                { error: 'Item ID is required' },
                { status: 400 }
            );
        }

        if (!updates || Object.keys(updates).length === 0) {
            return NextResponse.json(
                { error: 'No updates provided' },
                { status: 400 }
            );
        }

        const result = await updateCart(cartId, itemId, updates);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error updating cart item:', error);
        return NextResponse.json(
            { error: 'Failed to update item', message: error.message },
            { status: 500 }
        );
    }
}