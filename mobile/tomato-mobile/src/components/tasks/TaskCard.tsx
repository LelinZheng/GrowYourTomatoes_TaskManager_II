import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { Task } from '../../types/Task';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

const formatDue = (dateString: string) => {
  const date = new Date(dateString);
  const datePart = date.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });
  const timePart = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${datePart}, ${timePart}`;
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onEdit, onDelete }) => {
  const { theme } = useTheme();
  const swipeableRef = useRef<Swipeable>(null);

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'HIGH':
        return theme.colors.priorityHigh;
      case 'MEDIUM':
        return theme.colors.priorityMedium;
      case 'LOW':
        return theme.colors.priorityLow;
      default:
        return theme.colors.gray500;
    }
  };

  const handleComplete = () => {
    swipeableRef.current?.close();
    onComplete(task.id);
  };

  const handleDelete = () => {
    swipeableRef.current?.close();
    onDelete(task.id);
  };

  const handleEdit = () => {
    swipeableRef.current?.close();
    onEdit(task);
  };

  // Swipe right action - Complete (only for active tasks)
  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    if (task.completed) return null;

    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        style={[styles.swipeAction, { backgroundColor: theme.colors.actionGreen }]}
        onPress={handleComplete}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Text style={styles.swipeActionText}>✓ Complete</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  // Swipe left action - Delete
  const renderLeftActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        style={[styles.swipeAction, { backgroundColor: theme.colors.actionRed }]}
        onPress={handleDelete}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Text style={styles.swipeActionText}>🗑️ Delete</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        overshootLeft={false}
        overshootRight={false}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleEdit}
          style={[
            styles.card,
            { 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
            task.completed && { 
              backgroundColor: theme.colors.backgroundSecondary,
              opacity: 0.7 
            },
            task.expired && { 
              backgroundColor: theme.colors.primaryLight,
              borderColor: theme.colors.primary 
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={[
                styles.title,
                { color: theme.colors.text },
                task.completed && { 
                  textDecorationLine: 'line-through',
                  color: theme.colors.textTertiary 
                }
              ]}>
                {task.title}
              </Text>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
                <Text style={styles.priorityText}>{task.priority}</Text>
              </View>
            </View>
            {task.description && (
              <Text style={[
                styles.description,
                { color: theme.colors.textSecondary },
                task.completed && { color: theme.colors.textTertiary }
              ]} numberOfLines={2}>
                {task.description}
              </Text>
            )}
            {task.dueTime && (
              <View style={styles.dueTimeContainer}>
                <Text style={[
                  styles.dueTime,
                  { color: theme.colors.textSecondary },
                  task.expired && { 
                    color: theme.colors.danger,
                    fontWeight: '600' 
                  }
                ]}>
                  ⏰ Due: {formatDue(task.dueTime)}
                </Text>
                {task.expired && (
                  <Text style={[styles.expiredLabel, { color: theme.colors.danger }]}>
                    EXPIRED
                  </Text>
                )}
              </View>
            )}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.actionRed }]}
              onPress={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              <Text style={[styles.buttonText, { color: theme.colors.white }]}>
                Delete
              </Text>
            </TouchableOpacity>

            {!task.completed && (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.colors.actionBlue }]}
                onPress={(e) => {
                  e.stopPropagation();
                  handleComplete();
                }}
              >
                <Text style={[styles.buttonText, { color: theme.colors.white }]}>
                  Complete
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    padding: spacing.sm,
    marginBottom: spacing.xs,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    marginBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs / 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing.xs,
  },
  description: {
    fontSize: 11,
    lineHeight: 15,
  },
  dueTimeContainer: {
    marginTop: spacing.xs / 2,
  },
  dueTime: {
    fontSize: 12,
  },
  expiredLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: spacing.xs / 2,
  },
  priorityBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: '24%',
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 9,
    fontWeight: '600',
  },
  swipeAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    marginBottom: spacing.xs,
  },
  swipeActionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
});

