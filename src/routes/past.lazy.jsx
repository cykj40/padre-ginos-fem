import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router'
import { fetchApi } from '../api/config';
import Modal from '../Modal';
import ErrorBoundary from '../ErrorBoundary';

export const Route = createLazyFileRoute('/past')({
  component: ErrorBoundaryWrappedPastOrderRoutes,
});

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function ErrorBoundaryWrappedPastOrderRoutes() {
  return (
    <ErrorBoundary>
      <PastOrdersRoute />
    </ErrorBoundary>
  );
}

// Helper function to format date and time from ISO string
function formatDateTime(isoString) {
  try {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  } catch (error) {
    console.error("Error formatting date:", error);
    return { date: "Unknown", time: "Unknown" };
  }
}

function PastOrdersRoute() {
  const [page, setPage] = useState(1);
  const [focusedOrder, setFocusedOrder] = useState();
  const [localOrders, setLocalOrders] = useState([]);
  const [hasLocalData, setHasLocalData] = useState(false);
  
  // Load orders from localStorage on component mount
  useEffect(() => {
    try {
      const storedOrders = JSON.parse(localStorage.getItem('pastOrders') || '[]');
      if (storedOrders.length > 0) {
        setLocalOrders(storedOrders);
        setHasLocalData(true);
      }
    } catch (error) {
      console.error("Error loading orders from localStorage:", error);
    }
  }, []);

  // Fetch past orders from API with error handling and retry
  const { isLoading, data: apiOrders, error: ordersError } = useQuery({
    queryKey: ["past-orders", page],
    queryFn: async () => {
      try {
        return await fetchApi(`api/orders?page=${page}`);
      } catch (error) {
        console.error("Error fetching past orders:", error);
        throw new Error("Could not load past orders from server");
      }
    },
    staleTime: 30000,
    retry: 1,
    retryDelay: 1000,
  });

  // Fetch specific order details with error handling and retry
  const { isLoading: isLoadingPastOrder, data: pastOrderData, error: orderDetailError } = useQuery({
    queryKey: ["past-order", focusedOrder],
    queryFn: async () => {
      // Check if it's a local order ID
      if (focusedOrder && focusedOrder.startsWith('local-')) {
        const localOrder = localOrders.find(order => order.id === focusedOrder);
        if (localOrder) {
          // Transform local order to match API format
          return {
            orderId: localOrder.id,
            date: localOrder.date,
            orderItems: localOrder.items.map(item => ({
              name: item.pizza.name,
              size: item.size,
              price: item.pizza.sizes[item.size],
              quantity: item.quantity || 1,
              total: item.pizza.sizes[item.size] * (item.quantity || 1),
              image: item.pizza.image
            }))
          };
        }
      }
      
      // If not a local order or not found locally, try API
      try {
        return await fetchApi(`api/orders/${focusedOrder}`);
      } catch (error) {
        console.error(`Error fetching order ${focusedOrder}:`, error);
        throw new Error("Could not load order details from server");
      }
    },
    enabled: !!focusedOrder,
    staleTime: 24 * 60 * 60 * 1000, // one day in milliseconds
    retry: 1,
    retryDelay: 1000,
  });

  // Combine API and local orders
  const combinedOrders = [...(apiOrders || [])];
  
  // Add local orders if we have them and API failed or returned no results
  if (hasLocalData && (ordersError || !apiOrders || apiOrders.length === 0)) {
    // Format local orders to match API format
    const formattedLocalOrders = localOrders.map(order => {
      const { date, time } = formatDateTime(order.date);
      return {
        order_id: order.id,
        date,
        time
      };
    });
    
    // Add local orders to the combined list
    combinedOrders.push(...formattedLocalOrders);
  }

  // Show loading state
  if (isLoading && !hasLocalData) {
    return (
      <div className="past-orders">
        <h2>Loading Past Orders...</h2>
      </div>
    );
  }

  // Show error state with local data fallback
  if (ordersError && !hasLocalData) {
    return (
      <div className="past-orders">
        <h2>Past Orders</h2>
        <div className="error-message" style={{ color: "red", padding: "15px", margin: "10px 0", backgroundColor: "#ffeeee", borderRadius: "4px" }}>
          <p>Could not load orders from server. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Show empty state
  if (combinedOrders.length === 0) {
    return (
      <div className="past-orders">
        <h2>Past Orders</h2>
        <p>You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="past-orders">
      <h2>Past Orders</h2>
      
      {ordersError && hasLocalData && (
        <div className="warning-message" style={{ color: "#856404", padding: "10px", margin: "10px 0", backgroundColor: "#fff3cd", borderRadius: "4px" }}>
          <p>Could not connect to server. Showing locally saved orders.</p>
        </div>
      )}
      
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
            <th style={{ padding: "12px", textAlign: "left" }}>Order ID</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Time</th>
          </tr>
        </thead>
        <tbody>
          {combinedOrders.map((order) => (
            <tr key={order.order_id} style={{ borderBottom: "1px solid #dee2e6" }}>
              <td style={{ padding: "12px" }}>
                <button 
                  onClick={() => setFocusedOrder(order.order_id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#e74c3c",
                    cursor: "pointer",
                    fontWeight: "bold",
                    textDecoration: "underline"
                  }}
                >
                  {order.order_id}
                </button>
              </td>
              <td style={{ padding: "12px" }}>{order.date}</td>
              <td style={{ padding: "12px" }}>{order.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {!ordersError && (
        <div className="pages" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", margin: "20px 0" }}>
          <button 
            disabled={page <= 1} 
            onClick={() => setPage(page - 1)}
            style={{
              padding: "8px 16px",
              backgroundColor: page <= 1 ? "#f8f9fa" : "#e74c3c",
              color: page <= 1 ? "#6c757d" : "white",
              border: "none",
              borderRadius: "4px",
              cursor: page <= 1 ? "not-allowed" : "pointer"
            }}
          >
            Previous
          </button>
          <div style={{ fontWeight: "bold" }}>{page}</div>
          <button 
            disabled={apiOrders && apiOrders.length < 10} 
            onClick={() => setPage(page + 1)}
            style={{
              padding: "8px 16px",
              backgroundColor: apiOrders && apiOrders.length < 10 ? "#f8f9fa" : "#e74c3c",
              color: apiOrders && apiOrders.length < 10 ? "#6c757d" : "white",
              border: "none",
              borderRadius: "4px",
              cursor: apiOrders && apiOrders.length < 10 ? "not-allowed" : "pointer"
            }}
          >
            Next
          </button>
        </div>
      )}
      
      {focusedOrder && (
        <Modal>
          <div style={{ padding: "20px", maxWidth: "800px" }}>
            <h2 style={{ marginBottom: "20px", color: "#e74c3c" }}>Order #{focusedOrder}</h2>
            
            {orderDetailError && (
              <div className="error-message" style={{ color: "red", padding: "10px", margin: "10px 0", backgroundColor: "#ffeeee", borderRadius: "4px" }}>
                <p>Could not load order details. Please try again later.</p>
              </div>
            )}
            
            {isLoadingPastOrder ? (
              <p>Loading order details...</p>
            ) : pastOrderData ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
                    <th style={{ padding: "12px", textAlign: "left" }}>Image</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>Size</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>Quantity</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>Price</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {pastOrderData.orderItems.map((pizza, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid #dee2e6" }}>
                      <td style={{ padding: "12px" }}>
                        <img 
                          src={pizza.image} 
                          alt={pizza.name} 
                          style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/60x60?text=Pizza";
                            e.target.onerror = null;
                          }}
                        />
                      </td>
                      <td style={{ padding: "12px" }}>{pizza.name}</td>
                      <td style={{ padding: "12px" }}>{pizza.size}</td>
                      <td style={{ padding: "12px" }}>{pizza.quantity}</td>
                      <td style={{ padding: "12px" }}>{intl.format(pizza.price)}</td>
                      <td style={{ padding: "12px", fontWeight: "bold" }}>{intl.format(pizza.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ backgroundColor: "#f8f9fa" }}>
                    <td colSpan="5" style={{ padding: "12px", textAlign: "right", fontWeight: "bold" }}>Order Total:</td>
                    <td style={{ padding: "12px", fontWeight: "bold", color: "#e74c3c" }}>
                      {intl.format(pastOrderData.orderItems.reduce((sum, item) => sum + item.total, 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            ) : null}
            
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <button 
                onClick={() => setFocusedOrder(undefined)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "16px"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

