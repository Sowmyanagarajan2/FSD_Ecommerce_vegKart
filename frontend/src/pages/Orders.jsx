import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/payment/my-orders");
      setOrders(response.data || []);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const addDemoOrder = async () => {
    try {
      await api.post("/payment/save-order", {
        items: [
          {
            productId: "demo-product",
            prod_name: "Demo Grocery Pack",
            price: 299,
            quantity: 1,
          },
        ],
        amount: 299,
        paymentId: "demo-payment-id",
        orderId: `demo-${Date.now()}`,
      });
      await fetchOrders();
      alert("Demo order added successfully");
    } catch (error) {
      console.error("Failed to add demo order", error);
      alert(error.response?.data?.message || "Could not add demo order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <main className="cart-container">
      <header className="cart-header">
        <div>
          <p className="cart-eyebrow">PURCHASE HISTORY</p>
          <h1>Orders</h1>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button onClick={addDemoOrder}>Add Demo Order</button>
          <Link to="/home">Continue shopping</Link>
        </div>
      </header>

      {loading ? (
        <div className="empty-cart">
          <h2>Loading orders...</h2>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-cart">
          <h2>No orders yet</h2>
          <p>Your completed payments will appear here.</p>
          <button onClick={addDemoOrder}>Add Demo Order</button>
          <Link to="/home">Browse products</Link>
        </div>
      ) : (
        <ul className="cart-list">
          {orders.map((order) => (
            <li key={order._id || order.orderId}>
              <div className="cart-item-info">
                <span className="cart-item-index">{(order.orderId || "ORD").slice(-4)}</span>
                <div>
                  <h2>Order {order.orderId || order._id}</h2>
                  <p>{new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <strong>₹{order.amount}</strong>
              <span>{order.status}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default Orders;
