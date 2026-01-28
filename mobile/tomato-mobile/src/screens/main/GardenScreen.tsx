import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GardenCanvas } from '../../components/garden/GardenCanvas';
import { PunishmentSummary } from '../../components/garden/PunishmentSummary';
import { useGarden } from '../../hooks/useGarden';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../styles/spacing';

export const GardenScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { tomatoCount, punishments, isLoading, refreshGarden } = useGarden();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showTomatoToast, setShowTomatoToast] = useState(false);
  const [showResolveToast, setShowResolveToast] = useState(false);

  const prevTomatoesRef = useRef<number>(0);
  const prevPunishmentsRef = useRef<number>(0);

  useEffect(() => {
    refreshGarden();
  }, [refreshGarden]);

  useEffect(() => {
    if (tomatoCount > prevTomatoesRef.current) {
      setShowTomatoToast(true);
      const timer = setTimeout(() => setShowTomatoToast(false), 900);
      return () => clearTimeout(timer);
    }
    prevTomatoesRef.current = tomatoCount;
  }, [tomatoCount]);

  useEffect(() => {
    const punishmentCount = punishments.filter((p) => !p.resolved).length;
    if (punishmentCount < prevPunishmentsRef.current) {
      setShowResolveToast(true);
      const timer = setTimeout(() => setShowResolveToast(false), 900);
      return () => clearTimeout(timer);
    }
    prevPunishmentsRef.current = punishmentCount;
  }, [punishments]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refreshGarden();
    setIsRefreshing(false);
  }, [refreshGarden]);

  const activePunishments = punishments.filter((p) => !p.resolved);
  const title = user?.username ? `${user.username}'s Garden` : 'My Garden';

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: theme.colors.background,
          paddingTop: spacing.md + insets.top,
          paddingBottom: spacing.xs + insets.bottom,
        },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>

      {isLoading && !punishments.length ? (
        <View style={styles.loader}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : (
        <>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Tomatoes</Text>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>{tomatoCount}</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Punishments</Text>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>{activePunishments.length}</Text>
            </View>
          </View>

          <PunishmentSummary punishments={activePunishments} />

          {/* IMPORTANT: fixed-height viewport so GardenCanvas can pin the soil */}
          <View style={styles.gardenViewport}>
            <GardenCanvas
              tomatoes={tomatoCount}
              punishments={activePunishments}
              showTomatoToast={showTomatoToast}
              showResolveToast={showResolveToast}
              refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  statLabel: {
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  loader: {
    paddingVertical: spacing.lg,
  },
  gardenViewport: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#e5f7e2',
  },
});
