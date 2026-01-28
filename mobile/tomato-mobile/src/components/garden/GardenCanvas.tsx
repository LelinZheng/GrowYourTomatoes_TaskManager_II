import React, { useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Animated, Dimensions, LayoutChangeEvent } from 'react-native';
import type { ReactElement } from 'react';
import type { RefreshControlProps } from 'react-native';
import { Punishment, PunishmentType } from '../../types/Punishment';
import { TomatoPlant } from './TomatoPlant';
import { FallingLeaves } from './FallingLeaves';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../styles/spacing';

const { width: screenWidth } = Dimensions.get('window');

const COLS = 2;
const ROWS = 3;

const H_PADDING = spacing.md;
const GAP = spacing.xs;

const SOIL_HEIGHT = 50;

const WEED_ROW_HEIGHT = 20;
const WEED_ROW_GAP = 14;
const WEED_BASE_BOTTOM = 2;
const WEED_STICK_OUT = 8;

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
  const { theme } = useTheme();
  const [viewportH, setViewportH] = useState(0);

  const onLayoutViewport = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h && Math.abs(h - viewportH) > 1) setViewportH(h);
  };

  const plantCount = Math.max(1, Math.ceil(tomatoes / 5));

  const allIndices = useMemo(
    () => Array.from({ length: plantCount }, (_, i) => plantCount - 1 - i),
    [plantCount]
  );


  const weedDrift = useRef(new Animated.Value(0)).current;
  const tomatoToastAnim = useRef(new Animated.Value(0)).current;
  const resolveToastAnim = useRef(new Animated.Value(0)).current;

  const fogs = punishments.filter((p) => p.type === 'FOG');
  const weeds = punishments.filter((p) => p.type === 'WEEDS');
  const leaves = punishments.filter((p) => p.type === 'WILTED_LEAVES');
  const scattered = punishments.filter((p) => p.type === 'BUG' || p.type === 'FUNGUS');

  const cellW = (screenWidth - H_PADDING * 2 - GAP * (COLS - 1)) / COLS;

  const gridTop = 4;
  const gridBottom = 2;
  const gridAreaH = Math.max(0, viewportH - SOIL_HEIGHT - gridTop - gridBottom);
  const cellH = Math.floor((gridAreaH - GAP * (ROWS - 1)) / ROWS);

  const plantSize = Math.max(0, Math.min(cellW, cellH) * 0.75);
  const plantHeight = cellH;

  const scatterPositions = useMemo(() => {
    const map = new Map<number, { left: string; bottom: number }>();
    scattered
      .slice()
      .sort((a, b) => priorityOrder[a.type] - priorityOrder[b.type])
      .forEach((p) => {
        map.set(p.id, {
          left: `${Math.random() * 80 + 10}%`,
          bottom: Math.random() * 22,
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
          Animated.timing(anim, { toValue: 1, duration: 320 + idx * 40, useNativeDriver: true }),
          Animated.timing(anim, { toValue: -1, duration: 320 + idx * 40, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 320 + idx * 40, useNativeDriver: true }),
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

  const isTooFoggy = fogs.length >= 5;

  return (
    <View style={styles.wrapper} onLayout={onLayoutViewport}>
      <FlatList
        data={allIndices}
        keyExtractor={(idx) => `plant-${idx}`}
        numColumns={COLS}
        contentContainerStyle={{
          paddingTop: gridTop,
          paddingBottom: SOIL_HEIGHT + gridBottom,
          paddingHorizontal: H_PADDING,
        }}
        columnWrapperStyle={{ gap: GAP }}
        refreshControl={refreshControl}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: plantIndex }) => (
          <View style={{ width: cellW, height: plantHeight, alignItems: 'center', justifyContent: 'flex-end', marginBottom: GAP }}>
            <TomatoPlant
              tomatoes={Math.min(5, Math.max(0, tomatoes - plantIndex * 5))}
              size={plantSize}
            />
          </View>
        )}
      />

      <View pointerEvents="none" style={[styles.soilPinned, { height: SOIL_HEIGHT }]}>
        {weeds.length > 0 &&
          [0, 1].map((row) => (
            <View
              key={`weed-row-${row}`}
              style={[
                styles.weedRowClip,
                {
                  bottom: WEED_BASE_BOTTOM + row * WEED_ROW_GAP,
                },
              ]}
            >
              <Animated.Image
                source={require('../../assets/images/smaller_grass.png')}
                style={[
                  styles.weedStripInner,
                  {
                    transform: [
                      { translateY: -WEED_STICK_OUT },
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

        {scattered.map((p) => {
          const pos = scatterPositions.get(p.id) || { left: '50%', bottom: 6 };
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

      {leaves.length > 0 && (
        <FallingLeaves 
          count={leaves.length} 
          gardenHeight={viewportH} 
          soilHeight={SOIL_HEIGHT}
        />
      )}

      {fogs.map((_, idx) => (
        <View key={`fog-${idx}`} pointerEvents="none" style={[styles.fogLayer, { opacity: Math.min(0.75, 0.22 + idx * 0.12) }]} />
      ))}

      {isTooFoggy && (
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

      <Animated.View pointerEvents="none" style={[styles.toast, { opacity: tomatoToastAnim }]}>
        <Text style={[styles.toastText, { color: theme.colors.text }]}>+1 🍅</Text>
      </Animated.View>

      <Animated.View pointerEvents="none" style={[styles.toast, { top: 42, opacity: resolveToastAnim }]}>
        <Text style={[styles.toastText, { color: theme.colors.text }]}>✅ Punishment resolved</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#e5f7e2', position: 'relative' },
  soilPinned: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    backgroundColor: 'rgba(199,154,107,0.45)',
    overflow: 'visible',
  },
  weedRowClip: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: WEED_ROW_HEIGHT,
    overflow: 'hidden',
  },
  weedStripInner: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: WEED_ROW_HEIGHT + WEED_STICK_OUT,
    width: '100%',
  },
  scatter: { position: 'absolute', fontSize: 28 },
  fogLayer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#fff', zIndex: 20 },
  toast: { position: 'absolute', top: 12, alignSelf: 'center', zIndex: 30 },
  toastText: { fontWeight: '700', fontSize: 18 },
  tooFoggyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  tooFoggyCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.72)',
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
    elevation: 8,
  },
  tooFoggyTitle: { fontSize: 18, fontWeight: '800', textAlign: 'center', marginBottom: spacing.sm, color: '#FFFFFF' },
  tooFoggyText: { fontSize: 14, textAlign: 'center', color: 'rgba(255,255,255,0.92)', lineHeight: 20 },
});
