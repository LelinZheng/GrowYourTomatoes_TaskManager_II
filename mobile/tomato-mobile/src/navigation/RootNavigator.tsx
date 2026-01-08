import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { SplashScreen } from '../screens/auth/SplashScreen';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';

// Bypass NavigationContainer entirely to avoid native boolean/string errors
export const RootNavigator: React.FC = () => {
  const auth = useAuth();
  
  if (!auth) {
    return null;
  }
  
  const { isSignedIn, isLoading } = auth;

  if (isLoading) {
    return <SplashScreen />;
  }

  return isSignedIn ? <AppNavigator /> : <AuthNavigator />;
};
