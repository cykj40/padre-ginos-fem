import { NextResponse } from 'next/server';
import { clearCart } from '../../../lib/db';

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const cartId = searchParams.get('cartId');

        if (!cartId) {
            return NextResponse.json(
                { error: 'Cart ID is required' },
                { status: 400 }
            );
        }

        const result = await clearCart(cartId);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error clearing cart:', error);
        return NextResponse.json(
            { error: 'Failed to clear cart', message: error.message },
            { status: 500 }
        );
    }
}