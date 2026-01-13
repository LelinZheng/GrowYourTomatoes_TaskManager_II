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
import { useTasks } from '../../hooks/useTasks';
import { TaskCard } from '../../components/tasks/TaskCard';
import { Task } from '../../types/Task';
import { colors } from '../../styles/colors';
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
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
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
  }, [deleteTask]);

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
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.headerTitle}>Tomato Tasks 🍅</Text>
        <TouchableOpacity style={styles.createButton} onPress={onCreateTask}>
          <Text style={styles.createButtonText}>+ Create</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'active' && styles.filterButtonActive]}
          onPress={() => setFilter('active')}
        >
          <Text style={[styles.filterText, filter === 'active' && styles.filterTextActive]}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sort */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <TouchableOpacity
          style={[styles.sortButton, sort === 'priority' && styles.sortButtonActive]}
          onPress={() => setSort('priority')}
        >
          <Text style={[styles.sortText, sort === 'priority' && styles.sortTextActive]}>
            Priority
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sort === 'created_asc' && styles.sortButtonActive]}
          onPress={() => setSort('created_asc')}
        >
          <Text style={[styles.sortText, sort === 'created_asc' && styles.sortTextActive]}>
            Oldest
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sort === 'created_desc' && styles.sortButtonActive]}
          onPress={() => setSort('created_desc')}
        >
          <Text style={[styles.sortText, sort === 'created_desc' && styles.sortTextActive]}>
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
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📝</Text>
            <Text style={styles.emptyTitle}>No tasks found</Text>
            <Text style={styles.emptySubtitle}>
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
    backgroundColor: colors.backgroundGray,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.gray600,
    marginTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.primary,
  },
  createButton: {
    backgroundColor: colors.actionGreen,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 6,
  },
  createButtonText: {
    ...typography.button,
    color: colors.white,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.white,
  },
  filterButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.actionBlue,
    borderColor: colors.actionBlue,
  },
  filterText: {
    ...typography.button,
    color: colors.gray700,
  },
  filterTextActive: {
    color: colors.white,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sortLabel: {
    ...typography.body,
    color: colors.gray600,
  },
  sortButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortButtonActive: {
    backgroundColor: colors.gray100,
    borderColor: colors.gray300,
  },
  sortText: {
    ...typography.caption,
    color: colors.gray600,
  },
  sortTextActive: {
    color: colors.gray900,
    fontWeight: '600',
  },
  listContent: {
    padding: spacing.md,
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
    color: colors.gray900,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.gray600,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
