import { useContext } from 'react';
import { TaskContext, TaskContextType } from '../context/TaskContext';

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskContextProvider');
  }
  return context;
};
