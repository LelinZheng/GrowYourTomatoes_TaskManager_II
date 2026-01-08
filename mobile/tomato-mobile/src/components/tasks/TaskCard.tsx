import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '../../types/Task';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onEdit, onDelete }) => {
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'HIGH':
        return colors.priorityHigh;
      case 'MEDIUM':
        return colors.priorityMedium;
      case 'LOW':
        return colors.priorityLow;
      default:
        return colors.gray500;
    }
  };

  return (
    <View style={[styles.card, task.completed && styles.cardCompleted]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, task.completed && styles.titleCompleted]}>
            {task.title}
          </Text>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
            <Text style={styles.priorityText}>{task.priority}</Text>
          </View>
        </View>
        {task.description && (
          <Text style={[styles.description, task.completed && styles.descriptionCompleted]} numberOfLines={2}>
            {task.description}
          </Text>
        )}
        {task.dueTime && (
          <View style={styles.dueTimeContainer}>
            <Text style={[styles.dueTime, task.expired && styles.dueTimeExpired]}>
              ⏰ Due: {new Date(task.dueTime).toLocaleString()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {!task.completed && (
          <TouchableOpacity
            style={[styles.button, styles.completeButton]}
            onPress={() => onComplete(task.id)}
          >
            <Text style={styles.buttonText}>Complete</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => onEdit(task)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => onDelete(task.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardCompleted: {
    backgroundColor: colors.gray50,
    opacity: 0.7,
  },
  header: {
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h3,
    color: colors.gray900,
    flex: 1,
    marginRight: spacing.sm,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.gray500,
  },
  description: {
    ...typography.body,
    color: colors.gray600,
  },
  descriptionCompleted: {
    color: colors.gray400,
  },
  dueTimeContainer: {
    marginTop: spacing.xs,
  },
  dueTime: {
    ...typography.caption,
    color: colors.gray600,
  },
  dueTimeExpired: {
    color: colors.danger,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 4,
  },
  priorityText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 6,
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: colors.actionBlue,
  },
  editButton: {
    backgroundColor: colors.actionYellow,
  },
  deleteButton: {
    backgroundColor: colors.actionRed,
  },
  buttonText: {
    ...typography.button,
    color: colors.white,
  },
});
