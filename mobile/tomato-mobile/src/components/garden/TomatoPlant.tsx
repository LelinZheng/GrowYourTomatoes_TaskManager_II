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

const tomatoPosition: Record<number, any> = {
  0: { top: '7%', left: '50%', transform: [{ translateX: -12 }] },
  1: { top: '25%', left: '25%', transform: [{ translateX: -12 }] },
  2: { top: '25%', left: '75%', transform: [{ translateX: -12 }] },
  3: { top: '45%', left: '35%', transform: [{ translateX: -12 }] },
  4: { top: '45%', left: '65%', transform: [{ translateX: -12 }] },
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
    transform: [{ translateX: -9 }, { translateY: -9 }],
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
