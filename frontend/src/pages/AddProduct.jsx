import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="form-page">
        <div className="form-card">
          <h1>Access denied</h1>
          <button className="primary-btn" onClick={() => navigate("/products")}>
            Back
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          price,
          image,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/products");
      } else {
        setError(data.message || "Error creating product");
      }
    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h1>Add Product</h1>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <div className="form-row">
            <button type="submit" className="primary-btn">
              Create product
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/products")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;