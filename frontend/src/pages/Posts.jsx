import { useNavigate } from "react-router-dom";

function Posts() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ color: "white", textAlign: "center" }}>
      <h1>🎉 You are logged in!</h1>
      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}

export default Posts;