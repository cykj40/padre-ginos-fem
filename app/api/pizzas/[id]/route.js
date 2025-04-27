import { NextResponse } from 'next/server';
import { getPizzaById } from '../../../data/pizzas';

export async function GET(request, { params }) {
    const id = params.id;
    const pizza = getPizzaById(id);

    if (!pizza) {
        return NextResponse.json(
            { error: 'Pizza not found' },
            { status: 404 }
        );
    }

    return NextResponse.json(pizza);
} 