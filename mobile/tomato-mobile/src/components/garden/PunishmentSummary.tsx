import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Punishment, PunishmentType } from '../../types/Punishment';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

interface PunishmentSummaryProps {
  punishments: Punishment[];
}

const punishmentLabels: Record<PunishmentType, { label: string; emoji: string }> = {
  FOG: { label: 'Fog', emoji: '🌫️' },
  WEEDS: { label: 'Weeds', emoji: '🌿' },
  WILTED_LEAVES: { label: 'Wilted Leaves', emoji: '🍂' },
  BUG: { label: 'Bugs', emoji: '🐛' },
  FUNGUS: { label: 'Fungus', emoji: '🍄' },
};

export const PunishmentSummary: React.FC<PunishmentSummaryProps> = ({ punishments }) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Group and count by type
  const grouped = new Map<PunishmentType, number>();
  punishments.forEach((p) => {
    grouped.set(p.type, (grouped.get(p.type) || 0) + 1);
  });

  if (grouped.size === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>🎉 No active punishments — hooray!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active Punishments:</Text>
      <View style={styles.iconRow}>
        {Array.from(grouped.entries()).map(([type, count]) => {
          const info = punishmentLabels[type];
          return (
            <View key={type} style={styles.iconWrapper}>
              <TouchableOpacity
                style={styles.icon}
                onPress={() => setHoveredId(hoveredId === (type as any) ? null : (type as any))}
              >
                <Text style={styles.emoji}>{info.emoji}</Text>
                {count > 1 && <Text style={styles.badge}>{count}</Text>}
              </TouchableOpacity>
              {hoveredId === (type as any) && (
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipText}>{info.label}</Text>
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
    color: colors.gray700,
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
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.danger,
    color: colors.white,
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
    backgroundColor: colors.gray700,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    zIndex: 100,
  },
  tooltipText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray600,
  },
});
