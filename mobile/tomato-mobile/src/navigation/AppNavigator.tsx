import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { TaskListScreen } from '../screens/tasks/TaskListScreen';
import { CreateTaskScreen } from '../screens/tasks/CreateTaskScreen';
import { EditTaskScreen } from '../screens/tasks/EditTaskScreen';
import { Task } from '../types/Task';
import { colors } from '../styles/colors';
import { spacing } from '../styles/spacing';
import { typography } from '../styles/typography';

type Screen = 'tasks' | 'garden' | 'profile' | 'create-task' | 'edit-task';

export const AppNavigator: React.FC = () => {
  const { signOut, user } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('tasks');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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
        return (
          <View style={styles.centerContainer}>
            <Text style={styles.comingSoon}>🍅 Garden View</Text>
            <Text style={styles.comingSoonSubtitle}>Coming soon in Phase 3</Text>
          </View>
        );
      case 'profile':
        return (
          <View style={styles.centerContainer}>
            <Text style={styles.title}>Profile</Text>
            {user && (
              <Text style={styles.userInfo}>
                {user.email || user.username}
              </Text>
            )}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
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
              ✓
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.gray900,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  userInfo: {
    ...typography.body,
    color: colors.gray600,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  comingSoon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  comingSoonSubtitle: {
    ...typography.body,
    color: colors.gray600,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: colors.danger,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  logoutButtonText: {
    ...typography.button,
    color: colors.white,
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
    fontSize: 24,
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
