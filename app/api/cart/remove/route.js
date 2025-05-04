import { NextResponse } from 'next/server';
import { removeFromCart } from '../../../lib/db';

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const itemId = searchParams.get('itemId');
        const cartId = searchParams.get('cartId');

        console.log('Remove cart params:', { cartId, itemId });

        if (!itemId) {
            return NextResponse.json(
                { error: 'Valid item ID is required' },
                { status: 400 }
            );
        }

        if (!cartId) {
            return NextResponse.json(
                { error: 'Valid cart ID is required' },
                { status: 400 }
            );
        }

        console.log(`Removing item ${itemId} from cart ${cartId}`);
        const result = await removeFromCart(cartId, itemId);
        console.log('Remove result:', result);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error removing from cart:', error);
        return NextResponse.json(
            { error: 'Failed to remove item', message: error.message },
            { status: 500 }
        );
    }
}