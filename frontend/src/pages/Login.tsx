import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(180deg, #fff5f5 0%, #ffffff 60%)",
        padding: "24px",
      }}
    >
      <div className="card shadow-sm border-0" style={{ width: "420px", borderRadius: "16px" }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <div style={{ fontSize: "34px", lineHeight: 1 }}>🍅</div>
            <h1 className="h3 mb-1">Tomato Tasks</h1>
            <div className="text-muted">Turn tasks into tomatoes.</div>
          </div>

          {error && (
            <div className="alert alert-danger py-2" role="alert">
              {error}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            className="btn btn-danger w-100"
            onClick={handleLogin}
            disabled={loading || !email || !password}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-3 text-center mb-0">
            No account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
