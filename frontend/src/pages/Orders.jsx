import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideMenu from "../components/SideMenu";

function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const loadOrders = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setOrders(data);
    };

    loadOrders();
  }, []);

  const getOrderTotal = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <div>
          <h1 className="admin-title">
            {user?.role === "ADMIN" ? "All Orders" : "My Orders"}
          </h1>
          <p className="admin-subtitle">
            {user?.role === "ADMIN"
              ? "View all customer orders"
              : "All your completed purchases"}
          </p>
        </div>

        <div className="store-actions">
          <button className="secondary-btn" onClick={() => navigate("/products")}>
            Back to store
          </button>
          <SideMenu />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="form-card" style={{ maxWidth: "900px" }}>
          <h1>No orders yet</h1>
          <button className="primary-btn" onClick={() => navigate("/products")}>
            Go shopping
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {orders.map((order) => (
            <div
              key={order.id}
              className="order-card"
            >
              <div className="order-card-top">
                <div>
                  <h3>Order #{order.id}</h3>
                  <p>{new Date(order.createdAt).toLocaleString()}</p>
                </div>

                <div className="order-total-box">
                  Total: ${getOrderTotal(order.items).toFixed(2)}
                </div>
              </div>

              {user?.role === "ADMIN" && order.user && (
                <div className="order-user-box">
                  <strong>Customer:</strong> {order.user.name} ({order.user.email})
                </div>
              )}

              <div className="order-items-list">
                {order.items.map((item) => (
                  <div key={item.id} className="order-item-row">
                    <div className="order-item-left">
                      {item.product?.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="order-item-image"
                        />
                      ) : (
                        <div className="order-item-image" />
                      )}

                      <div>
                        <h4>{item.product?.name}</h4>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>

                    <div className="order-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;