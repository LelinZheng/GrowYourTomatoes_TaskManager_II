import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import type { User } from "../types/User";
import type { Task } from "../types/Task";

export default function Profile() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [usernameInput, setUsernameInput] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usernameSuccess, setUsernameSuccess] = useState("");
  const [usernameSaving, setUsernameSaving] = useState(false);
  const [showUsernameEditor, setShowUsernameEditor] = useState(false);

  const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [meRes, tasksRes] = await Promise.all([
          api.get("/auth/me"),
          api.get("/tasks"),
        ]);
        setUser(meRes.data);
        setUsernameInput(meRes.data.username ?? "");
        setTasks(tasksRes.data);
      } catch (e) {
        console.error("Failed to fetch profile", e);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateUsername = async () => {
    setUsernameError("");
    setUsernameSuccess("");
    const trimmed = usernameInput.trim();
    if (!trimmed) {
      setUsernameError("Username is required.");
      return;
    }
    if (!usernameRegex.test(trimmed)) {
      setUsernameError("Username must be 3+ characters (letters, numbers, underscore).");
      return;
    }
    if (user && trimmed === user.username) {
      setUsernameSuccess("No changes to save.");
      return;
    }

    try {
      setUsernameSaving(true);
      const res = await api.patch("/users/me/username", { username: trimmed });
      const updated: User = res.data.user;
      setUser(updated);
      setUsernameInput(updated.username);
      setUsernameSuccess("Username updated.");
      setShowUsernameEditor(false);
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.response?.data?.message || "Failed to update username.";
      setUsernameError(msg);
    } finally {
      setUsernameSaving(false);
    }
  };

  const formatDate = (value?: string) => {
    if (!value) return "—";
    const d = new Date(value);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
  };

  const totalTomatoes = tasks.reduce((sum, t) => sum + (t.tomatoesEarned || 0), 0);

  const avatarLetter = user?.username ? user.username[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : "?";

  return (
    <div className="container mt-4" style={{ maxWidth: "800px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Profile</h1>
        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>

      <div className="card p-4 mb-4 shadow-sm">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "#dc3545",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            {avatarLetter}
          </div>
          <div>
            <div className="fw-bold fs-4">{user?.username || "Your username"}</div>
            <div className="text-muted">Keep growing your tomatoes — one task at a time.</div>
          </div>
        </div>

        <div className="row gy-3">
          <div className="col-12 col-md-4">
            <div className="text-muted small">Email</div>
            <div className="fw-semibold">{user?.email || "—"}</div>
          </div>
          <div className="col-12 col-md-4">
            <div className="text-muted small">Join Date</div>
            <div className="fw-semibold">{formatDate(user?.createdAt)}</div>
          </div>
          <div className="col-12 col-md-4">
            <div className="text-muted small">Tomatoes Earned</div>
            <div className="fw-semibold">{totalTomatoes}</div>
          </div>
        </div>
      </div>

      <div className="card p-4 mb-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Update Username</h5>
          {!showUsernameEditor && (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => {
                setShowUsernameEditor(true);
                setUsernameError("");
                setUsernameSuccess("");
                setUsernameInput(user?.username || "");
              }}
            >
              Edit
            </button>
          )}
        </div>
        <p className="text-muted small mb-3">Choose a unique handle to personalize your garden.</p>

        {showUsernameEditor ? (
          <div className="p-3 border rounded bg-light">
            <label className="form-label fw-semibold">New username</label>
            <input
              type="text"
              className={`form-control ${usernameError ? "is-invalid" : ""}`}
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="your_username"
              disabled={usernameSaving}
            />
            {usernameError && <div className="invalid-feedback d-block">{usernameError}</div>}
            {usernameSuccess && !usernameError && (
              <div className="text-success small mt-2">{usernameSuccess}</div>
            )}
            <div className="d-flex gap-2 mt-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdateUsername}
                disabled={usernameSaving}
              >
                {usernameSaving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="btn btn-link text-muted"
                onClick={() => {
                  setShowUsernameEditor(false);
                  setUsernameError("");
                  setUsernameSuccess("");
                  setUsernameInput(user?.username || "");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="text-muted">Click "Edit" to change your username.</div>
        )}
      </div>

      <button type="button" className="btn btn-dark w-100" onClick={logout}>
        Sign out
      </button>
    </div>
  );
}
