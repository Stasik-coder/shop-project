import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/products");
      } else {
        setError(data.error || "Registration failed. Try another email.");
      }
    } catch {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account 🚀</h2>
      <p style={{ textAlign: "center", marginBottom: "18px", opacity: 0.85 }}>
        Create your Cocacola shop account
      </p>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        <button type="submit">Register</button>
      </form>

      <div className="link">
        Already have an account? <Link to="/">Login</Link>
      </div>
    </div>
  );
}

export default Register;