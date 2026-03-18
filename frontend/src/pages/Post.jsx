import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideMenu from "../components/SideMenu";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("default");
  const [sortOpen, setSortOpen] = useState(false);

  const navigate = useNavigate();
  const sortRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortOpen(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortType === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortType === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, search, sortType]);

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

  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
  ];

  const currentSortLabel =
    sortOptions.find((option) => option.value === sortType)?.label || "Default";

  return (
    <div className="store-page">
      <div className="store-header">
        <div>
          <h1 className="store-title">Cocacola shop</h1>
          <p className="store-subtitle">
            Welcome{user?.name ? `, ${user.name}` : ""} — discover our products
          </p>
        </div>

        <div className="store-actions">
          <SideMenu />
        </div>
      </div>

      <div className="store-filters">
        <input
          type="text"
          placeholder="Search by product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="store-search"
        />

        <div className={`custom-sort ${sortOpen ? "open" : ""}`} ref={sortRef}>
          <button
            type="button"
            className="custom-sort-trigger"
            onClick={() => setSortOpen((prev) => !prev)}
          >
            <span>{currentSortLabel}</span>
            <span className="custom-sort-arrow">⌄</span>
          </button>

          <div className="custom-sort-menu">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`custom-sort-option ${
                  sortType === option.value ? "active" : ""
                }`}
                onClick={() => {
                  setSortType(option.value);
                  setSortOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="empty-text">No matching products found.</p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => navigate(`/products/${product.id}`)}
              style={{ cursor: "pointer" }}
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
              ) : (
                <div className="product-image" />
              )}

              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">${product.price}</p>

              {user?.role === "ADMIN" && (
                <div className="product-actions">
                  <button
                    className="secondary-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit-product/${product.id}`);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="primary-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(product.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;