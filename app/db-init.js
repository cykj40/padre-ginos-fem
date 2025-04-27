import { initializeDatabase } from './lib/db';

// Initialize database on app startup
export async function initDb() {
    try {
        await initializeDatabase();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Failed to initialize database:', error);
    }
} 