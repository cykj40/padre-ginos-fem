import { NextResponse } from 'next/server';

export async function GET() {
    // Normally this would be fetched from a database
    // For demo purposes, we'll just return a static pizza
    const pizzaOfTheDay = {
        id: 'potd1',
        name: 'Special of the Day: Margherita Supreme',
        description: 'Our classic Margherita pizza elevated with premium buffalo mozzarella, fresh basil from our garden, vine-ripened tomatoes, and a drizzle of extra virgin olive oil. A taste of Naples with every bite!',
        price: 13.99,
        image: '/assets/pizza-margherita.jpg',
        ingredients: ['Premium buffalo mozzarella', 'Fresh basil', 'Vine-ripened tomatoes', 'Extra virgin olive oil', 'Sea salt'],
        vegetarian: true,
        spicy: false
    };

    return NextResponse.json(pizzaOfTheDay);
} 