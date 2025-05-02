import { NextResponse } from 'next/server';
import { pizzas } from '../../data/pizzas';

export async function GET() {
    try {
        return NextResponse.json(pizzas);
    } catch (error) {
        console.error('Error fetching menu:', error);
        return NextResponse.json(
            { error: 'Failed to fetch menu' },
            { status: 500 }
        );
    }
} 