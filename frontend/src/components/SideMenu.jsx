import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SideMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || document.body.className || "light"
  );

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.className = newTheme;
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <button className="primary-btn" onClick={() => setMenuOpen(true)}>
        Menu
      </button>

      <div
        className={`menu-overlay ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      <aside className={`side-menu ${menuOpen ? "open" : ""}`}>
        <div className="side-menu-header">
          <div>
            <h2>Menu</h2>
            <p>Cocacola shop</p>
          </div>

          <button
            className="side-menu-close"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
        </div>

        <button className="side-theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark theme" : "☀ Light theme"}
        </button>

        <div className="side-menu-links">
          <button
            className="side-menu-link"
            onClick={() => {
              setMenuOpen(false);
              navigate("/products");
            }}
          >
            Store
          </button>

          <button
            className="side-menu-link"
            onClick={() => {
              setMenuOpen(false);
              navigate("/cart");
            }}
          >
            Cart
          </button>

          <button
            className="side-menu-link"
            onClick={() => {
              setMenuOpen(false);
              navigate("/orders");
            }}
          >
            Orders
          </button>

          {user?.role === "ADMIN" && (
            <>
              <button
                className="side-menu-link"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/add-product");
                }}
              >
                Add product
              </button>

              <button
                className="side-menu-link"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/admin");
                }}
              >
                Admin panel
              </button>
            </>
          )}

          <button
            className="side-menu-link"
            onClick={() => {
              setMenuOpen(false);
              navigate("/support");
            }}
          >
            Support
          </button>
          <button
            className="side-menu-link"
            onClick={() => {
              setMenuOpen(false);
              navigate("/admin/support");
            }}
          >
            Support chats
          </button>

          <button
            className="side-menu-link danger"
            onClick={() => {
              setMenuOpen(false);
              logout();
            }}
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default SideMenu;