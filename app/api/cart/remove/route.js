import { NextResponse } from 'next/server';
import { removeFromCart } from '../../../lib/db';

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const itemId = Number(searchParams.get('itemId'));

        if (!itemId || isNaN(itemId)) {
            return NextResponse.json(
                { error: 'Valid item ID is required' },
                { status: 400 }
            );
        }

        const result = await removeFromCart(itemId);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error removing from cart:', error);
        return NextResponse.json(
            { error: 'Failed to remove item', message: error.message },
            { status: 500 }
        );
    }
}