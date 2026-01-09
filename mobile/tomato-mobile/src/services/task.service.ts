import { axiosInstance } from './api/axiosConfig';
import { TASK_ENDPOINTS } from './api/endpoints';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/Task';

export const taskService = {
  async getAllTasks(): Promise<Task[]> {
    const response = await axiosInstance.get<Task[]>(TASK_ENDPOINTS.GET_ALL);
    return response.data;
  },

  async getTask(id: number): Promise<Task> {
    const response = await axiosInstance.get<Task>(TASK_ENDPOINTS.GET_ONE(id));
    return response.data;
  },

  async createTask(data: CreateTaskRequest): Promise<Task> {
    const response = await axiosInstance.post<Task>(TASK_ENDPOINTS.CREATE, data);
    return response.data;
  },

  async updateTask(id: number, data: UpdateTaskRequest): Promise<Task> {
    const response = await axiosInstance.put<Task>(TASK_ENDPOINTS.UPDATE(id), data);
    return response.data;
  },

  async deleteTask(id: number): Promise<void> {
    await axiosInstance.delete(TASK_ENDPOINTS.DELETE(id));
  },

  async completeTask(id: number): Promise<Task> {
    const response = await axiosInstance.put<Task>(TASK_ENDPOINTS.COMPLETE(id));
    return response.data;
  },

  async getActiveTasks(): Promise<Task[]> {
    const tasks = await this.getAllTasks();
    return tasks.filter(task => !task.completed);
  },

  async getCompletedTasks(): Promise<Task[]> {
    const tasks = await this.getAllTasks();
    return tasks.filter(task => task.completed);
  },
};
