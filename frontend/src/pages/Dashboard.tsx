import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import type { Task } from "../types/Task";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [timeBombEnabled, setTimeBombEnabled] = useState(false);
  const [tomatoes, setTomatoes] = useState(0);
  const [punishments, setPunishments] = useState(0);

  const fetchAll = () => {
    api.get("/tasks").then(res => setTasks(res.data));
    api.get("/tomatoes/count").then(res => setTomatoes(res.data));
    api.get("/punishments/active").then(res => setPunishments(res.data.length));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleCreateTask = async () => {
    await api.post("/tasks", {
      title,
      dueTime: dueTime || null,
      timeBombEnabled,
    });

    setTitle("");
    setDueTime("");
    setTimeBombEnabled(false);
    fetchAll();
  };

  const handleComplete = async (taskId: number) => {
    await api.put(`/tasks/${taskId}/complete`);
    fetchAll();
  };

  console.log("JWT token:", localStorage.getItem("token"));

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h1 className="mb-4">Dashboard</h1>

        {/* STATS */}
        <div className="d-flex gap-3 mb-4">
          <div className="card p-3">
            <h4>🍅 Tomatoes</h4>
            <p className="fs-2">{tomatoes}</p>
          </div>

          <div className="card p-3">
            <h4>⚠️ Punishments</h4>
            <p className="fs-2">{punishments}</p>
          </div>
        </div>

        {/* CREATE TASK */}
        <div className="card p-4 mb-4">
          <h4>Create Task</h4>

          <input
            className="form-control mb-3"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="form-control mb-3"
            type="datetime-local"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
          />

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={timeBombEnabled}
              onChange={(e) => setTimeBombEnabled(e.target.checked)}
              id="timeBomb"
            />
            <label className="form-check-label" htmlFor="timeBomb">
              Enable Time Bomb
            </label>
          </div>

          <button className="btn btn-success w-100" onClick={handleCreateTask}>
            Add Task
          </button>
        </div>

        {/* TASK LIST */}
        <h3>Your Tasks</h3>

        {tasks.length === 0 && <p>No tasks yet. Create one!</p>}

        <ul className="list-group">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`list-group-item d-flex justify-content-between align-items-center 
                ${task.expired ? "list-group-item-danger" : ""}`}
            >
              <div>
                <strong>{task.title}</strong>
                {task.dueTime && (
                  <div className="text-muted">
                    Due: {new Date(task.dueTime).toLocaleString()}
                  </div>
                )}
              </div>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleComplete(task.id)}
              >
                Complete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

