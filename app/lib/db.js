import { createClient } from '@libsql/client';

// Initialize database client
const client = createClient({
    // Use URL from environment variable in production
    // or use a local file for development
    url: process.env.TURSO_DATABASE_URL || 'file:./pizza.db',
    authToken: process.env.TURSO_AUTH_TOKEN
});

// Cart-related database functions
export async function getCart(cartId) {
    if (!cartId) throw new Error('Cart ID is required');

    try {
        // Get cart
        const cartResult = await client.execute({
            sql: 'SELECT * FROM carts WHERE id = ?',
            args: [cartId]
        });

        // Create cart if it doesn't exist
        if (cartResult.rows.length === 0) {
            await client.execute({
                sql: 'INSERT INTO carts (id, created_at) VALUES (?, datetime("now"))',
                args: [cartId]
            });
        }

        // Get cart items
        const itemsResult = await client.execute({
            sql: `SELECT * FROM cart_items WHERE cart_id = ?`,
            args: [cartId]
        });

        return {
            id: cartId,
            items: itemsResult.rows.map(item => ({
                id: item.id,
                pizzaId: item.pizza_id,
                name: item.name,
                size: item.size,
                quantity: item.quantity,
                crust: item.crust,
                price: item.price,
                toppings: item.toppings ? JSON.parse(item.toppings) : []
            }))
        };
    } catch (error) {
        console.error('Error getting cart:', error);
        throw error;
    }
}

export async function addToCart(cartId, item) {
    if (!cartId) throw new Error('Cart ID is required');
    if (!item?.pizzaId || !item?.name || !item?.size || !item?.quantity) {
        throw new Error('Invalid item data');
    }

    try {
        // Ensure cart exists
        await getCart(cartId);

        // Add item to cart
        const result = await client.execute({
            sql: `INSERT INTO cart_items 
            (cart_id, pizza_id, name, size, quantity, crust, price, toppings) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                cartId,
                item.pizzaId,
                item.name,
                item.size,
                item.quantity,
                item.crust || 'regular',
                item.price || 0,
                JSON.stringify(item.toppings || [])
            ]
        });

        // Return updated cart
        return getCart(cartId);
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
}

export async function removeFromCart(itemId) {
    if (!itemId) throw new Error('Item ID is required');

    try {
        // Get cart ID for this item
        const cartResult = await client.execute({
            sql: 'SELECT cart_id FROM cart_items WHERE id = ?',
            args: [itemId]
        });

        if (cartResult.rows.length === 0) {
            throw new Error('Item not found');
        }

        const cartId = cartResult.rows[0].cart_id;

        // Remove item
        await client.execute({
            sql: 'DELETE FROM cart_items WHERE id = ?',
            args: [itemId]
        });

        return { success: true, cartId };
    } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
    }
}

export async function updateCartItem(itemId, updates) {
    if (!itemId) throw new Error('Item ID is required');
    if (!updates || Object.keys(updates).length === 0) {
        throw new Error('No updates provided');
    }

    try {
        // Get cart ID for this item
        const cartResult = await client.execute({
            sql: 'SELECT cart_id FROM cart_items WHERE id = ?',
            args: [itemId]
        });

        if (cartResult.rows.length === 0) {
            throw new Error('Item not found');
        }

        const cartId = cartResult.rows[0].cart_id;

        // Build update SQL
        const updateFields = [];
        const updateValues = [];

        if (updates.quantity !== undefined) {
            updateFields.push('quantity = ?');
            updateValues.push(updates.quantity);
        }

        if (updates.size !== undefined) {
            updateFields.push('size = ?');
            updateValues.push(updates.size);
        }

        if (updates.crust !== undefined) {
            updateFields.push('crust = ?');
            updateValues.push(updates.crust);
        }

        if (updates.price !== undefined) {
            updateFields.push('price = ?');
            updateValues.push(updates.price);
        }

        if (updates.toppings !== undefined) {
            updateFields.push('toppings = ?');
            updateValues.push(JSON.stringify(updates.toppings));
        }

        if (updateFields.length === 0) {
            throw new Error('No valid updates provided');
        }

        // Add item ID to values
        updateValues.push(itemId);

        // Update item
        await client.execute({
            sql: `UPDATE cart_items SET ${updateFields.join(', ')} WHERE id = ?`,
            args: updateValues
        });

        return { success: true, cartId };
    } catch (error) {
        console.error('Error updating cart item:', error);
        throw error;
    }
}

export async function clearCart(cartId) {
    if (!cartId) throw new Error('Cart ID is required');

    try {
        // Delete all items for this cart
        const result = await client.execute({
            sql: 'DELETE FROM cart_items WHERE cart_id = ?',
            args: [cartId]
        });

        return {
            success: true,
            itemsRemoved: result.rowsAffected
        };
    } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
    }
}

export async function initializeDatabase() {
    try {
        // Create carts table
        await client.execute(`
      CREATE TABLE IF NOT EXISTS carts (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL
      )
    `);

        // Create cart_items table
        await client.execute(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cart_id TEXT NOT NULL,
        pizza_id TEXT NOT NULL,
        name TEXT NOT NULL,
        size TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        crust TEXT NOT NULL,
        price REAL NOT NULL,
        toppings TEXT,
        FOREIGN KEY (cart_id) REFERENCES carts(id)
      )
    `);

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

export default client; 