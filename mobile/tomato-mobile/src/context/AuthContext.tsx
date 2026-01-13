import React, { createContext, useState, useEffect } from 'react';
import { User } from '../types/User';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUsername: (username: string) => Promise<User>;
  bootstrapAsync: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthContextProviderProps {
  children: React.ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const bootstrapAsync = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      const isAuth = await authService.isAuthenticated();
      let resolvedUser = currentUser;
      // If we have a token but no cached user, fetch from backend
      if (isAuth && !currentUser) {
        resolvedUser = await authService.fetchMe();
      }
      setUser(resolvedUser);
      setIsSignedIn(isAuth);
    } catch (error) {
      console.error('Error bootstrapping auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      setIsSignedIn(true);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const response = await authService.register({ email, password, username });
      setUser(response.user);
      setIsSignedIn(true);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsSignedIn(false);
    } catch (error) {
      throw error;
    }
  };

  const updateUsername = async (username: string) => {
    const updatedUser = await userService.updateUsername(username);
    setUser(updatedUser);
    return updatedUser;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isSignedIn,
    signIn,
    signUp,
    signOut,
    updateUsername,
    bootstrapAsync,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
