// SQLite implementation using better-sqlite3
import 'server-only';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Create data directory if it doesn't exist
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize SQLite database
const DB_PATH = path.join(DATA_DIR, 'pizza.db');
const db = new Database(DB_PATH);

// Initialize database tables
export async function initializeDatabase() {
    try {
        // Create carts table
        db.exec(`
            CREATE TABLE IF NOT EXISTS carts (
                id TEXT PRIMARY KEY,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create cart_items table
        db.exec(`
            CREATE TABLE IF NOT EXISTS cart_items (
                id TEXT PRIMARY KEY,
                cart_id TEXT,
                pizza_id TEXT,
                name TEXT,
                size TEXT,
                crust TEXT,
                quantity INTEGER,
                toppings TEXT,
                price REAL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (cart_id) REFERENCES carts(id)
            )
        `);

        console.log('SQLite database initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing SQLite database:', error);
        throw error;
    }
}

// Cart functions
export async function getCart(cartId) {
    try {
        // Check if cart exists
        const cart = db.prepare('SELECT * FROM carts WHERE id = ?').get(cartId);

        if (!cart) {
            // Create new cart if it doesn't exist
            db.prepare('INSERT INTO carts (id) VALUES (?)').run(cartId);
        }

        // Get cart items
        const items = db.prepare('SELECT * FROM cart_items WHERE cart_id = ?').all(cartId);

        // Map and parse items
        const mappedItems = items.map(row => ({
            id: row.id,
            pizzaId: row.pizza_id,
            name: row.name,
            size: row.size,
            crust: row.crust,
            quantity: row.quantity,
            toppings: row.toppings ? JSON.parse(row.toppings) : [],
            price: row.price
        }));

        // Calculate total
        const total = mappedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        return {
            id: cartId,
            items: mappedItems,
            total
        };
    } catch (error) {
        console.error('Error getting cart:', error);
        throw error;
    }
}

export async function addToCart(cartId, item) {
    try {
        const itemId = `item_${Date.now()}`;

        // Insert item into cart
        db.prepare(`
            INSERT INTO cart_items 
            (id, cart_id, pizza_id, name, size, crust, quantity, toppings, price)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            itemId,
            cartId,
            item.pizzaId,
            item.name,
            item.size,
            item.crust,
            item.quantity,
            JSON.stringify(item.toppings || []),
            item.price
        );

        return await getCart(cartId);
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
}

export async function updateCart(cartId, itemId, updates) {
    try {
        // Update item in cart
        db.prepare(`
            UPDATE cart_items 
            SET quantity = ?, price = ?
            WHERE id = ? AND cart_id = ?
        `).run(
            updates.quantity,
            updates.price,
            itemId,
            cartId
        );

        return await getCart(cartId);
    } catch (error) {
        console.error('Error updating cart:', error);
        throw error;
    }
}

export async function removeFromCart(cartId, itemId) {
    try {
        console.log(`DB: Removing item ${itemId} from cart ${cartId}`);

        // Check if item exists before deleting
        const item = db.prepare('SELECT * FROM cart_items WHERE id = ? AND cart_id = ?').get(itemId, cartId);

        if (!item) {
            console.log(`DB: Item ${itemId} not found in cart ${cartId}`);
            // Return the current cart state if item not found
            return await getCart(cartId);
        }

        // Delete item from cart
        const result = db.prepare('DELETE FROM cart_items WHERE id = ? AND cart_id = ?').run(itemId, cartId);
        console.log(`DB: Delete result:`, result);

        // Return updated cart
        return await getCart(cartId);
    } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
    }
}

export async function clearCart(cartId) {
    try {
        // Delete all items from cart
        db.prepare('DELETE FROM cart_items WHERE cart_id = ?').run(cartId);

        return await getCart(cartId);
    } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
    }
}

// Initialize the database right away
initializeDatabase().catch(console.error);

export default db; 