import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTasks } from '../../hooks/useTasks';
import { CreateTaskRequest } from '../../types/Task';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';

interface CreateTaskScreenProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

export const CreateTaskScreen: React.FC<CreateTaskScreenProps> = ({ onBack, onSuccess }) => {
  const { createTask } = useTasks();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [dueTime, setDueTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Task title is required');
      return;
    }

    // Validate due time format if provided
    if (dueTime.trim()) {
      const date = new Date(dueTime);
      if (isNaN(date.getTime())) {
        Alert.alert('Error', 'Invalid date format. Use: YYYY-MM-DD HH:MM');
        return;
      }
    }

    setIsLoading(true);
    try {
      const taskData: CreateTaskRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueTime: dueTime.trim() ? new Date(dueTime).toISOString() : undefined,
        timeBombEnabled: !!dueTime.trim(),
      };

      await createTask(taskData);
      Alert.alert('Success', 'Task created successfully!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setDueTime('');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.md }]}>
        {/* Header */}
        <View style={styles.header}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>Create Task</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter task title"
              placeholderTextColor={colors.gray400}
              value={title}
              onChangeText={setTitle}
              editable={!isLoading}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add details about this task..."
              placeholderTextColor={colors.gray400}
              value={description}
              onChangeText={setDescription}
              editable={!isLoading}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Priority *</Text>
            <View style={styles.priorityButtons}>
              <TouchableOpacity
                style={[
                  styles.priorityButton,
                  priority === 'LOW' && styles.priorityButtonActive,
                  { borderColor: colors.priorityLow },
                ]}
                onPress={() => setPriority('LOW')}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.priorityButtonText,
                    priority === 'LOW' && { color: colors.white },
                  ]}
                >
                  Low
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.priorityButton,
                  priority === 'MEDIUM' && styles.priorityButtonActive,
                  { borderColor: colors.priorityMedium },
                ]}
                onPress={() => setPriority('MEDIUM')}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.priorityButtonText,
                    priority === 'MEDIUM' && { color: colors.white },
                  ]}
                >
                  Medium
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.priorityButton,
                  priority === 'HIGH' && styles.priorityButtonActive,
                  { borderColor: colors.priorityHigh },
                ]}
                onPress={() => setPriority('HIGH')}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.priorityButtonText,
                    priority === 'HIGH' && { color: colors.white },
                  ]}
                >
                  High
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Due Time (optional)</Text>
            <Text style={styles.helperText}>Format: YYYY-MM-DD HH:MM (e.g., 2026-01-15 14:30)</Text>
            <TextInput
              style={styles.input}
              placeholder="2026-01-15 14:30"
              placeholderTextColor={colors.gray400}
              value={dueTime}
              onChangeText={setDueTime}
              editable={!isLoading}
            />
            {dueTime.trim() && (
              <Text style={styles.timeBombNote}>
                ⏰ Time bomb will be enabled for this task
              </Text>
            )}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.createButton, isLoading && styles.buttonDisabled]}
            onPress={handleCreate}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Create Task</Text>
            )}
          </TouchableOpacity>

          {onBack && (
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onBack}
              disabled={isLoading}
            >
              <Text style={[styles.buttonText, { color: colors.gray700 }]}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  backButton: {
    marginBottom: spacing.sm,
  },
  backButtonText: {
    ...typography.body,
    color: colors.actionBlue,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.primary,
  },
  form: {
    marginBottom: spacing.xl,
  },
  fieldContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.sm,
  },
  helperText: {
    ...typography.caption,
    color: colors.gray500,
    marginBottom: spacing.xs,
  },
  timeBombNote: {
    ...typography.caption,
    color: colors.warning,
    marginTop: spacing.xs,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.gray900,
  },
  textArea: {
    minHeight: 100,
    paddingTop: spacing.sm,
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  priorityButtonActive: {
    backgroundColor: colors.gray800,
  },
  priorityButtonText: {
    ...typography.button,
    color: colors.gray700,
  },
  actions: {
    gap: spacing.md,
  },
  button: {
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: colors.actionGreen,
  },
  cancelButton: {
    backgroundColor: colors.gray200,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...typography.button,
    color: colors.white,
  },
});
