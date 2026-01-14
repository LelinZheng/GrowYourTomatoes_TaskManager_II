import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { TaskListScreen } from '../screens/tasks/TaskListScreen';
import { CreateTaskScreen } from '../screens/tasks/CreateTaskScreen';
import { EditTaskScreen } from '../screens/tasks/EditTaskScreen';
import { GardenScreen } from '../screens/main/GardenScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { Task } from '../types/Task';
import { spacing } from '../styles/spacing';
import { typography } from '../styles/typography';
import { useTasks } from '../hooks/useTasks';

type Screen = 'tasks' | 'garden' | 'profile' | 'create-task' | 'edit-task';

export const AppNavigator: React.FC = () => {
  const { signOut } = useAuth();
  const { theme } = useTheme();
  const { tasks } = useTasks();
  const [currentScreen, setCurrentScreen] = useState<Screen>('tasks');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const totalTomatoes = tasks.reduce((sum, t) => sum + (t.tomatoesEarned || 0), 0);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setCurrentScreen('edit-task');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'tasks':
        return (
          <TaskListScreen
            onCreateTask={() => setCurrentScreen('create-task')}
            onEditTask={handleEditTask}
          />
        );
      case 'create-task':
        return (
          <CreateTaskScreen
            onBack={() => setCurrentScreen('tasks')}
            onSuccess={() => setCurrentScreen('tasks')}
          />
        );
      case 'edit-task':
        return editingTask ? (
          <EditTaskScreen
            task={editingTask}
            onBack={() => {
              setEditingTask(null);
              setCurrentScreen('tasks');
            }}
            onSuccess={() => {
              setEditingTask(null);
              setCurrentScreen('tasks');
            }}
          />
        ) : null;
      case 'garden':
        return <GardenScreen />;
      case 'profile':
        return (
          <ProfileScreen
            totalTomatoes={totalTomatoes}
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.backgroundSecondary }]}>
      {renderScreen()}
      
      {/* Bottom Tab Bar */}
      {currentScreen !== 'create-task' && currentScreen !== 'edit-task' && (
        <View style={[styles.tabBar, {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border
        }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              currentScreen === 'tasks' && { 
                borderTopWidth: 2,
                borderTopColor: theme.colors.primary 
              }
            ]}
            onPress={() => setCurrentScreen('tasks')}
          >
            <Text style={styles.tabIcon}>
              📋
            </Text>
            <Text style={[
              styles.tabLabel,
              { color: theme.colors.textSecondary },
              currentScreen === 'tasks' && {
                color: theme.colors.primary,
                fontWeight: '600'
              }
            ]}>
              Tasks
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              currentScreen === 'garden' && { 
                borderTopWidth: 2,
                borderTopColor: theme.colors.primary 
              }
            ]}
            onPress={() => setCurrentScreen('garden')}
          >
            <Text style={styles.tabIcon}>
              🍅
            </Text>
            <Text style={[
              styles.tabLabel,
              { color: theme.colors.textSecondary },
              currentScreen === 'garden' && {
                color: theme.colors.primary,
                fontWeight: '600'
              }
            ]}>
              Garden
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              currentScreen === 'profile' && { 
                borderTopWidth: 2,
                borderTopColor: theme.colors.primary 
              }
            ]}
            onPress={() => setCurrentScreen('profile')}
          >
            <Text style={styles.tabIcon}>
              👤
            </Text>
            <Text style={[
              styles.tabLabel,
              { color: theme.colors.textSecondary },
              currentScreen === 'profile' && {
                color: theme.colors.primary,
                fontWeight: '600'
              }
            ]}>
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: spacing.xs / 2,
  },
  tabLabel: {
    ...typography.caption,
  },
});
