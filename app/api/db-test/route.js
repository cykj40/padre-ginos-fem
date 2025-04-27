import { NextResponse } from 'next/server';
import client, { initializeDatabase } from '../../lib/db';

// Flag to track initialization
let initialized = false;

export async function GET() {
    try {
        // Initialize database if not already done
        if (!initialized) {
            await initializeDatabase();
            initialized = true;
        }

        // Test database connectivity
        const result = await client.execute(`SELECT 1 as test`);

        return NextResponse.json({
            status: 'success',
            message: 'Database connection successful',
            data: result.rows
        });
    } catch (error) {
        console.error('Database connection failed:', error);
        return NextResponse.json(
            {
                status: 'error',
                message: 'Database connection failed',
                error: error.message
            },
            { status: 500 }
        );
    }
} 