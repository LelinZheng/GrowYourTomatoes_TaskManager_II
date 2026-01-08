import React, { useState } from 'react';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';

export const AuthNavigator: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);

  if (showRegister) {
    return <RegisterScreen onBackToLogin={() => setShowRegister(false)} />;
  }

  return <LoginScreen onNavigateToRegister={() => setShowRegister(true)} />;
};
