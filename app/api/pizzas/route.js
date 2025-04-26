import { NextResponse } from 'next/server';

// Sample pizza data
const pizzas = [
    {
        id: 'p1',
        name: 'Margherita',
        description: 'Classic pizza with tomato sauce, mozzarella, and basil',
        price: 10.99,
        image: '/assets/pizzas/napolitana.webp',
        ingredients: ['Tomato Sauce', 'Mozzarella', 'Basil', 'Olive Oil'],
        vegetarian: true,
        spicy: false
    },
    {
        id: 'p2',
        name: 'Pepperoni',
        description: 'Traditional pizza topped with pepperoni and cheese',
        price: 12.99,
        image: '/assets/pizzas/pepperoni.webp',
        ingredients: ['Tomato Sauce', 'Mozzarella', 'Pepperoni'],
        vegetarian: false,
        spicy: true
    },
    {
        id: 'p3',
        name: 'Veggie Supreme',
        description: 'Loaded with fresh vegetables and cheese',
        price: 13.99,
        image: '/assets/pizzas/veggie.webp',
        ingredients: ['Tomato Sauce', 'Mozzarella', 'Bell Peppers', 'Olives', 'Mushrooms', 'Onions'],
        vegetarian: true,
        spicy: false
    },
    {
        id: 'p4',
        name: 'Meat Lovers',
        description: 'Hearty pizza loaded with various meats',
        price: 14.99,
        image: '/assets/pizzas/big-meat.webp',
        ingredients: ['Tomato Sauce', 'Mozzarella', 'Pepperoni', 'Sausage', 'Bacon', 'Ham'],
        vegetarian: false,
        spicy: true
    }
];

export async function GET() {
    // Add a small delay to simulate network latency (optional)
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json(pizzas);
} 