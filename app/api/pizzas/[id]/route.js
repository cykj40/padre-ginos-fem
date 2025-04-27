import { NextResponse } from 'next/server';
import { getPizzaById, getAllPizzas } from '../../../data/pizzas';
import { config, shouldIncludeApiRoutes } from '../../../api-config';

// Export the API config
export { config };

// This tells Next.js to prerender these routes during static export
export async function generateStaticParams() {
    const pizzas = getAllPizzas();
    return pizzas.map(pizza => ({
        id: pizza.id
    }));
}

// API handler for each static path generated above
export async function GET(request, { params }) {
    // If we're in a static build, return a simplified response
    if (!shouldIncludeApiRoutes()) {
        const pizza = getPizzaById(params.id);
        return NextResponse.json(pizza || { error: 'Pizza not found' });
    }

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