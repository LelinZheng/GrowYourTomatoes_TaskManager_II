import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTasks } from '../../hooks/useTasks';
import { TaskCard } from '../../components/tasks/TaskCard';
import { Task } from '../../types/Task';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';
import { gardenService } from '../../services/garden.service';
import { Punishment } from '../../types/Punishment';

type FilterType = 'all' | 'active' | 'completed';
type SortType = 'priority' | 'created_desc' | 'created_asc';

interface TaskListScreenProps {
  onCreateTask?: () => void;
  onEditTask?: (task: Task) => void;
}

export const TaskListScreen: React.FC<TaskListScreenProps> = ({ onCreateTask, onEditTask }) => {
  const { tasks, isLoading, refreshTasks, completeTask, deleteTask } = useTasks();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<FilterType>('active');
  const [sort, setSort] = useState<SortType>('priority');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refreshTasks();
    setIsRefreshing(false);
  }, [refreshTasks]);

  const handleComplete = useCallback(async (taskId: number) => {
    try {
      // Trigger haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Get active punishments BEFORE completing
      let beforeList: Punishment[] | null = null;
      try {
        beforeList = await gardenService.getActivePunishments();
      } catch {}

      // Complete the task
      await completeTask(taskId);

      // Get active punishments AFTER completing
      let afterList: Punishment[] | null = null;
      try {
        afterList = await gardenService.getActivePunishments();
      } catch {}

      // Decide message: if punishments decreased, find which one was resolved
      let message = '🍅 Task completed! +1 Tomato';
      if (beforeList && afterList && afterList.length < beforeList.length) {
        const afterIds = new Set(afterList.map((p) => p.id));
        const resolved = beforeList.find((p) => !afterIds.has(p.id));
        const emojiMap: Record<string, string> = {
          FOG: '🌫️',
          WEEDS: '🌿',
          WILTED_LEAVES: '🍂',
          BUG: '🐛',
          FUNGUS: '🍄',
        };
        const labelMap: Record<string, string> = {
          FOG: 'Fog',
          WEEDS: 'Weeds',
          WILTED_LEAVES: 'Wilted Leaves',
          BUG: 'Bug',
          FUNGUS: 'Fungus',
        };
        if (resolved) {
          const emoji = emojiMap[resolved.type] ?? '🧹';
          const label = labelMap[resolved.type] ?? 'Punishment';
          message = `🧹 Resolved ${emoji} ${label}`;
        } else {
          message = '🧹 Punishment resolved';
        }
      }

      Alert.alert('Success', message);
    } catch (error) {
      Alert.alert('Error', 'Failed to complete task');
    }
  }, [completeTask]);

  const handleDelete = useCallback((taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    
    let message = 'Are you sure you want to delete this task?';
    
    if (task && task.completed) {
      if ((task.tomatoesEarned ?? 0) > 0) {
        message = 'This completed task earned you 1 tomato.\n\nDeleting it will remove 1 tomato from your total. Continue?';
      } else {
        message = 'This completed task did not earn a tomato (it resolved a punishment).\n\nDeleting it won\'t change your tomatoes. Continue?';
      }
    }
    
    Alert.alert(
      'Delete Task',
      message,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(taskId);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ]
    );
  }, [deleteTask, tasks]);

  const getFilteredTasks = useCallback(() => {
    let filtered = [...tasks];

    // Apply filter
    switch (filter) {
      case 'active':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      // 'all' shows everything
    }

    // Apply sort
    if (sort === 'priority') {
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      filtered.sort((a, b) => {
        const aOrder = priorityOrder[a.priority] ?? 3;
        const bOrder = priorityOrder[b.priority] ?? 3;
        return aOrder - bOrder;
      });
    } else if (sort === 'created_desc') {
      filtered.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      filtered.sort((a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    return filtered;
  }, [tasks, filter, sort]);

  const filteredTasks = getFilteredTasks();

  if (isLoading && tasks.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.backgroundSecondary }]} edges={['top', 'left', 'right']}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Loading tasks...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.backgroundSecondary }]} edges={['left', 'right', 'bottom']}>
      {/* Header */}
      <View style={[styles.header, { 
        paddingTop: insets.top + spacing.md,
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.border 
      }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.primary }]}>Tomato Tasks 🍅</Text>
        <TouchableOpacity 
          style={[styles.createButton, { backgroundColor: theme.colors.actionGreen }]} 
          onPress={onCreateTask}
        >
          <Text style={[styles.createButtonText, { color: theme.colors.white }]}>+ Create</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={[styles.filters, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { borderColor: theme.colors.border },
            filter === 'all' && { 
              backgroundColor: theme.colors.actionBlue,
              borderColor: theme.colors.actionBlue 
            }
          ]}
          onPress={() => setFilter('all')}
        >
          <Text style={[
            styles.filterText,
            { color: theme.colors.text },
            filter === 'all' && { color: theme.colors.white }
          ]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { borderColor: theme.colors.border },
            filter === 'active' && { 
              backgroundColor: theme.colors.actionBlue,
              borderColor: theme.colors.actionBlue 
            }
          ]}
          onPress={() => setFilter('active')}
        >
          <Text style={[
            styles.filterText,
            { color: theme.colors.text },
            filter === 'active' && { color: theme.colors.white }
          ]}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { borderColor: theme.colors.border },
            filter === 'completed' && { 
              backgroundColor: theme.colors.actionBlue,
              borderColor: theme.colors.actionBlue 
            }
          ]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[
            styles.filterText,
            { color: theme.colors.text },
            filter === 'completed' && { color: theme.colors.white }
          ]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sort */}
      <View style={[styles.sortRow, { 
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.border 
      }]}>
        <Text style={[styles.sortLabel, { color: theme.colors.textSecondary }]}>Sort by:</Text>
        <TouchableOpacity
          style={[
            styles.sortButton,
            { borderColor: theme.colors.border },
            sort === 'priority' && {
              backgroundColor: theme.colors.backgroundSecondary,
              borderColor: theme.colors.borderDark
            }
          ]}
          onPress={() => setSort('priority')}
        >
          <Text style={[
            styles.sortText,
            { color: theme.colors.textSecondary },
            sort === 'priority' && { 
              color: theme.colors.text,
              fontWeight: '600' 
            }
          ]}>
            Priority
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            { borderColor: theme.colors.border },
            sort === 'created_asc' && {
              backgroundColor: theme.colors.backgroundSecondary,
              borderColor: theme.colors.borderDark
            }
          ]}
          onPress={() => setSort('created_asc')}
        >
          <Text style={[
            styles.sortText,
            { color: theme.colors.textSecondary },
            sort === 'created_asc' && { 
              color: theme.colors.text,
              fontWeight: '600' 
            }
          ]}>
            Oldest
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            { borderColor: theme.colors.border },
            sort === 'created_desc' && {
              backgroundColor: theme.colors.backgroundSecondary,
              borderColor: theme.colors.borderDark
            }
          ]}
          onPress={() => setSort('created_desc')}
        >
          <Text style={[
            styles.sortText,
            { color: theme.colors.textSecondary },
            sort === 'created_desc' && { 
              color: theme.colors.text,
              fontWeight: '600' 
            }
          ]}>
            Newest
          </Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onComplete={handleComplete}
            onEdit={onEditTask || (() => {})}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          filteredTasks.length === 0 && styles.emptyListContent,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📝</Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No tasks found</Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
              {filter === 'active' && 'Create your first task to get started!'}
              {filter === 'completed' && 'Complete some tasks to see them here'}
              {filter === 'all' && 'Create a task to start growing tomatoes!'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    marginTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
  },
  headerTitle: {
    ...typography.appTitle,
  },
  createButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  createButtonText: {
    ...typography.button,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  filterButton: {
    flex: 1,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  filterText: {
    ...typography.button,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: spacing.sm,
    borderBottomWidth: 1,
  },
  sortLabel: {
    ...typography.body,
  },
  sortButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    borderWidth: 1,
  },
  sortText: {
    ...typography.caption,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs / 2,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h2,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
