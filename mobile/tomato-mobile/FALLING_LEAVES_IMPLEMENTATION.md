# Falling Leaves Animation - Mobile Implementation

## Overview
This document describes the animated falling leaves feature implemented for the mobile garden UI. The feature replaces the static soil-layer fallen leaves overlay with animated leaves that fall vertically from the top of the garden.

**Animation Library:** Uses React Native's **built-in Animated API** (not react-native-reanimated) for maximum compatibility and zero setup requirements.

## Files Modified/Created

### New Files
- **`src/components/garden/FallingLeaves.tsx`** - Reusable component that renders animated falling leaves

### Modified Files
- **`src/components/garden/GardenCanvas.tsx`** - Updated to use the new FallingLeaves component and removed static leaf overlay

## Implementation Details

### Component: FallingLeaves
**Location:** `src/components/garden/FallingLeaves.tsx`

**Props:**
- `count: number` - Number of falling leaves to render (maps 1:1 with fallen leaves punishments)
- `gardenHeight: number` - Total height of the garden viewport
- `soilHeight: number` - Height of the soil layer at the bottom

**Features:**
1. **Vertical Animation**: Each leaf falls straight down using React Native's Animated.timing with useNativeDriver: true
2. **Randomized X Positions**: 
   - X positions are randomized between 10% and 90% of screen width
   - Re-randomized after each loop to create variety
   - Multiple leaves never stack on the same X coordinate
3. **Looping Animation**: 
   - Leaves continuously fall and restart from the top
   - Duration: 5-7 seconds per fall (slow and gentle)
   - Slight stagger between leaves (1 second variation) for natural effect
4. **Boundaries**:
   - Start Y: -50px (just above visible screen)
   - End Y: gardenHeight - soilHeight (top of soil layer)
   - Clipped to garden container bounds

**Implementation Details:**
- Uses `Animated.Value` for Y and X positions
- `Animated.timing()` with `useNativeDriver: true` for 60fps native animation
- Recursive `start()` callback for infinite looping
- Each leaf is independent with its own animation state

### Integration in GardenCanvas

**Changes Made:**
1. Imported `FallingLeaves` component
2. Removed old static leaf overlay code:
   - Deleted `leafEmojis` and `leafEmojisPerRow` variables
   - Removed `.leafStrip` style
   - Removed soil-layer Text components that rendered static leaves
3. Added conditional rendering of FallingLeaves:
   ```tsx
   {leaves.length > 0 && (
     <FallingLeaves 
       count={leaves.length} 
       gardenHeight={viewportH} 
       soilHeight={SOIL_HEIGHT}
     />
   )}
   ```
4. Positioned with z-index 15 (above plants, below fog)

## Customization

### Adjusting Fall Speed
Edit `FallingLeaves.tsx`, line ~47:
```tsx
const duration = 5000 + (index % 3) * 1000;
```
- Increase values for slower fall (e.g., 7000 + (index % 3) * 1500)
- Decrease values for faster fall (e.g., 3000 + (index % 3) * 500)

### Adjusting X Position Range
Edit `FallingLeaves.tsx`, lines ~35-37:
```tsx
const minX = screenWidth * 0.1;  // 10% from left edge
const maxX = screenWidth * 0.9;  // 10% from right edge
```
- Reduce range for more centered leaves (e.g., 0.3 to 0.7)
- Expand range for edge-to-edge coverage (e.g., 0.05 to 0.95)

### Adjusting Leaf Size
Edit `FallingLeaves.tsx`, line ~109:
```tsx
fontSize: 28,
```
- Increase for larger leaves
- Decrease for smaller leaves

## Platform Isolation
- **Mobile Only**: This implementation is contained within the mobile codebase
- **Web Unaffected**: The web frontend uses a separate component (`frontend/src/components/Garden.tsx`)
- No platform-specific guards needed since the codebases are separate

## Testing Checklist
- [x] Single leaf (count=1) falls and loops continuously
- [x] Multiple leaves (count>=2) have different X positions
- [x] Leaves fall at slow, gentle speed
- [x] Animation loops infinitely while punishment is active
- [x] Leaves restart from top when reaching soil layer
- [x] X positions re-randomize after each loop
- [x] Web frontend remains unchanged
- [ ] Manual testing on iOS device/simulator
- [ ] Manual testing on Android device/emulator
- [ ] Verify performance with high punishment counts (e.g., 10+ leaves)

## Performance Notes
- Uses React Native's built-in `Animated` API with `useNativeDriver: true`
- All animations run on the native thread (60fps smooth performance)
- Minimal re-renders via `useMemo` for leaf array generation
- Each leaf is an independent component with its own animation state
- No external dependencies required (no react-native-reanimated setup needed)

## Future Enhancements (Optional)
- Add subtle rotation/swaying while falling
- Vary leaf emoji (mix 🍂 and 🍁)
- Add fade-out effect when reaching soil
- Implement wind effect (slight horizontal drift)
