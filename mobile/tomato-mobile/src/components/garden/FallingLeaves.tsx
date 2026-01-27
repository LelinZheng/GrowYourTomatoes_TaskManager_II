import React, { useEffect, useMemo, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface FallingLeavesProps {
  count: number;
  gardenHeight: number;
  soilHeight: number;
}

interface LeafProps {
  index: number;
  gardenHeight: number;
  soilHeight: number;
}

const FallingLeaf: React.FC<LeafProps> = ({ index, gardenHeight, soilHeight }) => {
  const translateY = useRef(new Animated.Value(-50)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  
  // Generate random X position within garden width (10% to 90% to avoid edges)
  const getRandomX = () => {
    const minX = screenWidth * 0.1;
    const maxX = screenWidth * 0.9;
    return minX + Math.random() * (maxX - minX);
  };

  // Calculate fall distance: from top (-50) to soil layer top
  const fallDistance = gardenHeight - soilHeight;
  
  // Duration: ~5-7 seconds per fall (slow and gentle)
  // Stagger slightly based on index for variety
  const duration = 5000 + (index % 3) * 1000;

  useEffect(() => {
    // Initialize X position
    translateX.setValue(getRandomX());

    // Create the falling animation loop
    const startFalling = () => {
      // Reset to top
      translateY.setValue(-50);
      
      // Randomize X position for this cycle
      translateX.setValue(getRandomX());
      
      // Animate falling
      Animated.timing(translateY, {
        toValue: fallDistance,
        duration,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          // Loop: immediately restart from top
          startFalling();
        }
      });
    };

    startFalling();

    return () => {
      translateY.stopAnimation();
    };
  }, [duration, fallDistance]);

  return (
    <Animated.Text 
      style={[
        styles.leaf,
        {
          transform: [
            { translateX },
            { translateY },
          ],
        },
      ]}
    >
      🍂
    </Animated.Text>
  );
};

export const FallingLeaves: React.FC<FallingLeavesProps> = ({ 
  count, 
  gardenHeight, 
  soilHeight 
}) => {
  // Create array of leaf indices
  const leaves = useMemo(
    () => Array.from({ length: count }, (_, i) => i),
    [count]
  );

  return (
    <View style={styles.container} pointerEvents="none">
      {leaves.map((index) => (
        <FallingLeaf
          key={`falling-leaf-${index}`}
          index={index}
          gardenHeight={gardenHeight}
          soilHeight={soilHeight}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 15, // Above plants but below fog
  },
  leaf: {
    position: 'absolute',
    fontSize: 28,
    top: 0,
    left: 0,
  },
});
