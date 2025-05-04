'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export default function PastOrders() {
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

    const { data: orders, isLoading, error } = useQuery({
        queryKey: ['past-orders'],
        queryFn: async () => {
            const response = await fetch('/api/orders');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    // Sort orders by date (newest first)
    const sortedOrders = orders ? [...orders].sort((a, b) =>
        new Date(b.date) - new Date(a.date)
    ) : [];

    // Calculate pagination
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="past-orders">
            <h2>Order History</h2>

            {sortedOrders.length === 0 ? (
                <p>You haven&apos;t placed any orders yet. <a href="/menu">Go to Menu</a></p>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.map(order => (
                                <tr key={order.id}>
                                    <td>#{order.id.slice(0, 8)}</td>
                                    <td>{formatDate(order.date)}</td>
                                    <td>
                                        <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                                            {order.items.map((item, index) => (
                                                <li key={index}>
                                                    {item.quantity}x {item.pizza.name} ({item.size}, {item.crust})
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>${parseFloat(order.total).toFixed(2)}</td>
                                    <td>{order.status || 'Delivered'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pages">
                            <div>
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                    <button
                                        key={number}
                                        onClick={() => handlePageChange(number)}
                                        style={{
                                            fontWeight: number === currentPage ? 'bold' : 'normal',
                                            marginLeft: '5px',
                                            marginRight: '5px'
                                        }}
                                    >
                                        {number}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
} 