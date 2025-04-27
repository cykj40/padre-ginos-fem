import { NextResponse } from 'next/server';
import { updateCartItem } from '../../../lib/db';

export async function PATCH(request) {
    try {
        const { itemId, updates } = await request.json();

        if (!itemId || isNaN(Number(itemId))) {
            return NextResponse.json(
                { error: 'Valid item ID is required' },
                { status: 400 }
            );
        }

        if (!updates || Object.keys(updates).length === 0) {
            return NextResponse.json(
                { error: 'No updates provided' },
                { status: 400 }
            );
        }

        const result = await updateCartItem(Number(itemId), updates);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error updating cart item:', error);
        return NextResponse.json(
            { error: 'Failed to update item', message: error.message },
            { status: 500 }
        );
    }
}