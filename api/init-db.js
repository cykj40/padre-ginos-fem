import client from './db.js'

async function initDb() {
    try {
        // Drop existing tables
        await client.execute(`DROP TABLE IF EXISTS order_details`);
        await client.execute(`DROP TABLE IF EXISTS orders`);
        await client.execute(`DROP TABLE IF EXISTS pizzas`);
        await client.execute(`DROP TABLE IF EXISTS pizza_types`);

        // Create pizza_types table
        await client.execute(`
            CREATE TABLE pizza_types (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                ingredients TEXT NOT NULL
            )
        `);

        // Create pizzas table
        await client.execute(`
            CREATE TABLE pizzas (
                pizza_id TEXT PRIMARY KEY,
                id TEXT NOT NULL,
                size TEXT NOT NULL,
                price REAL NOT NULL,
                FOREIGN KEY (id) REFERENCES pizza_types(id)
            )
        `);

        // Create orders table
        await client.execute(`
            CREATE TABLE orders (
                order_id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                time TEXT NOT NULL
            )
        `);

        // Create order_details table
        await client.execute(`
            CREATE TABLE order_details (
                order_id INTEGER NOT NULL,
                pizza_id TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(order_id),
                FOREIGN KEY (pizza_id) REFERENCES pizzas(pizza_id),
                PRIMARY KEY (order_id, pizza_id)
            )
        `);

        // Insert pizza types
        const pizzaTypes = [
            ['big-meat', 'Big Meat', 'Specialty', 'Pepperoni, sausage, bacon, ham, mozzarella'],
            ['greek', 'Greek', 'Gourmet', 'Feta, olives, red onions, tomatoes, oregano'],
            ['hawaiian', 'Hawaiian', 'Specialty', 'Ham, pineapple, mozzarella, tomato sauce'],
            ['mexican', 'Mexican', 'Gourmet', 'Ground beef, jalapeños, tomatoes, onions, Mexican spices'],
            ['napolitana', 'Napolitana', 'Classic', 'San Marzano tomatoes, fresh mozzarella, basil, olive oil'],
            ['pepperoni', 'Pepperoni', 'Classic', 'Pepperoni, mozzarella, tomato sauce'],
            ['sicilian', 'Sicilian', 'Classic', 'Thick crust, tomatoes, herbs, onions, anchovies, hard cheeses'],
            ['spinach', 'Spinach', 'Specialty', 'Fresh spinach, feta, garlic, olive oil'],
            ['thai', 'Thai', 'Gourmet', 'Chicken, peanut sauce, bean sprouts, carrots, cilantro'],
            ['veggie', 'Vegetarian', 'Specialty', 'Mushrooms, bell peppers, onions, olives']
        ];

        for (const [id, name, category, ingredients] of pizzaTypes) {
            await client.execute(
                `INSERT INTO pizza_types (id, name, category, ingredients) VALUES (?, ?, ?, ?)`,
                [id, name, category, ingredients]
            );

            // Insert sizes for each pizza type
            const sizes = {
                'S': category === 'Gourmet' ? 12.99 : 11.99,
                'M': category === 'Gourmet' ? 14.99 : 13.99,
                'L': category === 'Gourmet' ? 16.99 : 15.99
            };

            for (const [size, price] of Object.entries(sizes)) {
                await client.execute(
                    `INSERT INTO pizzas (pizza_id, id, size, price) VALUES (?, ?, ?, ?)`,
                    [`${id}_${size.toLowerCase()}`, id, size, price]
                );
            }
        }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initDb()

