import { NextResponse } from 'next/server';

// In a real app, this would be a database connection
// For demo purposes, we'll use a simple in-memory array
let orders = [
    {
        id: 'ord-' + Date.now(),
        customerInfo: {
            name: 'John Doe',
            address: '123 Main St, Anytown, USA',
            phone: '555-123-4567',
            email: 'john@example.com',
            paymentMethod: 'credit'
        },
        items: [
            {
                id: 12345,
                pizza: {
                    id: 'p2',
                    name: 'Pepperoni',
                    price: 12.99
                },
                size: 'large',
                crust: 'regular',
                toppings: ['Extra cheese'],
                quantity: 2,
                price: 33.98
            }
        ],
        total: '33.98',
        date: new Date(Date.now() - 86400000).toISOString(), // yesterday
        status: 'Delivered'
    }
];

export async function GET() {
    return NextResponse.json(orders);
}

export async function POST(request) {
    try {
        const orderData = await request.json();

        // Validate order data (simplified version)
        if (!orderData.customerInfo || !orderData.items || orderData.items.length === 0) {
            return NextResponse.json(
                { error: 'Invalid order data' },
                { status: 400 }
            );
        }

        // Create order with unique ID
        const newOrder = {
            ...orderData,
            id: 'ord-' + Date.now(),
            date: new Date().toISOString(),
            status: 'Processing'
        };

        // Add to "database"
        orders.unshift(newOrder);

        // Keep only last 10 orders for demo purposes
        if (orders.length > 10) {
            orders = orders.slice(0, 10);
        }

        return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
} 