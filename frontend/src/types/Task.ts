export interface Task {
    id: number;
    title: string;
    description: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueTime: string | null;
  createdAt: string; // ISO datetime string
    expired: boolean;
    timeBombEnabled: boolean;
    completed: boolean;
    tomatoesEarned: number; 
  }
  