import { AsyncDatabase } from "promised-sqlite3";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDb() {
    const db = await AsyncDatabase.open("./pizza.sqlite");
    const schema = await fs.readFile(path.join(__dirname, "schema.sql"), "utf-8");

    await db.exec(schema);

    // Insert sample data
    const sampleData = [
        // Pizza Types
        `INSERT INTO pizza_types(pizza_type_id, name, category, ingredients) VALUES
    ('margherita', 'Margherita', 'Classic', 'Fresh tomatoes, mozzarella, basil'),
    ('pepperoni', 'Pepperoni', 'Classic', 'Pepperoni, mozzarella, tomato sauce'),
    ('veggie', 'Vegetarian', 'Specialty', 'Mushrooms, bell peppers, onions, olives')`,

        // Pizzas with sizes and prices
        `INSERT INTO pizzas(pizza_id, pizza_type_id, size, price) VALUES
    ('margherita_s', 'margherita', 'S', 10.99),
    ('margherita_m', 'margherita', 'M', 12.99),
    ('margherita_l', 'margherita', 'L', 14.99),
    ('pepperoni_s', 'pepperoni', 'S', 11.99),
    ('pepperoni_m', 'pepperoni', 'M', 13.99),
    ('pepperoni_l', 'pepperoni', 'L', 15.99),
    ('veggie_s', 'veggie', 'S', 11.99),
    ('veggie_m', 'veggie', 'M', 13.99),
    ('veggie_l', 'veggie', 'L', 15.99)`
    ];

    for (const query of sampleData) {
        try {
            await db.run(query);
        } catch (err) {
            if (!err.message.includes('UNIQUE constraint failed')) {
                throw err;
            }
        }
    }

    await db.close();
    console.log("Database initialized successfully!");
}

initDb().catch(console.error);

