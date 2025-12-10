import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { logout } = useContext(AuthContext);

  return (
    <nav className="navbar bg-light px-3">
      <span className="navbar-brand">Tomato Tasks 🍅</span>

      <button className="btn btn-outline-danger" onClick={logout}>
        Logout
      </button>
    </nav>
  );
}
