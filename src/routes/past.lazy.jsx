import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router'
import getPastOrders from '../api/getPastOrders';
import getPastOrder from '../api/getPastOrder';
import Modal from '../Modal';
import { priceConverter } from '../useCurrency';

export const Route = createLazyFileRoute('/past')({
  component: PastOrdersRoute,
});

function PastOrdersRoute() {
  const [page, setPage] = useState(1);
  const [focusedOrder, setFocusedOrder] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['past-orders', page],
    queryFn: () => getPastOrders(page),
  });

  const { isLoading: isLoadingPastOrder, data: pastOrderData } = useQuery({
    queryKey: ['past-order', focusedOrder],
    queryFn: () => getPastOrder(focusedOrder),
    enabled: !!focusedOrder,
  });

  if (isLoading) {
    return (
      <div className="past-orders">
        <h2>Loading past orders...</h2>
      </div>
    );
  }

  return (
    <div className="past-orders">
      <h2>Past Orders</h2>
      <table>
        <thead>
          <tr>
            <th>View</th>
            <th>Order ID</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((order) => (
            <tr key={order.order_id}>
              <td>
                <button onClick={() => setFocusedOrder(order.order_id)}>View</button>
              </td>
              <td>{order.order_id}</td>
              <td>{order.date}</td>
              <td>{order.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pages">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
        <button disabled={data.length < 10} onClick={() => setPage(page + 1)}>Next</button>
      </div>
      {focusedOrder && (
        <Modal>
          <h2>Order #{focusedOrder}</h2>
          {isLoadingPastOrder ? (
            <p>Loading...</p>
          ) : pastOrderData ? (
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Size</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {pastOrderData.orderItems.map((pizza) => (
                  <tr key={`${pizza.pizzaTypeId}_${pizza.size}`}>
                    <td>
                      <img src={pizza.image} alt={pizza.name} />
                    </td>
                    <td>{pizza.name}</td>
                    <td>{pizza.size}</td>
                    <td>{pizza.quantity}</td>
                    <td>{priceConverter(pizza.price)}</td>
                    <td>{priceConverter(pizza.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
          <button onClick={() => setFocusedOrder(null)}>Close</button>
        </Modal>
      )}
    </div>
  );
}

