import { NextResponse } from 'next/server';
import { addToCart } from '../../../lib/db';

export async function POST(request) {
    try {
        const { cartId, item } = await request.json();

        if (!cartId) {
            return NextResponse.json(
                { error: 'Cart ID is required' },
                { status: 400 }
            );
        }

        if (!item || !item.pizzaId || !item.name || !item.size || !item.quantity) {
            return NextResponse.json(
                { error: 'Invalid item data', message: 'Item must include pizzaId, name, size, and quantity' },
                { status: 400 }
            );
        }

        const cart = await addToCart(cartId, item);

        return NextResponse.json(cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        return NextResponse.json(
            { error: 'Failed to add item to cart', message: error.message },
            { status: 500 }
        );
    }
}