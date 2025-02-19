import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";
import cors from "@fastify/cors";
import client from './db.js';

// Allowed origins including Netlify's static IPs
const ALLOWED_ORIGINS = [
    'https://padre-ginos-pizza.netlify.app',
    'http://localhost:5173',
    'http://localhost:3000'
];

// Netlify's static outbound IP addresses
const NETLIFY_IPS = [
    '3.134.238.10',
    '3.129.111.220',
    '52.15.118.168'
];

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
    trustProxy: NETLIFY_IPS, // Trust Netlify's IP addresses
    ajv: {
        customOptions: {
            removeAdditional: 'all',
            coerceTypes: true,
            useDefaults: true,
        }
    }
});

// Register CORS with specific configuration
server.register(cors, {
    origin: (origin, cb) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
            cb(null, true);
            return;
        }

        // Check if origin is in allowed list
        if (ALLOWED_ORIGINS.includes(origin)) {
            cb(null, true);
            return;
        }

        // Allow requests from any Netlify subdomain
        if (origin.match(/^https:\/\/[^/]+\.netlify\.app$/)) {
            cb(null, true);
            return;
        }

        // Allow requests from Netlify's static IPs
        const clientIp = origin.replace(/^https?:\/\//, '').split(':')[0];
        if (NETLIFY_IPS.includes(clientIp)) {
            cb(null, true);
            return;
        }

        // Log rejected origins in development
        if (process.env.NODE_ENV !== 'production') {
            console.log('Rejected CORS origin:', origin);
        }

        // Reject all other origins
        cb(new Error('Not allowed by CORS'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Forwarded-For'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400, // 24 hours
    preflightContinue: false,
    optionsSuccessStatus: 204
});

// Register static file serving BEFORE routes
server.register(fastifyStatic, {
    root: path.join(__dirname, "public"),
    prefix: "/public/",
    maxAge: process.env.NODE_ENV === 'production' ? 86400000 : 0, // 1 day cache in production
    decorateReply: true,
    setHeaders: (res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.setHeader('Vary', 'Origin');
    }
});

// Add root route handler
server.get('/', async () => {
    return {
        status: 'ok',
        message: 'Padre Gino\'s Pizza API',
        endpoints: {
            pizzas: '/api/pizzas',
            pizzaOfTheDay: '/api/pizza-of-the-day',
            orders: '/api/orders',
            pastOrders: '/api/past-orders',
            contact: '/api/contact'
        }
    };
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add a route to check if images exist
server.get("/public/pizzas/:filename", async (request, reply) => {
    const filename = request.params.filename;
    const filePath = path.join("pizzas", filename);

    try {
        return reply.sendFile(filePath);
    } catch (error) {
        request.log.error({
            msg: 'Error serving image',
            filename,
            error: error.message,
            stack: error.stack
        });

        return reply.status(500).send({
            error: 'Failed to serve image',
            message: `Failed to serve image ${filename}`,
            details: {
                error: error.message
            }
        });
    }
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

// Get base URL for assets
const getBaseUrl = () => {
    // Always use HTTPS in production
    if (process.env.NODE_ENV === 'production') {
        return 'https://padre-ginos-fem.onrender.com';
    }
    // Development URL
    return `http://${HOST}:${PORT}`;
};

// Helper to construct image URLs
const getImageUrl = (pizzaId) => {
    const baseUrl = getBaseUrl();
    const imageName = PIZZA_IMAGE_NAMES[pizzaId];
    if (!imageName) {
        console.error('No image name found for pizza ID:', pizzaId);
        return null;
    }
    const imageUrl = `${baseUrl}/public/pizzas/${imageName}.webp`;
    console.log('Constructed image URL:', imageUrl);
    return imageUrl;
};

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

            const imagePath = getImageUrl(pizza.pizza_type_id);

            // Log image path construction in development
            if (process.env.NODE_ENV !== 'production') {
                req.log.info({
                    msg: 'Constructing pizza image path',
                    pizzaId: pizza.pizza_type_id,
                    imageName: PIZZA_IMAGE_NAMES[pizza.pizza_type_id],
                    fullPath: imagePath
                });
            }

            return {
                id: pizza.pizza_type_id,
                name: pizza.name,
                category: pizza.category,
                description: pizza.description,
                image: imagePath,
                sizes,
            };
        });

        res.send(responsePizzas);
    } catch (error) {
        req.log.error({
            msg: 'Failed to fetch pizzas',
            error: error.message,
            stack: error.stack
        });
        res.status(500).send({
            error: "Failed to fetch pizzas",
            details: error.message
        });
    }
});

server.get("/api/pizza-of-the-day", async function getPizzaOfTheDay(req, res) {
    try {
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
            `SELECT size, price
            FROM pizzas
            WHERE pizza_type_id = ?`,
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
            image: getImageUrl(pizza.id),
            sizes: sizeObj,
        };

        res.send(responsePizza);
    } catch (error) {
        req.log.error({
            msg: 'Failed to fetch pizza of the day',
            error: error.message,
            stack: error.stack
        });
        res.status(500).send({
            error: "Failed to fetch pizza of the day",
            details: error.message
        });
    }
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

// Error handler - ensure JSON responses even for errors
server.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    // Set content type to JSON
    reply.type('application/json');

    if (error.statusCode === 404) {
        reply.status(404).send({
            error: 'Not Found',
            message: 'The requested resource was not found',
            statusCode: 404
        });
        return;
    }

    if (error.statusCode === 401) {
        reply.status(401).send({
            error: 'Unauthorized',
            message: 'Authentication is required to access this resource',
            statusCode: 401
        });
        return;
    }

    if (process.env.NODE_ENV === 'production') {
        // Don't leak error details in production
        reply.status(500).send({
            error: 'Internal Server Error',
            message: 'An unexpected error occurred',
            statusCode: 500
        });
    } else {
        // Include error details in development
        reply.status(500).send({
            error: 'Internal Server Error',
            message: error.message,
            stack: error.stack,
            statusCode: 500
        });
    }
});

// Graceful shutdown
const closeGracefully = async (signal) => {
    console.log(`Received signal to terminate: ${signal}`);

    try {
        await server.close();
        console.log('Server closed successfully');

        // Close database connection if it exists
        if (client) {
            await client.close();
            console.log('Database connection closed');
        }
    } catch (error) {
        console.error('Error during shutdown:', error);
    }

    process.exit(0);
};

process.on('SIGINT', closeGracefully);
process.on('SIGTERM', closeGracefully);
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    closeGracefully('uncaughtException');
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    closeGracefully('unhandledRejection');
});

const start = async () => {
    try {
        // Test database connection
        await client.execute("SELECT 1");
        console.log('Database connection successful');

        await server.listen({
            port: PORT,
            host: HOST
        });

        console.log(`Server listening on ${HOST}:${PORT}`);
        console.log('Environment:', process.env.NODE_ENV);
        console.log('Database URL:', process.env.TURSO_DATABASE_URL ? 'Set' : 'Not set');
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

start();