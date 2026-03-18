import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideMenu from "../components/SideMenu";

function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div className="cart-page">
      <div className="cart-header">
        <div>
          <h1 className="admin-title">My Orders</h1>
          <p className="admin-subtitle">All your completed purchases</p>
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
        orders.map((order) => (
          <div
            key={order.id}
            className="cart-item-card"
            style={{ maxWidth: "1200px", margin: "0 auto 16px" }}
          >
            <div>
              <h3>Order #{order.id}</h3>
              <p>{new Date(order.createdAt).toLocaleString()}</p>
            </div>

            <div>
              {order.items.map((item) => (
                <div key={item.id}>
                  {item.product.name} × {item.quantity}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;