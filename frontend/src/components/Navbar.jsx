import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{ marginBottom: "20px" }}>
      <Link to="/login">Login</Link> |{" "}
      <Link to="/register">Register</Link> |{" "}
      {token && <Link to="/messages">Messages</Link>}{" "}
      {token && (
        <>
          | <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
}

export default Navbar;