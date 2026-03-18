import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SideMenu from "../components/SideMenu";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Load product error:", error);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Product added to cart");
      } else {
        setMessage(data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      setMessage("Server error");
    }
  };

  if (!product) {
    return (
      <div className="product-details-page">
        <div className="page-top-bar">
          <SideMenu />
        </div>

        <div className="product-details-card">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="page-top-bar">
        <SideMenu />
      </div>

      <div className="product-details-card">
        <button
          className="secondary-btn"
          onClick={() => navigate("/products")}
          style={{ marginBottom: "20px" }}
        >
          Back to store
        </button>

        <div className="product-details-layout">
          <div>
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="product-details-image"
              />
            ) : (
              <div className="product-details-image" />
            )}
          </div>

          <div className="product-details-info">
            <h1>{product.name}</h1>
            <p className="product-details-price">${product.price}</p>
            <p className="product-details-description">{product.description}</p>

            <div
              style={{
                marginTop: "24px",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <button className="primary-btn" onClick={handleAddToCart}>
                Add to cart
              </button>

              <button
                className="secondary-btn"
                onClick={() => navigate("/cart")}
              >
                Go to cart
              </button>
            </div>

            {message && (
              <p style={{ marginTop: "16px", fontWeight: "700" }}>{message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;