import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Punishment, PunishmentType } from '../../types/Punishment';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../styles/spacing';

interface PunishmentSummaryProps {
  punishments: Punishment[];
}

const punishmentLabels: Record<PunishmentType, { label: string; emoji?: string; icon?: any }> = {
  FOG: { label: 'Fog', emoji: '🌫️' },
  WEEDS: { label: 'Weeds', icon: require('../../assets/images/grass.png') },
  WILTED_LEAVES: { label: 'Leaves', emoji: '🍂' },
  BUG: { label: 'Bugs', emoji: '🐛' },
  FUNGUS: { label: 'Fungus', emoji: '🍄' },
};

export const PunishmentSummary: React.FC<PunishmentSummaryProps> = ({ punishments }) => {
  const { theme } = useTheme();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Group and count by type (backend resolves oldest-first by createdAt, not by type)
  const grouped = new Map<PunishmentType, { count: number; oldestCreatedAt: string }>();
  punishments.forEach((p) => {
    const existing = grouped.get(p.type);
    if (existing) {
      existing.count++;
      // Keep track of oldest createdAt for this type
      if (p.createdAt < existing.oldestCreatedAt) {
        existing.oldestCreatedAt = p.createdAt;
      }
    } else {
      grouped.set(p.type, { count: 1, oldestCreatedAt: p.createdAt });
    }
  });

  if (grouped.size === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>🎉 No active punishments — hooray!</Text>
      </View>
    );
  }

  // Sort grouped entries by oldest createdAt to show which type will be resolved first
  const sortedGroups = Array.from(grouped.entries()).sort(
    ([, a], [, b]) => a.oldestCreatedAt.localeCompare(b.oldestCreatedAt)
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.textSecondary }]}>Active Punishments:</Text>
      <View style={styles.iconRow}>
        {sortedGroups.map(([type, { count }]) => {
          const info = punishmentLabels[type];
          return (
            <View key={type} style={styles.iconWrapper}>
              <TouchableOpacity
                style={styles.icon}
                onPress={() => setHoveredId(hoveredId === (type as any) ? null : (type as any))}
              >
                {info.icon ? (
                  <Image source={info.icon} style={styles.weedIcon} resizeMode="contain" />
                ) : (
                  <Text style={styles.emoji}>{info.emoji}</Text>
                )}
                {count > 1 && (
                  <Text style={[styles.badge, { backgroundColor: theme.colors.danger, color: theme.colors.white }]}>
                    {count}
                  </Text>
                )}
              </TouchableOpacity>
              {hoveredId === (type as any) && (
                <View style={[styles.tooltip, { backgroundColor: theme.colors.textSecondary }]}>
                  <Text style={[styles.tooltipText, { color: theme.colors.white }]} numberOfLines={1} ellipsizeMode="clip">
                    {info.label}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  icon: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 32,
  },
  weedIcon: {
    width: 36,
    height: 36,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    borderRadius: 10,
    width: 20,
    height: 20,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
  tooltip: {
    position: 'absolute',
    top: -28,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    zIndex: 100,
  },
  tooltipText: {
    fontSize: 9,
    lineHeight: 11,
    fontWeight: '500',
    minWidth: 44,
    maxWidth: 56,
    textAlign: 'center',
  },
  emptyContainer: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});
