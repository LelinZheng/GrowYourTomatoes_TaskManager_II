import { useContext, useEffect } from 'react';
import { TaskContext, TaskContextType } from '../context/TaskContext';

export const useTasks = (): TaskContextType & { refreshTasks: () => Promise<void> } => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskContextProvider');
  }

  // Auto-fetch tasks on mount
  useEffect(() => {
    context.fetchTasks();
  }, []);

  return {
    ...context,
    refreshTasks: context.fetchTasks, // Alias for pull-to-refresh
  };
};
