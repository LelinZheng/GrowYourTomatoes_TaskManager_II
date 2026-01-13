import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';

interface TomatoPlantProps {
  tomatoes: number;
}

export const TomatoPlant: React.FC<TomatoPlantProps> = ({ tomatoes }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.stem} />
      <View style={styles.leafA} />
      <View style={styles.leafB} />
      <View style={styles.leafC} />

      {Array.from({ length: tomatoes }).map((_, idx) => (
        <Text key={idx} style={[styles.tomato, tomatoPosition[idx]]}>🍅</Text>
      ))}
    </View>
  );
};

// Positions are percentages relative to the 110x140 wrapper
// Leaf centers: leafA at left:20+35=55px, leafB at left:0+35=35px, leafC at right:0 means left:110-70+35=75px
const tomatoPosition: Record<number, any> = {
  // top center on leafA (center ~55px = 50%)
  0: { top: '7%', left: '50%' },
  // upper row on leafB (center ~35px = 31.8%) and leafC (center ~75px = 68.2%)
  1: { top: '25%', left: '31.8%' },
  2: { top: '25%', left: '68.2%' },
  // lower row slightly inward from upper
  3: { top: '45%', left: '36.4%' },
  4: { top: '45%', left: '63.6%' },
};

const styles = StyleSheet.create({
  wrapper: {
    width: 110,
    height: 140,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  stem: {
    position: 'absolute',
    bottom: 0,
    width: 12,
    height: 70,
    backgroundColor: '#245b22',
    borderRadius: 10,
  },
  leafA: {
    position: 'absolute',
    width: 70,
    height: 50,
    backgroundColor: '#3ba846',
    borderRadius: 50,
    top: 4,
    left: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  leafB: {
    position: 'absolute',
    width: 70,
    height: 50,
    backgroundColor: '#3ba846',
    borderRadius: 50,
    top: 28,
    left: 0,
    transform: [{ rotate: '-12deg' }],
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  leafC: {
    position: 'absolute',
    width: 70,
    height: 50,
    backgroundColor: '#3ba846',
    borderRadius: 50,
    top: 28,
    right: 0,
    transform: [{ rotate: '12deg' }],
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  tomato: {
    position: 'absolute',
    fontSize: 24,
    // center the 24px emoji on its left/top anchor
    transform: [{ translateX: -12 }, { translateY: -12 }],
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
