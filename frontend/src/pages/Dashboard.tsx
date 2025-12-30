import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import type { Task } from "../types/Task";
import type { Punishment } from "../types/Punishment";
import Garden from "../components/Garden";
import grassImg from "../assets/grass.png";
import "./Dashboard.css";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueTime, setDueTime] = useState("");
  const [punishmentsList, setPunishmentsList] = useState<Punishment[]>([]);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  type GardenEvent =
    | "TOMATO_GAINED"
    | "PUNISHMENT_ADDED"
    | "PUNISHMENT_RESOLVED"
    | null;
  
  const [lastGardenEvent, setLastGardenEvent] = useState<GardenEvent>(null);

  const prevTomatoesRef = useRef(0);
  const prevPunishmentsRef = useRef(0);

  const [tomatoes, setTomatoes] = useState(0);

  // EDIT MODE
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchAll = () => {
    api.get("/tasks").then((res) => setTasks(res.data));
  
    api.get("/tomatoes/count").then((res) => {
      const newCount = res.data;
      setTomatoes(newCount);
  
      // detect tomato change
      const prev = prevTomatoesRef.current;
      if (newCount > prev) {
        setLastGardenEvent("TOMATO_GAINED");
      }
      prevTomatoesRef.current = newCount;
    });
  
    api.get("/punishments/active").then((res) => {
      const list: Punishment[] = res.data;
      setPunishmentsList(list);
      const newCount = list.length;
  
      const prev = prevPunishmentsRef.current;
      if (newCount > prev) {
        setLastGardenEvent("PUNISHMENT_ADDED");
      } else if (newCount < prev) {
        setLastGardenEvent("PUNISHMENT_RESOLVED");
      }
      prevPunishmentsRef.current = newCount;
    });
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleCreateTask = async () => {
    setError("");
  
    // Validate due time
    if (dueTime) {
      const now = new Date();
      const selected = new Date(dueTime);
  
      if (selected < now) {
        setError("Due time must be in the future.");
        return;
      }
    }
  
    try {
      await api.post("/tasks", {
        title,
        description,
        priority,
        dueTime: dueTime || null,
        timeBombEnabled: dueTime ? true : false,
      });
  
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setDueTime("");
  
      fetchAll();
    } catch (e) {
      setError("Failed to create task. Please try again.");
    }
  };
  

  const handleComplete = async (taskId: number) => {
    await api.put(`/tasks/${taskId}/complete`);
    fetchAll();
  };

  const handleDelete = async (taskId: number) => {
    await api.delete(`/tasks/${taskId}`);
    fetchAll();
  };

  const handleEditSave = async () => {
    if (!editingTask) return;
  
    const payload = {
      ...editingTask,
      timeBombEnabled: editingTask.dueTime ? true : false,
    };
  
    await api.put(`/tasks/${editingTask.id}`, payload);
    setEditingTask(null);
    fetchAll();
  };

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const openDeleteModal = (task: Task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (deleteLoading) return;
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const getDeleteMessage = (task: Task | null) => {
    if (!task) return "";
    if (!task.completed) return "Are you sure you want to delete this task?";
  
    if ((task.tomatoesEarned ?? 0) > 0) {
      return (
        <>
          <p>This completed task earned you 1 tomato.</p>
          <p className="mb-0">
            Deleting it will remove 1 tomato from your total. Continue?
          </p>
        </>
      );
    }
  
    return (
      <>
        <p>This completed task did not earn a tomato (it resolved a punishment).</p>
        <p className="mb-0">
          Deleting it won’t change your tomatoes. Continue?
        </p>
      </>
    );
  };

  const punishmentLabels: Record<string, string> = {
    WILTED_LEAVES: "Wilted Leaves",
    WEED: "Weeds",
    FUNGUS: "Fungus",
    BUG: "Bugs",
    FOG: "Fog",
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h1 className="mb-4">Dashboard</h1>

        {/* ======== STATS ======== */}
        <div className="d-flex gap-3 mb-4">
          <div className="card p-3">
            <h4>🍅 Tomatoes</h4>
            <p className="fs-2">{tomatoes}</p>
          </div>

          <div className="card p-3">
            <h4>⚠️ Punishments</h4>
            <p className="fs-2">{punishmentsList.length}</p>
          </div>
        </div>

        <Garden
            tomatoes={tomatoes}
            punishments={punishmentsList}
            lastEvent={lastGardenEvent}
        />
        <p></p>

        {/* ======== ACTIVE PUNISHMENTS (COMPACT) ======== */}
        <div className="card p-3 mt-4 w-100">
          <h5 className="mb-2">Active Punishments:</h5>
          <div
              className="d-flex flex-wrap align-items-center"
              style={{ gap: "12px", fontSize: "32px" }}
          >
              {punishmentsList.map((p) => (
                <span key={p.id} className="punishment-tooltip">
                  <span className="punishment-icon">
                    {p.type === "WEED" ? (
                      <img src={grassImg} alt="weed" className="weed-icon" />
                    ) : p.type === "BUG" ? (
                      "🐛"
                    ) : p.type === "FUNGUS" ? (
                      "🍄"
                    ) : p.type === "WILTED_LEAVES" ? (
                      "🍂"
                    ) : p.type === "FOG" ? (
                      "🌫️"
                    ) : null}
                  </span>

                  <span className="punishment-tooltip-text">
                    {punishmentLabels[p.type] ?? p.type}
                  </span>
                </span>
              ))}
          </div>
        </div>


        <div className="card p-4 mb-4">
            <h4>Create Task</h4>

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            <label className="form-label mt-2">Title</label>
            <input
                className="form-control"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <label className="form-label mt-3">Description (optional)</label>
            <textarea
                className="form-control"
                value={description}
                placeholder="Write a description..."
                onChange={(e) => setDescription(e.target.value)}
            />

            <label className="form-label mt-3">Priority</label>
            <select
                className="form-control"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
            >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
            </select>

            <label className="form-label mt-3">Due Time (optional)</label>
            <input
                type="datetime-local"
                className="form-control"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
            />

            <button className="btn btn-success w-100 mt-4" onClick={handleCreateTask}>
                Add Task
            </button>
        </div>


        {/* ======== ACTIVE TASKS ======== */}
        <h3 className="mt-4 mb-2">Active Tasks</h3>

        {activeTasks.length === 0 && <p>No active tasks.</p>}

        <ul className="list-group mb-5">
          {activeTasks.map((task) => (
            <li
              key={task.id}
              className={`list-group-item d-flex justify-content-between align-items-center ${
                task.expired ? "list-group-item-danger" : ""
              }`}
            >
              <div>
                <strong>{task.title}</strong>

                {task.description && (
                  <div className="text-muted small">{task.description}</div>
                )}

                <div className="small">
                  Priority: <strong>{task.priority}</strong>
                </div>

                {task.dueTime && (
                  <div className="text-muted small">
                    Due: {new Date(task.dueTime).toLocaleString()}
                  </div>
                )}

                {task.expired && (
                  <div className="text-danger fw-bold small">EXPIRED</div>
                )}
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleComplete(task.id)}
                >
                  Complete
                </button>

                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => setEditingTask(task)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => openDeleteModal(task)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* ======== COMPLETED TASKS ======== */}
        <h3 className="mt-4 mb-2">Completed Tasks</h3>

        {completedTasks.length === 0 && <p>No completed tasks.</p>}

        <ul className="list-group mb-5">
          {completedTasks.map((task) => (
            <li
              key={task.id}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{ opacity: 0.6 }}
            >
              <div>
                <strong className="text-decoration-line-through">
                  {task.title}
                </strong>

                {task.description && (
                  <div className="text-muted small">{task.description}</div>
                )}

                <div className="text-success fw-bold small">Completed</div>
              </div>

              <button
                className="btn btn-sm btn-danger"
                onClick={() => openDeleteModal(task)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        

        <div style={{ height: "80px" }}></div>
      </div>
    
        {/* EDIT MODAL */}
        <div
            className="modal fade show"
            tabIndex={-1}
            role="dialog"
            style={{ display: editingTask ? "block" : "none", background: "rgba(0,0,0,0.5)" }}
        >
        <div className="modal-dialog">
            <div className="modal-content">

            <div className="modal-header">
                <h5 className="modal-title">Edit Task</h5>
                <button className="btn-close" onClick={() => setEditingTask(null)} />
            </div>

            <div className="modal-body">
                <label className="form-label">Title</label>
                <input
                className="form-control mb-2"
                value={editingTask?.title || ""}
                onChange={(e) =>
                    setEditingTask({ ...editingTask!, title: e.target.value })
                }
                />

                <label className="form-label">Description</label>
                <textarea
                className="form-control mb-2"
                value={editingTask?.description || ""}
                onChange={(e) =>
                    setEditingTask({ ...editingTask!, description: e.target.value })
                }
                />

                <label className="form-label">Priority</label>
                <select
                className="form-control mb-2"
                value={editingTask?.priority || "MEDIUM"}
                onChange={(e) =>
                    setEditingTask({ ...editingTask!, priority: e.target.value })
                }
                >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                </select>

                <label className="form-label">Due Time</label>
                <input
                type="datetime-local"
                className="form-control mb-2"
                value={
                    editingTask?.dueTime
                    ? editingTask.dueTime.substring(0, 16)
                    : ""
                }
                onChange={(e) => {
                    const local = e.target.value; // "2025-12-09T18:00"
                    const iso = new Date(local).toISOString();
                    setEditingTask({ ...editingTask!, dueTime: iso });
                }}
                />
            </div>

            <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditingTask(null)}>
                Cancel
                </button>
                <button className="btn btn-primary" onClick={handleEditSave}>
                Save Changes
                </button>
            </div>

        </div>
    </div>
    </div>

    {/* DELETE CONFIRM MODAL */}
    <div
      className="modal fade show"
      tabIndex={-1}
      role="dialog"
      style={{
        display: showDeleteModal ? "block" : "none",
        background: "rgba(0,0,0,0.5)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ borderRadius: "14px" }}>
          <div className="modal-header">
            <h5 className="modal-title">Delete task?</h5>
            <button className="btn-close" onClick={closeDeleteModal} />
          </div>

          <div className="modal-body">
            <p className="mb-2">{getDeleteMessage(taskToDelete)}</p>

            <div className="p-2 bg-light rounded">
              <div className="fw-semibold">{taskToDelete?.title}</div>
              {taskToDelete?.description && (
                <div className="text-muted small">{taskToDelete.description}</div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-outline-secondary"
              onClick={closeDeleteModal}
              disabled={deleteLoading}
            >
              Cancel
            </button>

            <button
              className="btn btn-danger"
              disabled={deleteLoading}
              onClick={async () => {
                if (!taskToDelete) return;
                setDeleteLoading(true);
                try {
                  await api.delete(`/tasks/${taskToDelete.id}`);
                  closeDeleteModal();
                  fetchAll(); // updates tasks + tomatoes + punishments
                } catch (e) {
                  console.error(e);
                  alert("Failed to delete task");
                } finally {
                  setDeleteLoading(false);
                }
              }}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>

    </>
  );
}
