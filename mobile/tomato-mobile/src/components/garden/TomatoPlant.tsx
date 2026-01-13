import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TomatoPlantProps {
  tomatoes: number;
  size?: number;
}

export const TomatoPlant: React.FC<TomatoPlantProps> = ({ tomatoes, size = 110 }) => {
  const W = size;
  const H = Math.round(size * 1.0);
  const TOMATO_BOX = Math.round(size * 0.21);

  const CANOPY_W = W * 0.76;
  const CANOPY_H = H * 0.62;
  const CANOPY_TOP = H * 0.06;

  const anchors = useMemo(
    () => [
      { left: 0.5, top: 0.15 },
      { left: 0.22, top: 0.41 },
      { left: 0.78, top: 0.41 },
      { left: 0.33, top: 0.75 },
      { left: 0.67, top: 0.75 },
    ],
    []
  );

  const count = Math.min(5, tomatoes);

  return (
    <View style={[styles.wrapper, { width: W, height: H }]}>
      <View style={[styles.stem, { height: Math.round(H * 0.56), width: Math.max(10, Math.round(W * 0.08)) }]} />
      <View style={[styles.leafA, { width: Math.round(W * 0.56), height: Math.round(H * 0.34), top: Math.round(H * 0.06), left: Math.round(W * 0.22) }]} />
      <View style={[styles.leafB, { width: Math.round(W * 0.58), height: Math.round(H * 0.36), top: Math.round(H * 0.24), left: Math.round(W * 0.12) }]} />
      <View style={[styles.leafC, { width: Math.round(W * 0.58), height: Math.round(H * 0.36), top: Math.round(H * 0.24), right: Math.round(W * 0.12) }]} />

      {Array.from({ length: count }).map((_, idx) => {
        const a = anchors[idx];
        const leftPx = (W - CANOPY_W) / 2 + a.left * CANOPY_W - TOMATO_BOX / 2;
        const topPx = CANOPY_TOP + a.top * CANOPY_H - TOMATO_BOX / 2;

        return (
          <View key={`tomato-${idx}`} style={[styles.tomatoBox, { width: TOMATO_BOX, height: TOMATO_BOX, left: leftPx, top: topPx }]}>
            <Text style={[styles.tomatoText, { fontSize: TOMATO_BOX - 2, lineHeight: TOMATO_BOX }]}>🍅</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { position: 'relative', alignItems: 'center', justifyContent: 'flex-end' },
  stem: { position: 'absolute', bottom: 0, backgroundColor: '#245b22', borderRadius: 10 },
  leafA: { position: 'absolute', backgroundColor: '#3ba846', borderRadius: 999, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  leafB: { position: 'absolute', backgroundColor: '#3ba846', borderRadius: 999, transform: [{ rotate: '-12deg' }], shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  leafC: { position: 'absolute', backgroundColor: '#3ba846', borderRadius: 999, transform: [{ rotate: '12deg' }], shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  tomatoBox: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  tomatoText: { textAlign: 'center', includeFontPadding: false, textAlignVertical: 'center', textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
});
