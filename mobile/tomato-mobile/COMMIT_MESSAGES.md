# Git Commit Messages

## Mobile UX Enhancements

### Single Combined Commit
```
feat(mobile): add dark mode, swipe gestures, and haptic feedback

- Implement theme system with light/dark/auto modes
- Add swipe-to-complete and swipe-to-delete gestures
- Integrate haptic feedback on task completion
- Update all screens and components with theme support
- Add theme controls in profile settings
```

---

### OR Separate Commits by Feature

#### Dark Mode
```
feat(mobile): implement dark mode with theme system

- Add ThemeContext with light/dark/auto modes
- Persist theme preference to AsyncStorage
- Update all components with dynamic theme colors
- Add theme toggle UI in profile screen
- Support system-level dark mode detection
```

#### Swipe Gestures
```
feat(mobile): add swipe gestures for task management

- Implement swipe-right-to-complete on active tasks
- Implement swipe-left-to-delete on all tasks
- Add animated swipe actions with visual feedback
- Integrate react-native-gesture-handler and reanimated
- Maintain button fallback for accessibility
```

#### Haptic Feedback
```
feat(mobile): add haptic feedback on task completion

- Trigger success haptic when completing tasks
- Use expo-haptics for native feedback
- Non-blocking implementation with fallback
- Works on both iOS and Android
```

---

### Detailed Commits (Per File)

If you want more granular commits:

```bash
# Theme System Core
git add mobile/tomato-mobile/src/context/ThemeContext.tsx
git commit -m "feat(mobile): create theme context with light/dark/auto modes"

# App Integration
git add mobile/tomato-mobile/App.tsx
git commit -m "feat(mobile): integrate theme provider and dynamic status bar"

# Dependencies
git add mobile/tomato-mobile/package.json
git commit -m "chore(mobile): add expo-haptics, gesture-handler, reanimated"

# TaskCard Component
git add mobile/tomato-mobile/src/components/tasks/TaskCard.tsx
git commit -m "feat(mobile): add swipe gestures and theme support to TaskCard"

# TaskListScreen
git add mobile/tomato-mobile/src/screens/tasks/TaskListScreen.tsx
git commit -m "feat(mobile): add haptics and theme support to task list"

# Profile Screen
git add mobile/tomato-mobile/src/screens/main/ProfileScreen.tsx
git commit -m "feat(mobile): add theme controls to profile screen"

# Navigator
git add mobile/tomato-mobile/src/navigation/AppNavigator.tsx
git commit -m "feat(mobile): apply theme to navigation tab bar"

# Documentation
git add mobile/tomato-mobile/*.md
git commit -m "docs(mobile): add UX features documentation"
```

---

### Recommended Approach

**For feature branches:**
Use separate commits for each feature, then squash when merging to main.

**For direct to main:**
Use the single combined commit for cleaner history.

**Example workflow:**
```bash
# Stage all mobile changes
git add mobile/tomato-mobile/

# Commit with detailed message
git commit -m "feat(mobile): add dark mode, swipe gestures, and haptic feedback

- Implement theme system with light/dark/auto modes
- Add swipe-to-complete and swipe-to-delete gestures  
- Integrate haptic feedback on task completion
- Update all screens and components with theme support
- Add theme controls in profile settings

BREAKING CHANGE: ProfileScreen props changed (removed darkMode/onToggleDarkMode)

Closes #<issue-number>"
```

---

### Conventional Commits Format

This implementation follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Tooling/config changes

**Scopes used:**
- `(mobile)` - Mobile app changes
- `(frontend)` - Web app changes  
- `(backend)` - Server changes

---

### Files Changed Summary

```
Modified:
  mobile/tomato-mobile/App.tsx
  mobile/tomato-mobile/package.json
  mobile/tomato-mobile/src/components/tasks/TaskCard.tsx
  mobile/tomato-mobile/src/screens/tasks/TaskListScreen.tsx
  mobile/tomato-mobile/src/screens/main/ProfileScreen.tsx
  mobile/tomato-mobile/src/navigation/AppNavigator.tsx

Added:
  mobile/tomato-mobile/src/context/ThemeContext.tsx
  mobile/tomato-mobile/DARK_MODE_UX_FEATURES.md
  mobile/tomato-mobile/IMPLEMENTATION_SUMMARY.md
  mobile/tomato-mobile/COMMIT_MESSAGES.md (this file)
```

---

**Note**: Choose the commit style that matches your team's conventions!
