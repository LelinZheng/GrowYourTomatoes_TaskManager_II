import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { TaskListScreen } from '../screens/tasks/TaskListScreen';
import { CreateTaskScreen } from '../screens/tasks/CreateTaskScreen';
import { EditTaskScreen } from '../screens/tasks/EditTaskScreen';
import { GardenScreen } from '../screens/main/GardenScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { Task } from '../types/Task';
import { colors } from '../styles/colors';
import { spacing } from '../styles/spacing';
import { typography } from '../styles/typography';
import { useTasks } from '../hooks/useTasks';

type Screen = 'tasks' | 'garden' | 'profile' | 'create-task' | 'edit-task';

export const AppNavigator: React.FC = () => {
  const { signOut } = useAuth();
  const { tasks } = useTasks();
  const [currentScreen, setCurrentScreen] = useState<Screen>('tasks');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [darkMode, setDarkMode] = useState(false);

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
            darkMode={darkMode}
            onToggleDarkMode={setDarkMode}
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
      
      {/* Bottom Tab Bar */}
      {currentScreen !== 'create-task' && currentScreen !== 'edit-task' && (
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, currentScreen === 'tasks' && styles.tabActive]}
            onPress={() => setCurrentScreen('tasks')}
          >
            <Text style={[styles.tabIcon, currentScreen === 'tasks' && styles.tabIconActive]}>
              📋
            </Text>
            <Text style={[styles.tabLabel, currentScreen === 'tasks' && styles.tabLabelActive]}>
              Tasks
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, currentScreen === 'garden' && styles.tabActive]}
            onPress={() => setCurrentScreen('garden')}
          >
            <Text style={[styles.tabIcon, currentScreen === 'garden' && styles.tabIconActive]}>
              🍅
            </Text>
            <Text style={[styles.tabLabel, currentScreen === 'garden' && styles.tabLabelActive]}>
              Garden
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, currentScreen === 'profile' && styles.tabActive]}
            onPress={() => setCurrentScreen('profile')}
          >
            <Text style={[styles.tabIcon, currentScreen === 'profile' && styles.tabIconActive]}>
              👤
            </Text>
            <Text style={[styles.tabLabel, currentScreen === 'profile' && styles.tabLabelActive]}>
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
    backgroundColor: colors.backgroundGray,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
    shadowColor: colors.black,
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
  tabActive: {
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: spacing.xs / 2,
  },
  tabIconActive: {
    // Icons don't change color in this simple version
  },
  tabLabel: {
    ...typography.caption,
    color: colors.gray600,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});
