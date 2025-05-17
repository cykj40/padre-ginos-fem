// SQLite implementation with in-memory fallback
import 'server-only';
import { getDatabaseConfig } from './db-config';
import path from 'path';
import fs from 'fs';

// Get database configuration
const dbConfig = getDatabaseConfig();
const useInMemoryOnly = dbConfig.useInMemoryOnly;

// In-memory store for environments that don't support SQLite
const inMemoryStore = {
    carts: {},
    cartItems: {}
};

// Only import and initialize SQLite if not in memory-only mode
let db = null;
if (!useInMemoryOnly) {
    try {
        const Database = require('better-sqlite3');

        // Create data directory if it doesn't exist
        const DATA_DIR = path.join(process.cwd(), 'data');
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }

        // Initialize SQLite database
        const DB_PATH = path.join(DATA_DIR, 'pizza.db');
        db = new Database(DB_PATH);

        console.log('SQLite database initialized successfully');
    } catch (error) {
        console.error('Error initializing SQLite database:', error);
        console.log('Falling back to in-memory store');
    }
}

// Initialize database tables if using SQLite
export async function initializeDatabase() {
    if (useInMemoryOnly || !db) {
        console.log('Using in-memory database store');
        return true;
    }

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
    // In-memory fallback
    if (useInMemoryOnly || !db) {
        return getCartInMemory(cartId);
    }

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
        console.error('Error getting cart from SQLite:', error);
        // Fall back to in-memory if SQLite fails
        return getCartInMemory(cartId);
    }
}

// In-memory version of getCart
function getCartInMemory(cartId) {
    if (!inMemoryStore.carts[cartId]) {
        inMemoryStore.carts[cartId] = {
            id: cartId,
            created_at: new Date().toISOString()
        };
    }

    const cartItems = Object.values(inMemoryStore.cartItems || {})
        .filter(item => item.cart_id === cartId)
        .map(item => ({
            id: item.id,
            pizzaId: item.pizza_id,
            name: item.name,
            size: item.size,
            crust: item.crust,
            quantity: item.quantity,
            toppings: item.toppings || [],
            price: item.price
        }));

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return {
        id: cartId,
        items: cartItems,
        total
    };
}

export async function addToCart(cartId, item) {
    // In-memory fallback
    if (useInMemoryOnly || !db) {
        return addToCartInMemory(cartId, item);
    }

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
        console.error('Error adding to cart in SQLite:', error);
        // Fall back to in-memory if SQLite fails
        return addToCartInMemory(cartId, item);
    }
}

// In-memory version of addToCart
function addToCartInMemory(cartId, item) {
    if (!inMemoryStore.carts[cartId]) {
        inMemoryStore.carts[cartId] = {
            id: cartId,
            created_at: new Date().toISOString()
        };
    }

    const itemId = `item_${Date.now()}`;
    inMemoryStore.cartItems[itemId] = {
        id: itemId,
        cart_id: cartId,
        pizza_id: item.pizzaId,
        name: item.name,
        size: item.size,
        crust: item.crust,
        quantity: item.quantity,
        toppings: item.toppings || [],
        price: item.price,
        created_at: new Date().toISOString()
    };

    return getCartInMemory(cartId);
}

// Continue with other functions but add in-memory fallbacks...

export async function updateCart(cartId, itemId, updates) {
    // In-memory fallback
    if (useInMemoryOnly || !db) {
        return updateCartInMemory(cartId, itemId, updates);
    }

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
        console.error('Error updating cart in SQLite:', error);
        // Fall back to in-memory if SQLite fails
        return updateCartInMemory(cartId, itemId, updates);
    }
}

// In-memory version of updateCart
function updateCartInMemory(cartId, itemId, updates) {
    const item = inMemoryStore.cartItems[itemId];
    if (item && item.cart_id === cartId) {
        inMemoryStore.cartItems[itemId] = {
            ...item,
            quantity: updates.quantity,
            price: updates.price
        };
    }

    return getCartInMemory(cartId);
}

export async function removeFromCart(cartId, itemId) {
    // In-memory fallback
    if (useInMemoryOnly || !db) {
        return removeFromCartInMemory(cartId, itemId);
    }

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
        console.error('Error removing from cart in SQLite:', error);
        // Fall back to in-memory if SQLite fails
        return removeFromCartInMemory(cartId, itemId);
    }
}

// In-memory version of removeFromCart
function removeFromCartInMemory(cartId, itemId) {
    const item = inMemoryStore.cartItems[itemId];
    if (item && item.cart_id === cartId) {
        delete inMemoryStore.cartItems[itemId];
    }

    return getCartInMemory(cartId);
}

export async function clearCart(cartId) {
    // In-memory fallback
    if (useInMemoryOnly || !db) {
        return clearCartInMemory(cartId);
    }

    try {
        // Delete all items from cart
        db.prepare('DELETE FROM cart_items WHERE cart_id = ?').run(cartId);

        return await getCart(cartId);
    } catch (error) {
        console.error('Error clearing cart in SQLite:', error);
        // Fall back to in-memory if SQLite fails
        return clearCartInMemory(cartId);
    }
}

// In-memory version of clearCart
function clearCartInMemory(cartId) {
    // Remove all items associated with this cart
    Object.keys(inMemoryStore.cartItems).forEach(itemId => {
        if (inMemoryStore.cartItems[itemId].cart_id === cartId) {
            delete inMemoryStore.cartItems[itemId];
        }
    });

    return getCartInMemory(cartId);
}

// Initialize the database right away if using SQLite
if (!useInMemoryOnly && db) {
    initializeDatabase().catch(console.error);
}

export default db; 