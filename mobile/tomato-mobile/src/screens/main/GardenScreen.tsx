import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GardenCanvas } from '../../components/garden/GardenCanvas';
import { PunishmentSummary } from '../../components/garden/PunishmentSummary';
import { useGarden } from '../../hooks/useGarden';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

export const GardenScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { tomatoCount, punishments, isLoading, refreshGarden } = useGarden();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showTomatoToast, setShowTomatoToast] = useState(false);
  const [showResolveToast, setShowResolveToast] = useState(false);

  const prevTomatoesRef = useRef<number>(0);
  const prevPunishmentsRef = useRef<number>(0);

  // Fetch on mount
  useEffect(() => {
    refreshGarden();
  }, [refreshGarden]);

  // Trigger +1 tomato toast when count increases
  useEffect(() => {
    if (tomatoCount > prevTomatoesRef.current) {
      setShowTomatoToast(true);
      const timer = setTimeout(() => setShowTomatoToast(false), 900);
      return () => clearTimeout(timer);
    }
    prevTomatoesRef.current = tomatoCount;
  }, [tomatoCount]);

  // Trigger punishment resolved toast when count decreases
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
  const fogCount = activePunishments.filter((p) => p.type === 'FOG').length;
  const weedsCount = activePunishments.filter((p) => p.type === 'WEEDS').length;
  const leavesCount = activePunishments.filter((p) => p.type === 'WILTED_LEAVES').length;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.md, paddingTop: spacing.md + insets.top, paddingBottom: spacing.xl + insets.bottom }}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.title}>My Garden</Text>

      {isLoading && !punishments.length ? (
        <View style={styles.loader}><ActivityIndicator /></View>
      ) : (
        <>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Tomatoes</Text>
              <Text style={styles.statValue}>{tomatoCount}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Punishments</Text>
              <Text style={styles.statValue}>{activePunishments.length}</Text>
              <Text style={styles.statHint}>Fog {fogCount} · Weeds {weedsCount} · Leaves {leavesCount}</Text>
            </View>
          </View>

          <PunishmentSummary punishments={activePunishments} />

          <GardenCanvas
            tomatoes={tomatoCount}
            punishments={activePunishments}
            showTomatoToast={showTomatoToast}
            showResolveToast={showResolveToast}
          />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.gray800,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  statLabel: {
    color: colors.gray500,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.gray800,
  },
  statHint: {
    marginTop: 4,
    color: colors.gray500,
    fontSize: 12,
  },
  loader: {
    paddingVertical: spacing.lg,
  },
});
