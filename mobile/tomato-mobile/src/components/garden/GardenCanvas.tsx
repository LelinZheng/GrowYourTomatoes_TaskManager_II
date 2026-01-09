import React, { useMemo, useRef, useEffect} from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import type { ReactElement } from 'react';
import type { RefreshControlProps } from 'react-native';
import { Punishment, PunishmentType } from '../../types/Punishment';
import { TomatoPlant } from './TomatoPlant';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

const screenWidth = Dimensions.get('window').width;

const COLS = 2;
const ROWS = 3;
const MAX_PLANTS = COLS * ROWS;
const PLANT_SIZE = (screenWidth - spacing.lg * 2 - spacing.md) / COLS;

const WEED_ROW_HEIGHT = 22;
const WEED_ROW_GAP = 16;
const WEED_BASE_BOTTOM = 10;

const SOIL_HEIGHT = 140;

interface GardenCanvasProps {
  tomatoes: number;
  punishments: Punishment[];
  showTomatoToast: boolean;
  showResolveToast: boolean;
  refreshControl?: ReactElement<RefreshControlProps>;
}

const priorityOrder: Record<PunishmentType, number> = {
  FOG: 1,
  WEEDS: 2,
  WILTED_LEAVES: 3,
  BUG: 4,
  FUNGUS: 5,
};

export const GardenCanvas: React.FC<GardenCanvasProps> = ({
  tomatoes,
  punishments,
  showTomatoToast,
  showResolveToast,
  refreshControl, 
}) => {
  const plantCount = Math.max(1, Math.ceil(tomatoes / 5));
  const scrollRef = useRef<ScrollView | null>(null);

  const weedDrift = useRef(new Animated.Value(0)).current;
  const tomatoToastAnim = useRef(new Animated.Value(0)).current;
  const resolveToastAnim = useRef(new Animated.Value(0)).current;

  const fogs = punishments.filter((p) => p.type === 'FOG');
  const weeds = punishments.filter((p) => p.type === 'WEEDS');
  const leaves = punishments.filter((p) => p.type === 'WILTED_LEAVES');
  const scattered = punishments.filter((p) => p.type === 'BUG' || p.type === 'FUNGUS');

  const scatterPositions = useMemo(() => {
    const map = new Map<number, { left: string; bottom: number }>();
    scattered
      .slice()
      .sort((a, b) => priorityOrder[a.type] - priorityOrder[b.type])
      .forEach((p) => {
        map.set(p.id, {
          left: `${Math.random() * 80 + 10}%`,
          bottom: Math.random() * 40,
        });
      });
    return map;
  }, [scattered]);

  const wiggleAnims = useMemo(() => {
    const anims = new Map<number, Animated.Value>();
    scattered.forEach((p, idx) => {
      const anim = new Animated.Value(0);
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: 300 + idx * 50, useNativeDriver: true }),
          Animated.timing(anim, { toValue: -1, duration: 300 + idx * 50, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 300 + idx * 50, useNativeDriver: true }),
        ])
      ).start();
      anims.set(p.id, anim);
    });
    return anims;
  }, [scattered]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(weedDrift, { toValue: 1, duration: 3200, useNativeDriver: true }),
        Animated.timing(weedDrift, { toValue: -1, duration: 3200, useNativeDriver: true }),
      ])
    ).start();
  }, [weedDrift]);

  useEffect(() => {
    if (showTomatoToast) {
      Animated.sequence([
        Animated.timing(tomatoToastAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
        Animated.timing(tomatoToastAnim, { toValue: 0, duration: 500, delay: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [showTomatoToast, tomatoToastAnim]);

  useEffect(() => {
    if (showResolveToast) {
      Animated.sequence([
        Animated.timing(resolveToastAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
        Animated.timing(resolveToastAnim, { toValue: 0, duration: 500, delay: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [showResolveToast, resolveToastAnim]);

  const gridPlants = Math.min(plantCount, MAX_PLANTS);
  const plantIndices = Array.from({ length: gridPlants }).map((_, i) => plantCount - 1 - i);
  const additionalPlants = Math.max(0, plantCount - MAX_PLANTS);

  const leafEmojisPerRow = Math.ceil(screenWidth / 16);
  const leafEmojis = Array(leafEmojisPerRow).fill('🍂').join('');

  const isTooFoggy = fogs.length >= 5;

  return (
    <View style={styles.wrapper}>
      {/* ONLY trees scroll (always render) */}
        <ScrollView
          ref={scrollRef as any}
          style={styles.treeScroller}
          contentContainerStyle={{
            paddingBottom: SOIL_HEIGHT + spacing.lg,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
        >
          <View style={styles.grid}>
            {plantIndices.map((idx) => (
              <View key={`plant-${idx}`} style={styles.gridCell}>
                <TomatoPlant tomatoes={Math.min(5, tomatoes - idx * 5)} />
              </View>
            ))}
          </View>

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
        </ScrollView>

      {/* PINNED soil layer */}
      <View pointerEvents="none" style={styles.soilPinned}>
        {weeds.slice(0, 2).map((_, idx) => (
          <View
            key={`weed-row-${idx}`}
            style={[
              styles.weedRowClip,
              {
                opacity: Math.max(0.35, 0.9 - idx * 0.15),
                bottom: WEED_BASE_BOTTOM + idx * WEED_ROW_GAP,
              },
            ]}
          >
            <Animated.Image
              source={require('../../assets/images/smaller_grass.png')}
              style={[
                styles.weedStripInner,
                {
                  transform: [
                    { translateY: -10 },
                    {
                      translateX: weedDrift.interpolate({
                        inputRange: [-1, 1],
                        outputRange: [-8, 8],
                      }),
                    },
                  ],
                },
              ]}
              resizeMode="repeat"
            />
          </View>
        ))}

        {leaves.map((_, idx) => (
          <Text
            key={`leaf-${idx}`}
            style={[
              styles.leafStrip,
              { opacity: Math.max(0.35, 0.95 - idx * 0.15), bottom: idx * 8 },
            ]}
          >
            {leafEmojis}
          </Text>
        ))}

        {scattered.map((p) => {
          const pos = scatterPositions.get(p.id) || { left: '50%', bottom: 8 };
          const emoji = p.type === 'BUG' ? '🐛' : '🍄';
          const wiggle = wiggleAnims.get(p.id) || new Animated.Value(0);

          return (
            <Animated.Text
              key={p.id}
              style={[
                styles.scatter,
                {
                  left: pos.left as any,
                  bottom: pos.bottom,
                  transform: [
                    {
                      rotate: wiggle.interpolate({
                        inputRange: [-1, 0, 1],
                        outputRange: ['-3deg', '0deg', '3deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
              {emoji}
            </Animated.Text>
          );
        })}
      </View>

      {fogs.map((_, idx) => (
        <View
          key={`fog-${idx}`}
          pointerEvents="none"
          style={[styles.fogLayer, { opacity: Math.min(0.75, 0.22 + idx * 0.12) }]}
        />
      ))}
      {fogs.length >= 5 && (
        <View pointerEvents="none" style={styles.tooFoggyOverlay}>
          <View style={styles.tooFoggyCard}>
            <Text style={styles.tooFoggyTitle}>🌫️ Too Foggy to See</Text>
            <Text style={styles.tooFoggyText}>
              The garden is completely covered in fog.{'\n'}
              Complete more tasks to clear punishments and reveal your trees 🌱
            </Text>
          </View>
        </View>
      )}

      {/* Toasts pinned */}
      <Animated.View pointerEvents="none" style={[styles.toast, { opacity: tomatoToastAnim }]}>
        <Text style={styles.toastText}>+1 🍅</Text>
      </Animated.View>

      <Animated.View pointerEvents="none" style={[styles.toast, { top: 42, opacity: resolveToastAnim }]}>
        <Text style={styles.toastText}>✅ Punishment resolved</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#e5f7e2',
    position: 'relative',
  },
  treeScroller: {
    flex: 1,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.sm,
    gap: spacing.sm,
    justifyContent: 'center',
  },
  gridCell: {
    width: PLANT_SIZE,
    height: 150,
    alignItems: 'center',
    justifyContent: 'flex-end',
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

  soilPinned: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SOIL_HEIGHT,
    zIndex: 10,
  },

  weedRowClip: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: WEED_ROW_HEIGHT,
    overflow: 'hidden',
  },
  weedStripInner: {
    width: '100%',
    height: 45,
  },
  leafStrip: {
    position: 'absolute',
    left: 0,
    right: 0,
    fontSize: 22,
    textAlign: 'center',
  },
  scatter: {
    position: 'absolute',
    fontSize: 28,
  },

  fogLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 20,
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
  tooFoggyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000, // ✅ higher than fogLayer zIndex (yours was 20)
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },

  tooFoggyCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.72)', // ✅ dark glass card so text pops
    borderRadius: 16,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    maxWidth: 320,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',

    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8, // Android
  },

  tooFoggyTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.sm,
    color: '#FFFFFF',
  },

  tooFoggyText: {
    fontSize: 14,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.92)',
    lineHeight: 20,
  },
});
