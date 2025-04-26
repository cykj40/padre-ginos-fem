import { NextResponse } from 'next/server';

export async function GET() {
    // Normally this would be fetched from a database
    // For demo purposes, we'll return a static list
    const pizzas = [
        {
            id: 'p1',
            name: 'Margherita',
            description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil.',
            price: 10.99,
            image: '/assets/pizzas/napolitana.webp',
            ingredients: ['Tomato sauce', 'Mozzarella', 'Fresh basil', 'Olive oil'],
            vegetarian: true,
            spicy: false
        },
        {
            id: 'p2',
            name: 'Pepperoni',
            description: 'Traditional pizza topped with tomato sauce, mozzarella, and pepperoni slices.',
            price: 12.99,
            image: '/assets/pizzas/pepperoni.webp',
            ingredients: ['Tomato sauce', 'Mozzarella', 'Pepperoni'],
            vegetarian: false,
            spicy: false
        },
        {
            id: 'p3',
            name: 'Quattro Formaggi',
            description: 'Rich and creamy pizza with four different types of cheese.',
            price: 14.99,
            image: '/assets/pizzas/greek.webp',
            ingredients: ['Tomato sauce', 'Mozzarella', 'Gorgonzola', 'Parmesan', 'Ricotta'],
            vegetarian: true,
            spicy: false
        },
        {
            id: 'p4',
            name: 'Diavola',
            description: 'Spicy pizza with hot salami, chili peppers, and mozzarella.',
            price: 13.99,
            image: '/assets/pizzas/mexican.webp',
            ingredients: ['Tomato sauce', 'Mozzarella', 'Spicy salami', 'Chili peppers'],
            vegetarian: false,
            spicy: true
        },
        {
            id: 'p5',
            name: 'Vegetariana',
            description: 'Healthy pizza loaded with a variety of fresh vegetables.',
            price: 11.99,
            image: '/assets/pizzas/veggie.webp',
            ingredients: ['Tomato sauce', 'Mozzarella', 'Bell peppers', 'Mushrooms', 'Zucchini', 'Eggplant', 'Olives'],
            vegetarian: true,
            spicy: false
        },
        {
            id: 'p6',
            name: 'Prosciutto e Funghi',
            description: 'Classic combination of ham and mushrooms on a tomato and cheese base.',
            price: 13.99,
            image: '/assets/pizzas/mediterraneo.webp',
            ingredients: ['Tomato sauce', 'Mozzarella', 'Ham', 'Mushrooms'],
            vegetarian: false,
            spicy: false
        }
    ];

    return NextResponse.json(pizzas);
} 