import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { Task } from '../../types/Task';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';
import { formatters } from '../../utils/formatters';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

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
          {/* Delete X icon in top-right corner */}
          <TouchableOpacity
            style={styles.deleteIcon}
            onPress={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            accessibilityLabel="Delete task"
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.deleteIconText, { color: theme.colors.textSecondary }]}>✕</Text>
          </TouchableOpacity>

          {/* Row 1: Priority badge (top-left) */}
          <View style={styles.row1}>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
              <Text style={styles.priorityText}>{task.priority}</Text>
            </View>
          </View>

          {/* Row 2: Title (single line with ellipsis) */}
          <Text 
            style={[
              styles.title,
              { color: theme.colors.text },
              task.completed && { 
                textDecorationLine: 'line-through',
                color: theme.colors.textTertiary 
              }
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {task.title}
          </Text>

          {/* Row 3: Due time on left, Complete button on right */}
          <View style={styles.row3}>
            <View style={styles.leftInfo}>
              {task.dueTime && (
                <Text style={[
                  styles.dueTime,
                  { color: theme.colors.textSecondary },
                  task.expired && { 
                    color: theme.colors.danger,
                    fontWeight: '600' 
                  }
                ]}>
                  ⏰ {formatters.formatRelativeDueTime(task.dueTime)}
                </Text>
              )}
              {task.expired && (
                <Text style={[styles.expiredLabel, { color: theme.colors.danger }]}>
                  EXPIRED
                </Text>
              )}
            </View>
            
            {!task.completed && (
              <TouchableOpacity
                style={[styles.completeButton, { backgroundColor: theme.colors.actionBlue }]}
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
    borderRadius: 4,
    padding: spacing.xs,
    paddingTop: spacing.sm,
    marginBottom: 2,
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 0.5,
    position: 'relative',
  },
  deleteIcon: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  deleteIconText: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 18,
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  row3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 3,
  },
  leftInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    paddingRight: 32,
  },
  dueTime: {
    fontSize: 12,
  },
  expiredLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  completeButton: {
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: 3,
    alignItems: 'center',
    minWidth: 70,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  swipeAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    marginBottom: 2,
  },
  swipeActionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
});

