import { NextResponse } from 'next/server';
import { getAllPizzas } from '../../data/pizzas';
import { config } from '../../api-config';

// Export the API config
export { config };

export async function GET(request) {
    // Check for query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let pizzas = getAllPizzas();

    // Filter by type if provided
    if (type === 'vegetarian') {
        pizzas = pizzas.filter(pizza => pizza.vegetarian);
    } else if (type === 'spicy') {
        pizzas = pizzas.filter(pizza => pizza.spicy);
    } else if (type === 'popular') {
        pizzas = pizzas.filter(pizza => pizza.popular);
    }

    // Add a small delay to simulate network latency (optional)
    // await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json(pizzas);
} 