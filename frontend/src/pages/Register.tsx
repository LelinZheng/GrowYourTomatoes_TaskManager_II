import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", {
        username,
        email,
        password,
      });

      alert("Account created!");
      navigate("/login");
    } catch {
      alert("Email already exists");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
        <h2 className="mb-4">Register</h2>

        <input
            className="form-control mb-3"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />

        <input
            className="form-control mb-3"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />

        <input
            className="form-control mb-3"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-success w-100" onClick={handleRegister}>
            Create Account
        </button>

        <p className="mt-3 text-center">
            Already have an account? <a href="/login">Login</a>
        </p>
    </div>
  );
}
