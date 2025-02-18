import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";
import cors from "@fastify/cors";
import client from './db.js';

// Pizza image filename mapping
const PIZZA_IMAGE_NAMES = {
    1: 'big-meat',
    2: 'greek',
    3: 'hawaiian',
    4: 'mediterraneo',
    5: 'mexican',
    6: 'napolitana',
    7: 'pepperoni',
    8: 'sicilian',
    9: 'spinach',
    10: 'thai',
    11: 'veggie'
};

const server = fastify({
    logger: {
        level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
        transport: process.env.NODE_ENV === 'production'
            ? undefined
            : {
                target: "pino-pretty",
            },
    },
    trustProxy: true,
    ajv: {
        customOptions: {
            removeAdditional: 'all',
            coerceTypes: true,
            useDefaults: true,
        }
    }
});

// Register CORS
server.register(cors, {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rate limiting for static files
server.register(fastifyStatic, {
    root: path.join(__dirname, "public"),
    prefix: "/public/",
    maxAge: process.env.NODE_ENV === 'production' ? 86400000 : 0, // 1 day cache in production
    decorateReply: false // Important for Vercel deployment
});

// Input validation schema for order
const orderSchema = {
    body: {
        type: 'object',
        required: ['cart'],
        properties: {
            cart: {
                type: 'array',
                minItems: 1,
                items: {
                    type: 'object',
                    required: ['pizza', 'size'],
                    properties: {
                        pizza: {
                            type: 'object',
                            required: ['id'],
                            properties: {
                                id: { type: 'number' }
                            }
                        },
                        size: { type: 'string' }
                    }
                }
            }
        }
    }
};

// Health check endpoint
server.get("/health", async (req, res) => {
    try {
        await client.execute("SELECT 1");
        return { status: "healthy" };
    } catch (err) {
        res.status(500).send({ status: "unhealthy", message: err.message });
    }
});

server.get("/api/pizzas", async function getPizzas(req, res) {
    try {
        const pizzasResult = await client.execute(
            "SELECT pizza_type_id, name, category, ingredients as description FROM pizza_types"
        );
        const pizzaSizesResult = await client.execute(
            `SELECT pizza_type_id as id, size, price FROM pizzas`
        );

        const pizzas = pizzasResult.rows;
        const pizzaSizes = pizzaSizesResult.rows;

        const responsePizzas = pizzas.map((pizza) => {
            const sizes = pizzaSizes.reduce((acc, current) => {
                if (current.id === pizza.pizza_type_id) {
                    acc[current.size] = +current.price;
                }
                return acc;
            }, {});
            return {
                id: pizza.pizza_type_id,
                name: pizza.name,
                category: pizza.category,
                description: pizza.description,
                image: `/public/pizzas/${PIZZA_IMAGE_NAMES[pizza.pizza_type_id]}.webp`,
                sizes,
            };
        });

        res.send(responsePizzas);
    } catch (error) {
        req.log.error(error);
        res.status(500).send({ error: "Failed to fetch pizzas" });
    }
});

server.get("/api/pizza-of-the-day", async function getPizzaOfTheDay(req, res) {
    const pizzasResult = await client.execute(
        `SELECT 
      pizza_type_id as id, name, category, ingredients as description
    FROM 
      pizza_types`
    );

    const pizzas = pizzasResult.rows;

    const daysSinceEpoch = Math.floor(Date.now() / 86400000);
    const pizzaIndex = daysSinceEpoch % pizzas.length;
    const pizza = pizzas[pizzaIndex];

    const pizzaSizesResult = await client.execute(
        `SELECT
      size, price
    FROM
      pizzas
    WHERE
      pizza_type_id = ?`,
        [pizza.id]
    );

    const pizzaSizes = pizzaSizesResult.rows;

    const sizeObj = pizzaSizes.reduce((acc, current) => {
        acc[current.size] = +current.price;
        return acc;
    }, {});

    const responsePizza = {
        id: pizza.id,
        name: pizza.name,
        category: pizza.category,
        description: pizza.description,
        image: `/public/pizzas/${PIZZA_IMAGE_NAMES[pizza.id]}.webp`,
        sizes: sizeObj,
    };

    res.send(responsePizza);
});

server.get("/api/orders", async function getOrders(req, res) {
    const ordersResult = await client.execute("SELECT order_id, date, time FROM orders");

    const orders = ordersResult.rows;

    res.send(orders);
});

server.get("/api/order", async function getOrders(req, res) {
    const id = req.query.id;
    const orderResult = await client.execute(
        "SELECT order_id, date, time FROM orders WHERE order_id = ?",
        [id]
    );
    const orderItemsResult = await client.execute(
        `SELECT 
      t.pizza_type_id as pizzaTypeId, t.name, t.category, t.ingredients as description, o.quantity, p.price, o.quantity * p.price as total, p.size
    FROM 
      order_details o
    JOIN
      pizzas p
    ON
      o.pizza_id = p.pizza_id
    JOIN
      pizza_types t
    ON
      p.pizza_type_id = t.pizza_type_id
    WHERE 
      order_id = ?`,
        [id]
    );

    const [order, orderItemsRes] = await Promise.all([
        orderResult,
        orderItemsResult,
    ]);

    const orderItems = orderItemsRes.rows.map((item) =>
        Object.assign({}, item, {
            image: `/public/pizzas/${item.pizzaTypeId}.webp`,
            quantity: +item.quantity,
            price: +item.price,
        })
    );

    const total = orderItems.reduce((acc, item) => acc + item.total, 0);

    res.send({
        order: Object.assign({ total }, order),
        orderItems,
    });
});

server.post("/api/order", {
    schema: orderSchema,
    handler: async function createOrder(req, res) {
        const { cart } = req.body;

        const now = new Date();
        const time = now.toLocaleTimeString("en-US", { hour12: false });
        const date = now.toISOString().split("T")[0];

        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            res.status(400).send({ error: "Invalid order data" });
            return;
        }

        try {
            await client.execute("BEGIN TRANSACTION");

            const result = await client.execute(
                "INSERT INTO orders (date, time) VALUES (?, ?)",
                [date, time]
            );
            const orderId = result.lastID;

            const mergedCart = cart.reduce((acc, item) => {
                const id = item.pizza.id;
                const size = item.size.toLowerCase();
                if (!id || !size) {
                    throw new Error("Invalid item data");
                }
                const pizzaId = `${id}_${size}`;

                if (!acc[pizzaId]) {
                    acc[pizzaId] = { pizzaId, quantity: 1 };
                } else {
                    acc[pizzaId].quantity += 1;
                }

                return acc;
            }, {});

            for (const item of Object.values(mergedCart)) {
                const { pizzaId, quantity } = item;
                await client.execute(
                    "INSERT INTO order_details (order_id, pizza_id, quantity) VALUES (?, ?, ?)",
                    [orderId, pizzaId, quantity]
                );
            }

            await client.execute("COMMIT");

            res.send({ orderId });
        } catch (error) {
            req.log.error(error);
            await client.execute("ROLLBACK");
            res.status(500).send({ error: "Failed to create order" });
        }
    }
});

server.get("/api/past-orders", async function getPastOrders(req, res) {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;
        const pastOrdersResult = await client.execute(
            "SELECT order_id, date, time FROM orders ORDER BY order_id DESC LIMIT ? OFFSET ?",
            [limit, offset]
        );
        const pastOrders = pastOrdersResult.rows;
        res.send(pastOrders);
    } catch (error) {
        req.log.error(error);
        res.status(500).send({ error: "Failed to fetch past orders" });
    }
});

server.get("/api/past-order/:order_id", async function getPastOrder(req, res) {
    const orderId = req.params.order_id;

    try {
        const orderResult = await client.execute(
            "SELECT order_id, date, time FROM orders WHERE order_id = ?",
            [orderId]
        );

        const order = orderResult.rows[0];

        if (!order) {
            res.status(404).send({ error: "Order not found" });
            return;
        }

        const orderItemsResult = await client.execute(
            `SELECT 
        t.pizza_type_id as pizzaTypeId, t.name, t.category, t.ingredients as description, o.quantity, p.price, o.quantity * p.price as total, p.size
      FROM 
        order_details o
      JOIN
        pizzas p
      ON
        o.pizza_id = p.pizza_id
      JOIN
        pizza_types t
      ON
        p.pizza_type_id = t.pizza_type_id
      WHERE 
        order_id = ?`,
            [orderId]
        );

        const orderItems = orderItemsResult.rows.map((item) =>
            Object.assign({}, item, {
                image: `/public/pizzas/${item.pizzaTypeId}.webp`,
                quantity: +item.quantity,
                price: +item.price,
            })
        );

        const total = orderItems.reduce(
            (acc, item) => acc + item.total,
            0
        );

        res.send({
            order: Object.assign({ total }, order),
            orderItems: orderItems,
        });
    } catch (error) {
        req.log.error(error);
        res.status(500).send({ error: "Failed to fetch order" });
    }
});

server.post("/api/contact", async function contactForm(req, res) {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        res.status(400).send({ error: "All fields are required" });
        return;
    }

    req.log.info(`Contact Form Submission:
    Name: ${name}
    Email: ${email}
    Message: ${message}
  `);

    res.send({ success: "Message received" });
});

// Error handler
server.setErrorHandler((error, request, reply) => {
    request.log.error(error);
    if (process.env.NODE_ENV === 'production') {
        // Don't send error details in production
        reply.status(500).send({ error: 'Internal Server Error' });
    } else {
        reply.status(500).send({ error: error.message });
    }
});

// Graceful shutdown
const closeGracefully = async (signal) => {
    console.log(`Received signal to terminate: ${signal}`);
    await server.close();
    process.exit(0);
};

process.on('SIGINT', closeGracefully);
process.on('SIGTERM', closeGracefully);

const start = async () => {
    try {
        await server.listen({
            port: PORT,
            host: HOST
        });
        console.log(`Server listening on ${HOST}:${PORT}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();