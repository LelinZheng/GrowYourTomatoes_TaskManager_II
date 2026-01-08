export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: Priority;
  dueTime: string | null;
  expired: boolean;
  timeBombEnabled: boolean;
  completed: boolean;
  tomatoesEarned: number;
  createdAt: string;
  completedAt: string | null;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: Priority;
  dueTime?: string;
  timeBombEnabled?: boolean;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string | null;
  priority?: Priority;
  dueTime?: string | null;
  timeBombEnabled?: boolean;
  completed?: boolean;
}
