import { NextResponse } from 'next/server';
import { getCart, addToCart, updateCart, removeFromCart, clearCart } from '../../lib/db';

// Initialize the database on the first request
import { initializeDatabase } from '../../lib/db';
let initialized = false;

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const cartId = searchParams.get('cartId');

        if (!cartId) {
            return NextResponse.json(
                { error: 'Cart ID is required' },
                { status: 400 }
            );
        }

        const cart = await getCart(cartId);
        return NextResponse.json(cart);
    } catch (error) {
        console.error('Error getting cart:', error);
        return NextResponse.json(
            { error: 'Failed to get cart' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const { cartId, item } = await request.json();

        if (!cartId || !item) {
            return NextResponse.json(
                { error: 'Cart ID and item are required' },
                { status: 400 }
            );
        }

        const cart = await addToCart(cartId, item);
        return NextResponse.json(cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        return NextResponse.json(
            { error: 'Failed to add to cart' },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const { cartId, itemId, updates } = await request.json();

        if (!cartId || !itemId || !updates) {
            return NextResponse.json(
                { error: 'Cart ID, item ID, and updates are required' },
                { status: 400 }
            );
        }

        const cart = await updateCart(cartId, itemId, updates);
        return NextResponse.json(cart);
    } catch (error) {
        console.error('Error updating cart:', error);
        return NextResponse.json(
            { error: 'Failed to update cart' },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const cartId = searchParams.get('cartId');
        const itemId = searchParams.get('itemId');

        if (!cartId) {
            return NextResponse.json(
                { error: 'Cart ID is required' },
                { status: 400 }
            );
        }

        if (itemId) {
            // Remove specific item
            const cart = await removeFromCart(cartId, itemId);
            return NextResponse.json(cart);
        } else {
            // Clear entire cart
            const cart = await clearCart(cartId);
            return NextResponse.json(cart);
        }
    } catch (error) {
        console.error('Error modifying cart:', error);
        return NextResponse.json(
            { error: 'Failed to modify cart' },
            { status: 500 }
        );
    }
}