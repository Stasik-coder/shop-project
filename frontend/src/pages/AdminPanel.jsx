import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Load products error:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProducts();
  }, []);

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

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        loadProducts();
      } else {
        const data = await res.json();
        alert(data.message || "Delete error");
      }
    } catch (error) {
      console.error("Delete product error:", error);
      alert("Server error");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Admin Panel</h1>
          <p className="admin-subtitle">
            Manage products, edit catalog and control your store
          </p>
        </div>

        <div className="store-actions">
          <button
            className="primary-btn"
            onClick={() => navigate("/add-product")}
          >
            Add product
          </button>
          <button
            className="secondary-btn"
            onClick={() => navigate("/products")}
          >
            Back to store
          </button>
        </div>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <span>Total products</span>
          <strong>{products.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Admin</span>
          <strong>{user.name || user.email}</strong>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>

                <td>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="admin-product-image"
                    />
                  ) : (
                    <div className="admin-product-image admin-no-image">No image</div>
                  )}
                </td>

                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.description}</td>

                <td>
                  <div className="admin-actions">
                    <button
                      className="secondary-btn"
                      onClick={() => navigate(`/edit-product/${product.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="primary-btn"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <p className="empty-text">No products yet. Add the first one.</p>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;