export interface Task {
  id: number;
  title: string;
  description: string | null;
  dueTime: string | null;
  expired: boolean;
  timeBombEnabled: boolean;
  completed: boolean;
  tomatoesEarned: number;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  dueTime?: string;
  timeBombEnabled?: boolean;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  dueTime?: string;
  timeBombEnabled?: boolean;
  completed?: boolean;
}
