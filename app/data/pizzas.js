/**
 * Pizza data for the application
 * This serves as our "database" for the static site
 */

const pizzas = [
    {
        id: 'margherita',
        name: 'Margherita',
        description: 'Classic pizza with tomato sauce, mozzarella, and basil',
        price: 10.99,
        image: '/assets/pizzas/napolitana.webp',
        ingredients: ['Tomato Sauce', 'Mozzarella', 'Basil', 'Olive Oil'],
        vegetarian: true,
        spicy: false,
        popular: true,
        sizes: {
            S: 10.99,
            M: 12.99,
            L: 14.99
        }
    },
    {
        id: 'pepperoni',
        name: 'Pepperoni',
        description: 'Traditional pizza topped with pepperoni and cheese',
        price: 12.99,
        image: '/assets/pizzas/pepperoni.webp',
        ingredients: ['Tomato Sauce', 'Mozzarella', 'Pepperoni'],
        vegetarian: false,
        spicy: true,
        popular: true,
        sizes: {
            S: 12.99,
            M: 14.99,
            L: 16.99
        }
    },
    {
        id: 'veggie',
        name: 'Veggie Supreme',
        description: 'Loaded with fresh vegetables and cheese',
        price: 13.99,
        image: '/assets/pizzas/veggie.webp',
        ingredients: ['Tomato Sauce', 'Mozzarella', 'Bell Peppers', 'Olives', 'Mushrooms', 'Onions'],
        vegetarian: true,
        spicy: false,
        popular: false,
        sizes: {
            S: 13.99,
            M: 15.99,
            L: 17.99
        }
    },
    {
        id: 'meat-lovers',
        name: 'Meat Lovers',
        description: 'Hearty pizza loaded with various meats',
        price: 14.99,
        image: '/assets/pizzas/big-meat.webp',
        ingredients: ['Tomato Sauce', 'Mozzarella', 'Pepperoni', 'Sausage', 'Bacon', 'Ham'],
        vegetarian: false,
        spicy: true,
        popular: true,
        sizes: {
            S: 14.99,
            M: 16.99,
            L: 18.99
        }
    },
    {
        id: 'hawaiian',
        name: 'Hawaiian',
        description: 'Sweet and savory pizza with ham and pineapple',
        price: 13.99,
        image: '/assets/pizzas/hawaiian.webp',
        ingredients: ['Tomato Sauce', 'Mozzarella', 'Ham', 'Pineapple'],
        vegetarian: false,
        spicy: false,
        popular: false,
        sizes: {
            S: 13.99,
            M: 15.99,
            L: 17.99
        }
    },
    {
        id: 'greek',
        name: 'Greek',
        description: 'Mediterranean inspired pizza with feta and olives',
        price: 13.99,
        image: '/assets/pizzas/greek.webp',
        ingredients: ['Tomato Sauce', 'Mozzarella', 'Feta', 'Olives', 'Red Onions', 'Tomatoes'],
        vegetarian: true,
        spicy: false,
        popular: false,
        sizes: {
            S: 13.99,
            M: 15.99,
            L: 17.99
        }
    },
    {
        id: 'mexican',
        name: 'Spicy Mexican',
        description: 'Zesty pizza with jalapeños, corn, and ground beef',
        price: 14.99,
        image: '/assets/pizzas/mexican.webp',
        ingredients: ['Tomato Sauce', 'Mozzarella', 'Ground Beef', 'Jalapeños', 'Corn', 'Red Onions'],
        vegetarian: false,
        spicy: true,
        popular: false,
        sizes: {
            S: 14.99,
            M: 16.99,
            L: 18.99
        }
    },
    {
        id: 'sicilian',
        name: 'Sicilian',
        description: 'Thick crust pizza with rich tomato sauce and herbs',
        price: 15.99,
        image: '/assets/pizzas/sicilian.webp',
        ingredients: ['Thick Tomato Sauce', 'Mozzarella', 'Parmesan', 'Oregano', 'Basil', 'Garlic'],
        vegetarian: true,
        spicy: false,
        popular: false,
        sizes: {
            S: 15.99,
            M: 17.99,
            L: 19.99
        }
    }
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