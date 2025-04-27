import { NextResponse } from 'next/server';
import { getAllPizzas } from '../../data/pizzas';

export async function GET() {
    // Get all pizzas
    const allPizzas = getAllPizzas();

    // Pick a random pizza or a featured one
    // For deterministic results, you could also implement a daily rotation
    const today = new Date();
    const dayOfMonth = today.getDate();

    // Use the day of month to pick a pizza (ensures the same pizza for the whole day)
    const pizzaIndex = dayOfMonth % allPizzas.length;
    const basePizza = allPizzas[pizzaIndex];

    // Create a special version of the selected pizza
    const pizzaOfTheDay = {
        ...basePizza,
        id: `potd-${basePizza.id}`,
        name: `Special of the Day: ${basePizza.name} Supreme`,
        description: `Our ${basePizza.name} pizza with premium ingredients and a special chef's touch. Only available today!`,
        price: parseFloat((basePizza.price * 0.85).toFixed(2)), // 15% discount
        special: true,
        featuredToday: true
    };

    return NextResponse.json(pizzaOfTheDay);
} 