import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideMenu from "../components/SideMenu";

function Cart() {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    const loadCart = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:3000/api/cart", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            setItems(data);
        } catch (error) {
            console.error("Load cart error:", error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadCart();
    }, []);

    const totalPrice = useMemo(() => {
        return items.reduce((sum, item) => {
            return sum + item.product.price * item.quantity;
        }, 0);
    }, [items]);

    const handleRemove = async (id) => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`http://localhost:3000/api/cart/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                loadCart();
            }
        } catch (error) {
            console.error("Remove cart item error:", error);
        }
    };

    const handleQuantityChange = async (id, quantity) => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`http://localhost:3000/api/cart/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ quantity }),
            });

            if (res.ok) {
                loadCart();
            }
        } catch (error) {
            console.error("Update quantity error:", error);
        }
    };

    return (
        <div className="cart-page">
            <div className="cart-header">
                <div>
                    <h1 className="admin-title">Your Cart</h1>
                    <p className="admin-subtitle">Review your selected products</p>
                </div>

                <div className="store-actions">
                    <button className="secondary-btn" onClick={() => navigate("/products")}>
                        Back to store
                    </button>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="form-card" style={{ maxWidth: "900px" }}>
                    <h1>Your cart is empty</h1>
                    <button className="primary-btn" onClick={() => navigate("/products")}>
                        Go shopping
                    </button>
                </div>
            ) : (
                <div className="cart-layout">
                    <div className="cart-items">
                        {items.map((item) => (
                            <div key={item.id} className="cart-item-card">
                                {item.product.image ? (
                                    <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                        className="cart-item-image"
                                    />
                                ) : (
                                    <div className="cart-item-image" />
                                )}

                                <div className="cart-item-info">
                                    <h3>{item.product.name}</h3>
                                    <p>{item.product.description}</p>
                                    <strong>${item.product.price}</strong>
                                </div>

                                <div className="cart-item-controls">
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            handleQuantityChange(item.id, Number(e.target.value))
                                        }
                                        className="cart-qty-input"
                                    />

                                    <button
                                        className="primary-btn"
                                        onClick={() => handleRemove(item.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <p>Total items: {items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                        <p className="cart-total">Total: ${totalPrice.toFixed(2)}</p>

                        <button
                            className="primary-btn"
                            style={{ width: "100%" }}
                            onClick={async () => {
                                const token = localStorage.getItem("token");

                                try {
                                    const res = await fetch("http://localhost:3000/api/orders/checkout", {
                                        method: "POST",
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    });

                                    const data = await res.json();

                                    if (res.ok) {
                                        alert("Order created!");
                                        navigate("/orders");
                                    } else {
                                        alert(data.message || "Checkout failed");
                                    }
                                } catch (error) {
                                    console.error("Checkout error:", error);
                                    alert("Server error");
                                }
                            }}
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;