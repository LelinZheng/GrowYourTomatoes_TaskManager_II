import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Image, Dimensions } from 'react-native';
import { Punishment, PunishmentType } from '../../types/Punishment';
import { TomatoPlant } from './TomatoPlant';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

const screenWidth = Dimensions.get('window').width;
const COLS = 2;
const ROWS = 3;
const MAX_PLANTS = COLS * ROWS;
const PLANT_SIZE = (screenWidth - spacing.lg * 2 - spacing.md) / COLS;

interface GardenCanvasProps {
  tomatoes: number;
  punishments: Punishment[];
  showTomatoToast: boolean;
  showResolveToast: boolean;
}

const priorityOrder: Record<PunishmentType, number> = {
  FOG: 1,
  WEEDS: 2,
  WILTED_LEAVES: 3,
  BUG: 4,
  FUNGUS: 5,
};

export const GardenCanvas: React.FC<GardenCanvasProps> = ({ tomatoes, punishments, showTomatoToast, showResolveToast }) => {
  const plantCount = Math.max(1, Math.ceil(tomatoes / 5));
  const scrollRef = useRef<ScrollView | null>(null);

  const fogs = punishments.filter((p) => p.type === 'FOG');
  const weeds = punishments.filter((p) => p.type === 'WEEDS');
  const leaves = punishments.filter((p) => p.type === 'WILTED_LEAVES');
  const scattered = punishments.filter((p) => p.type === 'BUG' || p.type === 'FUNGUS');

  const scatterPositions = useMemo(() => {
    const map = new Map<number, { left: string; bottom: number }>();
    scattered
      .sort((a, b) => priorityOrder[a.type] - priorityOrder[b.type])
      .forEach((p) => {
        const left = `${Math.random() * 80 + 10}%`;
        const bottom = Math.random() * 40;
        map.set(p.id, { left, bottom });
      });
    return map;
  }, [scattered]);

  const tomatoToastAnim = useRef(new Animated.Value(0)).current;
  const resolveToastAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (showTomatoToast) {
      Animated.sequence([
        Animated.timing(tomatoToastAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
        Animated.timing(tomatoToastAnim, { toValue: 0, duration: 500, delay: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [showTomatoToast, tomatoToastAnim]);

  React.useEffect(() => {
    if (showResolveToast) {
      Animated.sequence([
        Animated.timing(resolveToastAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
        Animated.timing(resolveToastAnim, { toValue: 0, duration: 500, delay: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [showResolveToast, resolveToastAnim]);

  // Generate grid of plants (latest first, take up to MAX_PLANTS for first page)
  const plantIndices = Array.from({ length: Math.min(plantCount, MAX_PLANTS) }).map((_, i) => i);

  // Additional plants (if > MAX_PLANTS, show in scrollable area below)
  const additionalPlants = Math.max(0, plantCount - MAX_PLANTS);

  return (
    <ScrollView style={styles.container} scrollEventThrottle={16}>
      {fogs.map((_, idx) => (
        <View key={`fog-${idx}`} style={[styles.fogLayer, { opacity: Math.min(0.75, 0.22 + idx * 0.12) }]} />
      ))}

      {fogs.length >= 5 && (
        <View style={styles.fogWarning}>
          <View style={styles.fogWarningCard}>
            <Text style={styles.fogWarningTitle}>🌫️ Too Foggy to See</Text>
            <Text style={styles.fogWarningText}>
              The garden is covered in fog.
              {'\n'}Complete tasks to clear punishments and reveal your plants.
            </Text>
          </View>
        </View>
      )}

      {/* Main garden area (2x3 grid) */}
      <View style={styles.gardenMain}>
        <View style={styles.grid}>
          {plantIndices.map((idx) => (
            <View key={`plant-${idx}`} style={styles.gridCell}>
              <TomatoPlant tomatoes={Math.min(5, tomatoes - idx * 5)} />
            </View>
          ))}
        </View>

        {/* Full-width punishment layers */}
        <View style={styles.punishmentLayerFull}>
          {/* Weeds with grass image */}
          {weeds.map((_, idx) => (
            <Image
              key={`weed-${idx}`}
              source={require('../../assets/images/grass.png')}
              style={[
                styles.weedStrip,
                {
                  opacity: Math.max(0.35, 0.9 - idx * 0.15),
                  bottom: idx * 8,
                },
              ]}
              resizeMode="repeat"
            />
          ))}

          {/* Wilted leaves emoji strip */}
          {leaves.map((_, idx) => (
            <Text
              key={`leaf-${idx}`}
              style={[
                styles.leafStrip,
                {
                  opacity: Math.max(0.35, 0.95 - idx * 0.15),
                  bottom: idx * 10,
                },
              ]}
            >
              🍂🍂🍂🍂🍂🍂🍂🍂🍂🍂
            </Text>
          ))}

          {/* Scattered BUG/FUNGUS */}
          {scattered.map((p) => {
            const pos = scatterPositions.get(p.id) || { left: '50%', bottom: 8 };
            const emoji = p.type === 'BUG' ? '🐛' : '🍄';
            return (
              <Text key={p.id} style={[styles.scatter, { left: pos.left as any, bottom: pos.bottom }]}>
                {emoji}
              </Text>
            );
          })}
        </View>
      </View>

      {/* Additional plants in scrollable section */}
      {additionalPlants > 0 && (
        <View style={styles.additionalPlantsSection}>
          <Text style={styles.additionalTitle}>Older Plants</Text>
          <View style={styles.grid}>
            {Array.from({ length: additionalPlants }).map((_, idx) => {
              const actualIdx = MAX_PLANTS + idx;
              return (
                <View key={`plant-extra-${idx}`} style={styles.gridCell}>
                  <TomatoPlant tomatoes={Math.min(5, tomatoes - actualIdx * 5)} />
                </View>
              );
            })}
          </View>
        </View>
      )}

      <Animated.View
        pointerEvents="none"
        style={[styles.toast, {
          opacity: tomatoToastAnim,
          transform: [{ translateY: tomatoToastAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
        }]}
      >
        <Text style={styles.toastText}>+1 🍅</Text>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[styles.toast, {
          opacity: resolveToastAnim,
          transform: [{ translateY: resolveToastAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
          top: 42,
        }]}
      >
        <Text style={styles.toastText}>✅ Punishment resolved</Text>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5f7e2',
    borderRadius: 20,
    overflow: 'hidden',
  },
  fogLayer: {
    position: 'absolute',
    inset: 0,
    backgroundColor: '#ffffff',
    zIndex: 10,
  },
  fogWarning: {
    position: 'absolute',
    inset: 0,
    zIndex: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  fogWarningCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: spacing.md,
  },
  fogWarningTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 6,
    textAlign: 'center',
  },
  fogWarningText: {
    fontSize: 13,
    textAlign: 'center',
    color: '#333',
  },
  gardenMain: {
    position: 'relative',
    minHeight: 420,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.md,
    gap: spacing.md,
    justifyContent: 'center',
  },
  gridCell: {
    width: PLANT_SIZE,
    height: PLANT_SIZE,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  punishmentLayerFull: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
    zIndex: 12,
  },
  weedStrip: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
    height: 60,
  },
  leafStrip: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
    fontSize: 22,
    textAlign: 'center',
  },
  scatter: {
    position: 'absolute',
    fontSize: 32,
  },
  additionalPlantsSection: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  additionalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray600,
    marginBottom: spacing.md,
  },
  toast: {
    position: 'absolute',
    top: 12,
    alignSelf: 'center',
    zIndex: 30,
  },
  toastText: {
    fontWeight: '700',
    fontSize: 18,
    color: colors.gray800,
  },
});
