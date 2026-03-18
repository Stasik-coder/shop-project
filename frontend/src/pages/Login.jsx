import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/products");
      } else {
        setError(data.error || "Invalid email or password");
      }
    } catch {
      setError("Server error. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Welcome Back 👋</h2>
      <p style={{ textAlign: "center", marginBottom: "18px", opacity: 0.85 }}>
        Welcome to Cocacola shop
      </p>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="input-group">
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShow(!show)}
          >
            {show ? "🙈" : "👁"}
          </span>
        </div>

        <button type="submit">Login</button>
      </form>

      <div className="link">
        No account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

export default Login;