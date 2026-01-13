import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Switch } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';
import { validation } from '../../utils/validation';

interface ProfileScreenProps {
  totalTomatoes: number;
  darkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
  onLogout: () => Promise<void>;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  totalTomatoes,
  darkMode,
  onToggleDarkMode,
  onLogout,
}) => {
  const { user, updateUsername } = useAuth();
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
      style={[styles.container, { paddingTop: insets.top + spacing.sm, paddingBottom: spacing.lg }]}
      edges={['top', 'left', 'right']}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <TouchableOpacity style={styles.profileCard} activeOpacity={0.8} onPress={() => setShowEditor(true)}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>{user?.username || user?.email}</Text>
          <Text style={styles.profileSubtitle}>Keep growing your tomatoes — one task at a time.</Text>
          <Text style={styles.editHint}>Tap to edit username</Text>
        </View>
      </TouchableOpacity>

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
              <Switch value={darkMode} onValueChange={onToggleDarkMode} />
            </View>
          </View>
        </>
      )}

      {showEditor ? (
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.sectionTitle}>Update Username</Text>
            <TouchableOpacity onPress={() => setShowEditor(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSubtitle}>Choose a unique handle to personalize your garden.</Text>

          <TextInput
            style={[styles.input, error && styles.inputError]}
            value={username}
            onChangeText={setUsername}
            placeholder="your_username"
            placeholderTextColor={colors.gray400}
            autoCapitalize="none"
            editable={!isSaving}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {success ? <Text style={styles.successText}>{success}</Text> : null}

          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <ActivityIndicator color={colors.white} /> : <Text style={styles.saveButtonText}>Save</Text>}
          </TouchableOpacity>
        </View>
      ) : null}

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>Sign out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
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
    color: colors.gray900,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
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
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.h2,
    color: colors.white,
  },
  profileName: {
    ...typography.h3,
    color: colors.gray900,
  },
  profileSubtitle: {
    ...typography.body,
    color: colors.gray600,
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  detailLabel: {
    ...typography.body,
    color: colors.gray600,
  },
  detailValue: {
    ...typography.body,
    color: colors.gray900,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: colors.white,
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
    color: colors.gray900,
  },
  sectionSubtitle: {
    ...typography.body,
    color: colors.gray600,
  },
  cancelText: {
    ...typography.body,
    color: colors.gray600,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.gray900,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
  },
  successText: {
    ...typography.caption,
    color: colors.actionGreen,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.white,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  logoutButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: colors.gray900,
  },
  logoutButtonText: {
    ...typography.button,
    color: colors.white,
  },
  editHint: {
    ...typography.caption,
    color: colors.gray500,
    marginTop: 6,
  },
});
