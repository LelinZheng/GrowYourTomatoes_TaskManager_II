import React, { Suspense } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthContextProvider } from './src/context/AuthContext';
import { TaskContextProvider } from './src/context/TaskContext';
import { GardenContextProvider } from './src/context/GardenContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { RootNavigator } from './src/navigation/RootNavigator';

const LoadingFallback = () => (
  <View style={styles.loading}>
    <ActivityIndicator size="large" color="#DC2626" />
  </View>
);

const AppContent = () => {
  const { isDark } = useTheme();
  
  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <RootNavigator />
      </Suspense>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthContextProvider>
          <TaskContextProvider>
            <GardenContextProvider>
              <AppContent />
            </GardenContextProvider>
          </TaskContextProvider>
        </AuthContextProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
