export interface Task {
    id: number;
    title: string;
    description: string | null;
    dueTime: string | null;
    expired: boolean;
    timeBombEnabled: boolean;
    completed: boolean;
  }
  