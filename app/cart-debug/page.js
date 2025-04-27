'use client';

import { useContext, useState } from 'react';
import { CartContext } from '../contexts/CartContext';
import Link from 'next/link';

export default function CartDebug() {
    const {
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        toggleServerApi,
        useServerApi
    } = useContext(CartContext);

    const [newItem, setNewItem] = useState({
        pizzaId: 'test-pizza-1',
        name: 'Test Pizza',
        size: 'medium',
        crust: 'regular',
        quantity: 1,
        price: 12.99,
        toppings: []
    });

    const [itemToUpdate, setItemToUpdate] = useState({
        id: '',
        quantity: 1
    });

    const handleAddToCart = async () => {
        const result = await addToCart(newItem);
        alert(result ? 'Item added successfully' : 'Failed to add item');
    };

    const handleUpdateItem = async () => {
        if (!itemToUpdate.id) {
            alert('Please select an item to update');
            return;
        }

        const result = await updateCartItem(itemToUpdate.id, {
            quantity: itemToUpdate.quantity
        });

        alert(result ? 'Item updated successfully' : 'Failed to update item');
    };

    const handleClearCart = async () => {
        const result = await clearCart();
        alert(result ? 'Cart cleared successfully' : 'Failed to clear cart');
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Cart Debug Page</h1>

            <div className="mb-6 p-4 bg-blue-50 rounded">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Current Mode: {useServerApi ? 'Server API' : 'In-Memory'}</h2>
                    <button
                        onClick={toggleServerApi}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Switch to {useServerApi ? 'In-Memory' : 'Server API'}
                    </button>
                </div>
                <p className="text-sm text-gray-600">
                    {useServerApi
                        ? 'Using server API for cart operations. All cart data is persisted on the server.'
                        : 'Using in-memory storage for cart operations. Cart data will be lost on page refresh.'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Cart State</h2>
                    {loading ? (
                        <p>Loading cart...</p>
                    ) : (
                        <div>
                            <p><strong>Cart ID:</strong> {cart.id || 'None'}</p>
                            <p><strong>Total Items:</strong> {cart.items.length}</p>
                            <p><strong>Total Price:</strong> ${cart.total.toFixed(2)}</p>

                            {cart.items.length > 0 ? (
                                <div className="mt-4">
                                    <h3 className="text-lg font-medium mb-2">Items:</h3>
                                    <ul className="divide-y">
                                        {cart.items.map(item => (
                                            <li key={item.id} className="py-2">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <p className="font-medium">{item.name} ({item.size})</p>
                                                        <p className="text-sm text-gray-600">
                                                            {item.crust} crust | Qty: {item.quantity} | ${item.price.toFixed(2)}
                                                        </p>
                                                        {item.toppings.length > 0 && (
                                                            <p className="text-sm text-gray-500">
                                                                Toppings: {item.toppings.join(', ')}
                                                            </p>
                                                        )}
                                                        <p className="text-xs text-gray-400">ID: {item.id}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={handleClearCart}
                                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Clear Cart
                                    </button>
                                </div>
                            ) : (
                                <p className="mt-4 text-gray-500">Cart is empty</p>
                            )}
                        </div>
                    )}
                </div>

                <div>
                    <div className="bg-white p-4 rounded shadow mb-6">
                        <h2 className="text-xl font-semibold mb-4">Add Item</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Pizza ID</label>
                                <input
                                    type="text"
                                    value={newItem.pizzaId}
                                    onChange={e => setNewItem({ ...newItem, pizzaId: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={newItem.name}
                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Size</label>
                                    <select
                                        value={newItem.size}
                                        onChange={e => setNewItem({ ...newItem, size: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    >
                                        <option value="small">Small</option>
                                        <option value="medium">Medium</option>
                                        <option value="large">Large</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Crust</label>
                                    <select
                                        value={newItem.crust}
                                        onChange={e => setNewItem({ ...newItem, crust: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    >
                                        <option value="regular">Regular</option>
                                        <option value="thin">Thin</option>
                                        <option value="stuffed">Stuffed</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={newItem.quantity}
                                        onChange={e => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Price</label>
                                    <input
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={newItem.price}
                                        onChange={e => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold mb-4">Update Item</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Item ID</label>
                                <select
                                    value={itemToUpdate.id}
                                    onChange={e => setItemToUpdate({ ...itemToUpdate, id: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                >
                                    <option value="">Select an item</option>
                                    {cart.items.map(item => (
                                        <option key={item.id} value={item.id}>
                                            {item.name} ({item.size}) - ID: {item.id}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={itemToUpdate.quantity}
                                    onChange={e => setItemToUpdate({ ...itemToUpdate, quantity: parseInt(e.target.value) || 1 })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <button
                                onClick={handleUpdateItem}
                                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                disabled={!itemToUpdate.id}
                            >
                                Update Item
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <Link href="/menu" className="text-blue-500 hover:underline">Back to Menu</Link>
            </div>
        </div>
    );
} 