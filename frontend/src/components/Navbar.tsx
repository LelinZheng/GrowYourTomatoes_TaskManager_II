import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

type NavbarProps = {
  onCreateTask?: () => void;
  activeTab: "ACTIVE" | "COMPLETED";
  onTabChange: (tab: "ACTIVE" | "COMPLETED") => void;
};

export default function Navbar({ onCreateTask, activeTab, onTabChange }: NavbarProps) {
  const { logout } = useContext(AuthContext);

  return (
    <nav className="navbar bg-light px-3 d-flex justify-content-between align-items-center">
      <span className="navbar-brand">Tomato Tasks 🍅</span>

      <div className="d-flex align-items-center gap-3">
        {/* Tabs */}
        <ul className="nav nav-pills mb-0">
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${activeTab === "ACTIVE" ? "active" : ""}`}
              onClick={() => onTabChange("ACTIVE")}
            >
              Active Tasks
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${activeTab === "COMPLETED" ? "active" : ""}`}
              onClick={() => onTabChange("COMPLETED")}
            >
              Completed Tasks
            </button>
          </li>
        </ul>

        {/* Actions */}
        <button type="button" className="btn btn-success" onClick={onCreateTask}>
          + Create Task
        </button>

        <button type="button" className="btn btn-outline-danger" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
