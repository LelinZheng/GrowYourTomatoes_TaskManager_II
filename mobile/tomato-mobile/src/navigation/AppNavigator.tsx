import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { TaskListScreen } from '../screens/tasks/TaskListScreen';
import { CreateTaskScreen } from '../screens/tasks/CreateTaskScreen';
import { EditTaskScreen } from '../screens/tasks/EditTaskScreen';
import { GardenScreen } from '../screens/main/GardenScreen';
import { Task } from '../types/Task';
import { colors } from '../styles/colors';
import { spacing } from '../styles/spacing';
import { typography } from '../styles/typography';
import { useTasks } from '../hooks/useTasks';

type Screen = 'tasks' | 'garden' | 'profile' | 'create-task' | 'edit-task';

export const AppNavigator: React.FC = () => {
  const { signOut, user } = useAuth();
  const { tasks } = useTasks();
  const insets = useSafeAreaInsets();
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
          <SafeAreaView style={[styles.profileContainer, { paddingTop: insets.top + spacing.sm }]} edges={['top', 'left', 'right']}>
            {/* Header with Logout */}
            <View style={styles.profileHeader}>
              <Text style={styles.profileTitle}>Profile</Text>
            </View>

            {/* Avatar + Username */}
            <View style={styles.profileCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user ? (user.username || user.email || '?').slice(0, 1).toUpperCase() : '?'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.profileName}>{user?.username || user?.email}</Text>
                <Text style={styles.profileSubtitle}>Keep growing your tomatoes — one task at a time.</Text>
              </View>
            </View>

            {/* Details */}
            {user && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue}>{user.email}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Join Date</Text>
                  <Text style={styles.detailValue}>{new Date(user.createdAt).toLocaleDateString()}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tomatoes Earned</Text>
                  <Text style={styles.detailValue}>{totalTomatoes}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Theme</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                    <Text style={styles.detailValue}>{darkMode ? 'Dark' : 'Light'}</Text>
                    <Switch value={darkMode} onValueChange={setDarkMode} />
                  </View>
                </View>
              </>
            )}

            {/* Logout button (secondary) */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Sign out</Text>
            </TouchableOpacity>
          </SafeAreaView>
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
    fontSize: 42,
    marginBottom: spacing.md,
  },
  comingSoonSubtitle: {
    ...typography.body,
    color: colors.gray600,
    textAlign: 'center',
  },
  // Profile styles
  profileContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  profileTitle: {
    ...typography.h2,
    color: colors.gray900,
  },
  // removed logout link (we keep primary Sign out button below)
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.h3,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  profileName: {
    ...typography.h4,
    color: colors.gray900,
  },
  profileSubtitle: {
    ...typography.bodySmall,
    color: colors.gray600,
    marginTop: spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.gray500,
  },
  detailValue: {
    ...typography.body,
    color: colors.gray800,
  },
  logoutButton: {
    backgroundColor: colors.danger,
    paddingVertical: spacing.md,
    borderRadius: 8,
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
