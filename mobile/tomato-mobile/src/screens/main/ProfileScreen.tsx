import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { useTheme, ThemeMode } from '../../context/ThemeContext';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';
import { validation } from '../../utils/validation';

interface ProfileScreenProps {
  totalTomatoes: number;
  onLogout: () => Promise<void>;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  totalTomatoes,
  onLogout,
}) => {
  const { user, updateUsername } = useAuth();
  const { theme, themeMode, setThemeMode } = useTheme();
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState(user?.username ?? '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    setUsername(user?.username ?? '');
  }, [user?.username]);

  const avatarLetter = useMemo(() => {
    const source = user?.username || user?.email || '?';
    return source.slice(0, 1).toUpperCase();
  }, [user?.username, user?.email]);

  const validateUsername = () => {
    const trimmed = username.trim();
    if (!trimmed) {
      return 'Username is required';
    }
    if (!validation.isValidUsername(trimmed)) {
      return 'Username must be 3+ characters (letters, numbers, underscore)';
    }
    return '';
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    const validationError = validateUsername();
    if (validationError) {
      setError(validationError);
      return;
    }

    const trimmed = username.trim();
    if (user && trimmed === user.username) {
      setSuccess('No changes to save');
      return;
    }

    try {
      setIsSaving(true);
      await updateUsername(trimmed);
      setSuccess('Username updated');
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.data) {
        const data = e.response.data as any;
        const message = data.error || data.message || 'Failed to update username';
        setError(message);
      } else {
        const message = e instanceof Error ? e.message : 'Failed to update username';
        setError(message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { 
        backgroundColor: theme.colors.backgroundSecondary,
        paddingTop: insets.top + spacing.sm, 
        paddingBottom: spacing.lg 
      }]}
      edges={['top', 'left', 'right']}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Profile</Text>
      </View>

      <TouchableOpacity 
        style={[styles.profileCard, {
          backgroundColor: theme.colors.surface
        }]} 
        activeOpacity={0.8} 
        onPress={() => setShowEditor(true)}
      >
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.avatarText, { color: theme.colors.white }]}>{avatarLetter}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.profileName, { color: theme.colors.text }]}>
            {user?.username || user?.email}
          </Text>
          <Text style={[styles.profileSubtitle, { color: theme.colors.textSecondary }]}>
            Keep growing your tomatoes — one task at a time.
          </Text>
          <Text style={[styles.editHint, { color: theme.colors.textTertiary }]}>
            Tap to edit username
          </Text>
        </View>
      </TouchableOpacity>

      {user && (
        <>
          <View style={[styles.detailRow, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Email</Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>{user.email}</Text>
          </View>
          <View style={[styles.detailRow, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Join Date</Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {new Date(user.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={[styles.detailRow, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Tomatoes Earned</Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>{totalTomatoes}</Text>
          </View>
          <View style={[styles.detailRow, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Theme</Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <TouchableOpacity
                style={[
                  styles.themeButton,
                  { borderColor: theme.colors.border },
                  themeMode === 'light' && { 
                    backgroundColor: theme.colors.actionBlue,
                    borderColor: theme.colors.actionBlue 
                  }
                ]}
                onPress={() => setThemeMode('light')}
              >
                <Text style={[
                  styles.themeButtonText,
                  { color: theme.colors.text },
                  themeMode === 'light' && { color: theme.colors.white }
                ]}>
                  ☀️ Light
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.themeButton,
                  { borderColor: theme.colors.border },
                  themeMode === 'dark' && { 
                    backgroundColor: theme.colors.actionBlue,
                    borderColor: theme.colors.actionBlue 
                  }
                ]}
                onPress={() => setThemeMode('dark')}
              >
                <Text style={[
                  styles.themeButtonText,
                  { color: theme.colors.text },
                  themeMode === 'dark' && { color: theme.colors.white }
                ]}>
                  🌙 Dark
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.themeButton,
                  { borderColor: theme.colors.border },
                  themeMode === 'auto' && { 
                    backgroundColor: theme.colors.actionBlue,
                    borderColor: theme.colors.actionBlue 
                  }
                ]}
                onPress={() => setThemeMode('auto')}
              >
                <Text style={[
                  styles.themeButtonText,
                  { color: theme.colors.text },
                  themeMode === 'auto' && { color: theme.colors.white }
                ]}>
                  🔄 Auto
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      {showEditor ? (
        <View style={[styles.formCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.formHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Update Username
            </Text>
            <TouchableOpacity onPress={() => setShowEditor(false)}>
              <Text style={[styles.cancelText, { color: theme.colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
            Choose a unique handle to personalize your garden.
          </Text>

          <TextInput
            style={[
              styles.input,
              { 
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.background,
                color: theme.colors.text 
              },
              error && { borderColor: theme.colors.danger }
            ]}
            value={username}
            onChangeText={setUsername}
            placeholder="your_username"
            placeholderTextColor={theme.colors.textTertiary}
            autoCapitalize="none"
            editable={!isSaving}
          />

          {error ? <Text style={[styles.errorText, { color: theme.colors.danger }]}>{error}</Text> : null}
          {success ? <Text style={[styles.successText, { color: theme.colors.actionGreen }]}>{success}</Text> : null}

          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: theme.colors.primary },
              isSaving && styles.buttonDisabled
            ]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color={theme.colors.white} />
            ) : (
              <Text style={[styles.saveButtonText, { color: theme.colors.white }]}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : null}

      <TouchableOpacity 
        style={[styles.logoutButton, { backgroundColor: theme.colors.actionRed }]} 
        onPress={onLogout}
      >
        <Text style={[styles.logoutButtonText, { color: theme.colors.white }]}>Sign out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.h1,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.h2,
  },
  profileName: {
    ...typography.h3,
  },
  profileSubtitle: {
    ...typography.body,
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  detailLabel: {
    ...typography.body,
  },
  detailValue: {
    ...typography.body,
    fontWeight: '700',
  },
  themeButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    borderWidth: 1,
  },
  themeButtonText: {
    ...typography.caption,
    fontWeight: '600',
  },
  formCard: {
    padding: spacing.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    gap: spacing.sm,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    ...typography.h3,
  },
  sectionSubtitle: {
    ...typography.body,
  },
  cancelText: {
    ...typography.body,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.body,
  },
  errorText: {
    ...typography.caption,
  },
  successText: {
    ...typography.caption,
  },
  saveButton: {
    paddingVertical: spacing.md,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  saveButtonText: {
    ...typography.button,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  logoutButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: 10,
  },
  logoutButtonText: {
    ...typography.button,
  },
  editHint: {
    ...typography.caption,
    marginTop: 6,
  },
});
