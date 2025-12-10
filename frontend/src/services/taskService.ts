import api from "./api";

export const getTasks = () => api.get("/tasks");
export const createTask = (task: any) => api.post("/tasks", task);
export const completeTask = (taskId: number) => api.put(`/tasks/${taskId}/complete`);