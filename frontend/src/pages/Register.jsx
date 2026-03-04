import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const toggleTheme = () => {
    document.body.className =
      document.body.className === "light" ? "dark" : "light";
  };

  const handleRegister = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/posts");
    } else {
      setError("Registration failed. Try another email.");
    }
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    setError("Server error. Please try again.");
  }
};

  return (
    <>
      <div className="theme-toggle" onClick={toggleTheme}>
        🌙 Theme
      </div>

      <div className="auth-container">
        <h2>Create Account 🚀</h2>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleRegister}>
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
    </>
  );
}

export default Register;