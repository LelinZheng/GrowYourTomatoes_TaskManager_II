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
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTasks } from '../../hooks/useTasks';
import { CreateTaskRequest } from '../../types/Task';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';

interface CreateTaskScreenProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

const toLocalDateTimeString = (date: Date) => {
  // Force seconds to 00 to match backend expectation
  const normalized = new Date(date);
  normalized.setSeconds(0, 0);
  const pad = (value: number) => String(value).padStart(2, '0');
  const year = normalized.getFullYear();
  const month = pad(normalized.getMonth() + 1);
  const day = pad(normalized.getDate());
  const hours = pad(normalized.getHours());
  const minutes = pad(normalized.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}:00`;
};

const formatDate = (date: Date) =>
  date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

const formatTime = (date: Date) =>
  date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });

export const CreateTaskScreen: React.FC<CreateTaskScreenProps> = ({ onBack, onSuccess }) => {
  const { createTask } = useTasks();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Task title is required');
      return;
    }

    // Validate due time is in the future
    if (dueDate) {
      const now = new Date();
      if (dueDate < now) {
        Alert.alert('Error', 'Due time must be in the future');
        return;
      }
    }

    setIsLoading(true);
    try {
      const taskData: CreateTaskRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        // Send local time string so backend LocalDateTime stores without timezone shifts
        dueTime: dueDate ? toLocalDateTimeString(dueDate) : undefined,
        timeBombEnabled: !!dueDate,
      };

      await createTask(taskData);
      Alert.alert('Success', 'Task created successfully!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setDueDate(null);
      
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.backgroundSecondary }]} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.md }]}>
        {/* Header */}
        <View style={styles.header}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Text style={[styles.backButtonText, { color: theme.colors.actionBlue }]}>← Back</Text>
            </TouchableOpacity>
          )}
          <Text style={[styles.headerTitle, { color: theme.colors.primary }]}>Create Task</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Title *</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                color: theme.colors.text 
              }]}
              placeholder="Enter task title"
              placeholderTextColor={theme.colors.textTertiary}
              value={title}
              onChangeText={setTitle}
              editable={!isLoading}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea, { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                color: theme.colors.text 
              }]}
              placeholder="Add details about this task..."
              placeholderTextColor={theme.colors.textTertiary}
              value={description}
              onChangeText={setDescription}
              editable={!isLoading}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Priority *</Text>
            <View style={styles.priorityButtons}>
              <TouchableOpacity
                style={[
                  styles.priorityButton,
                  { 
                    borderColor: theme.colors.priorityLow,
                    backgroundColor: theme.colors.surface 
                  },
                  priority === 'LOW' && { backgroundColor: theme.colors.gray800 },
                ]}
                onPress={() => setPriority('LOW')}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.priorityButtonText,
                    { color: theme.colors.text },
                    priority === 'LOW' && { color: theme.colors.white },
                  ]}
                >
                  Low
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.priorityButton,
                  {
                    borderColor: theme.colors.priorityMedium,
                    backgroundColor: theme.colors.surface 
                  },
                  priority === 'MEDIUM' && { backgroundColor: theme.colors.gray800 },
                ]}
                onPress={() => setPriority('MEDIUM')}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.priorityButtonText,
                    { color: theme.colors.text },
                    priority === 'MEDIUM' && { color: theme.colors.white },
                  ]}
                >
                  Medium
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.priorityButton,
                  {
                    borderColor: theme.colors.priorityHigh,
                    backgroundColor: theme.colors.surface 
                  },
                  priority === 'HIGH' && { backgroundColor: theme.colors.gray800 },
                ]}
                onPress={() => setPriority('HIGH')}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.priorityButtonText,
                    { color: theme.colors.text },
                    priority === 'HIGH' && { color: theme.colors.white },
                  ]}
                >
                  High
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Due Time (optional)</Text>
            
            <TouchableOpacity
              style={[styles.dateButton, { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border 
              }]}
              onPress={() => setShowDatePicker(true)}
              disabled={isLoading}
            >
              <Text style={[
                dueDate ? styles.dateButtonTextSelected : styles.dateButtonTextPlaceholder,
                { color: dueDate ? theme.colors.text : theme.colors.textTertiary }
              ]}>
                {dueDate ? `${formatDate(dueDate)} • ${formatTime(dueDate)}` : 'Select Date & Time'}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dueDate || new Date()}
                mode={Platform.OS === 'ios' ? 'datetime' : 'date'}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                is24Hour={false}
                minimumDate={new Date()}
                onChange={(event, selectedDate) => {
                  // Always close the date picker after a user action
                  setShowDatePicker(false);

                  if (event.type === 'set' && selectedDate) {
                    if (Platform.OS === 'ios') {
                      // iOS datetime picker already includes time
                      setDueDate(selectedDate);
                    } else if (dueDate) {
                      // Android: preserve time when selecting date
                      const newDate = new Date(selectedDate);
                      newDate.setHours(dueDate.getHours());
                      newDate.setMinutes(dueDate.getMinutes());
                      newDate.setSeconds(0);
                      newDate.setMilliseconds(0);
                      setDueDate(newDate);
                      setShowTimePicker(true);
                    } else {
                      // Android first time: seed with current time, then open time picker
                      const newDate = new Date(selectedDate);
                      const now = new Date();
                      newDate.setHours(now.getHours());
                      newDate.setMinutes(now.getMinutes());
                      newDate.setSeconds(0);
                      newDate.setMilliseconds(0);
                      setDueDate(newDate);
                      setShowTimePicker(true);
                    }
                  }
                }}
              />
            )}

            {Platform.OS === 'android' && showTimePicker && (
              <DateTimePicker
                value={dueDate || new Date()}
                mode="time"
                display="default"
                is24Hour={false}
                onChange={(event, selectedDate) => {
                  // Always close the time picker after a user action
                  setShowTimePicker(false);

                  if (event.type === 'set' && selectedDate) {
                    if (dueDate) {
                      // Preserve the date when selecting time
                      const newDate = new Date(dueDate);
                      newDate.setHours(selectedDate.getHours());
                      newDate.setMinutes(selectedDate.getMinutes());
                      newDate.setSeconds(0);
                      newDate.setMilliseconds(0);
                      setDueDate(newDate);
                    } else {
                      setDueDate(selectedDate);
                    }
                  }
                }}
              />
            )}

            {dueDate && (
              <View style={styles.selectedDateContainer}>
                <Text style={[styles.timeBombNote, { color: theme.colors.warning }]}>
                  ⏰ {formatDate(dueDate)} • {formatTime(dueDate)}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setDueDate(null);
                    setShowDatePicker(false);
                    setShowTimePicker(false);
                  }}
                  style={styles.clearButton}
                >
                  <Text style={[styles.clearButtonText, { color: theme.colors.danger }]}>Clear</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.actionGreen }, isLoading && styles.buttonDisabled]}
            onPress={handleCreate}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.colors.white} />
            ) : (
              <Text style={[styles.buttonText, { color: theme.colors.white }]}>Create Task</Text>
            )}
          </TouchableOpacity>

          {onBack && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.backgroundTertiary }]}
              onPress={onBack}
              disabled={isLoading}
            >
              <Text style={[styles.buttonText, { color: theme.colors.text }]}>Cancel</Text>
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
  },
  headerTitle: {
    ...typography.h1,
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
    marginBottom: spacing.sm,
  },
  helperText: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
  timeBombNote: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  dateButtonTextPlaceholder: {
    ...typography.body,
  },
  dateButtonTextSelected: {
    ...typography.body,
  },
  selectedDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  clearButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  clearButtonText: {
    ...typography.caption,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
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
  },
  priorityButtonText: {
    ...typography.button,
  },
  actions: {
    gap: spacing.md,
  },
  button: {
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...typography.button,
  },
});
