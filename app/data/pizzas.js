/**
 * Pizza data for the application
 * This serves as our "database" for the static site
 */

export const pizzas = [
    {
        id: 'margherita',
        name: 'Margherita',
        description: 'Classic tomato sauce, mozzarella, and fresh basil',
        image: '/assets/pizzas/napolitana.webp',
        prices: {
            small: 10,
            medium: 15,
            large: 20,
        },
        availableToppings: [
            'Extra Cheese',
            'Pepperoni',
            'Mushrooms',
            'Onions',
            'Olives',
        ],
    },
    {
        id: 'pepperoni',
        name: 'Pepperoni',
        description: 'Tomato sauce, mozzarella, and pepperoni',
        image: '/assets/pizzas/pepperoni.webp',
        prices: {
            small: 12,
            medium: 17,
            large: 22,
        },
        availableToppings: [
            'Extra Cheese',
            'Mushrooms',
            'Onions',
            'Olives',
            'Bell Peppers',
        ],
    },
    {
        id: 'vegetarian',
        name: 'Vegetarian',
        description: 'Tomato sauce, mozzarella, mushrooms, onions, bell peppers, and olives',
        image: '/assets/pizzas/veggie.webp',
        prices: {
            small: 13,
            medium: 18,
            large: 23,
        },
        availableToppings: [
            'Extra Cheese',
            'Spinach',
            'Artichokes',
            'Sun-dried Tomatoes',
            'Feta Cheese',
        ],
    },
    {
        id: 'thai',
        name: 'Thai',
        description: 'Peanut sauce, mozzarella, chicken, carrots, and cilantro',
        image: '/assets/pizzas/thai.webp',
        prices: {
            small: 14,
            medium: 19,
            large: 24,
        },
        availableToppings: [
            'Extra Cheese',
            'Chicken',
            'Carrots',
            'Cilantro',
            'Peanuts',
        ],
    },
    {
        id: 'spinach',
        name: 'Spinach',
        description: 'White sauce, mozzarella, spinach, and garlic',
        image: '/assets/pizzas/spinach.webp',
        prices: {
            small: 13,
            medium: 18,
            large: 23,
        },
        availableToppings: [
            'Extra Cheese',
            'Mushrooms',
            'Onions',
            'Tomatoes',
            'Feta Cheese',
        ],
    },
    {
        id: 'sicilian',
        name: 'Sicilian',
        description: 'Thick crust with tomato sauce, mozzarella, and Italian sausage',
        image: '/assets/pizzas/sicilian.webp',
        prices: {
            small: 14,
            medium: 19,
            large: 24,
        },
        availableToppings: [
            'Extra Cheese',
            'Italian Sausage',
            'Peppers',
            'Onions',
            'Mushrooms',
        ],
    },
    {
        id: 'mexican',
        name: 'Mexican',
        description: 'Spicy tomato sauce, mozzarella, ground beef, and jalapeños',
        image: '/assets/pizzas/mexican.webp',
        prices: {
            small: 14,
            medium: 19,
            large: 24,
        },
        availableToppings: [
            'Extra Cheese',
            'Ground Beef',
            'Jalapeños',
            'Black Olives',
            'Sour Cream',
        ],
    },
    {
        id: 'mediterraneo',
        name: 'Mediterraneo',
        description: 'Olive oil base, mozzarella, feta, olives, and sun-dried tomatoes',
        image: '/assets/pizzas/mediterraneo.webp',
        prices: {
            small: 14,
            medium: 19,
            large: 24,
        },
        availableToppings: [
            'Extra Cheese',
            'Feta',
            'Olives',
            'Sun-dried Tomatoes',
            'Artichokes',
        ],
    },
    {
        id: 'hawaiian',
        name: 'Hawaiian',
        description: 'Tomato sauce, mozzarella, ham, and pineapple',
        image: '/assets/pizzas/hawaiian.webp',
        prices: {
            small: 13,
            medium: 18,
            large: 23,
        },
        availableToppings: [
            'Extra Cheese',
            'Ham',
            'Pineapple',
            'Bacon',
            'Red Onions',
        ],
    },
    {
        id: 'greek',
        name: 'Greek',
        description: 'Olive oil base, mozzarella, feta, olives, and oregano',
        image: '/assets/pizzas/greek.webp',
        prices: {
            small: 14,
            medium: 19,
            large: 24,
        },
        availableToppings: [
            'Extra Cheese',
            'Feta',
            'Olives',
            'Red Onions',
            'Tomatoes',
        ],
    },
    {
        id: 'big-meat',
        name: 'Big Meat',
        description: 'Tomato sauce, mozzarella, pepperoni, sausage, ham, and bacon',
        image: '/assets/pizzas/big-meat.webp',
        prices: {
            small: 15,
            medium: 20,
            large: 25,
        },
        availableToppings: [
            'Extra Cheese',
            'Pepperoni',
            'Sausage',
            'Ham',
            'Bacon',
        ],
    },
];

export function getAllPizzas() {
    return pizzas;
}

export function getPizzaById(id) {
    return pizzas.find(pizza => pizza.id === id);
}

export function getPopularPizzas() {
    return pizzas.filter(pizza => pizza.popular);
}

export function getVegetarianPizzas() {
    return pizzas.filter(pizza => pizza.vegetarian);
}

export function getSpicyPizzas() {
    return pizzas.filter(pizza => pizza.spicy);
} 