import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// Sensitive keys that should be stored securely
const SECURE_KEYS = ['token'];

export const storageService = {
  async setItem(key: string, value: any): Promise<void> {
    try {
      // If value is null/undefined, remove the key instead of attempting to save
      if (value === undefined || value === null) {
        if (SECURE_KEYS.includes(key)) {
          await SecureStore.deleteItemAsync(key);
        } else {
          await AsyncStorage.removeItem(key);
        }
        return;
      }

      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

      // Use SecureStore for sensitive data
      if (SECURE_KEYS.includes(key)) {
        await SecureStore.setItemAsync(key, stringValue);
      } else {
        // Use AsyncStorage for non-sensitive data
        await AsyncStorage.setItem(key, stringValue);
      }
    } catch (error) {
      console.error(`Error saving to storage: ${key}`, error);
    }
  },

  async getItem<T>(key: string): Promise<T | null> {
    try {
      let item: string | null = null;

      // Read from SecureStore for sensitive data
      if (SECURE_KEYS.includes(key)) {
        item = await SecureStore.getItemAsync(key);
      } else {
        // Read from AsyncStorage for non-sensitive data
        item = await AsyncStorage.getItem(key);
      }
      if (!item) return null;

      // Try to parse JSON; if it fails, return the raw string value
      try {
        return JSON.parse(item) as T;
      } catch {
        // Return raw string for values like JWT tokens
        return (item as unknown) as T;
      }
    } catch (error) {
      console.error(`Error reading from storage: ${key}`, error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (SECURE_KEYS.includes(key)) {
        await SecureStore.deleteItemAsync(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing from storage: ${key}`, error);
    }
  },

  async clear(): Promise<void> {
    try {
      // Clear all AsyncStorage items
      await AsyncStorage.clear();
      // Note: SecureStore doesn't have a bulk clear method, so we clear sensitive items individually
      for (const key of SECURE_KEYS) {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error('Error clearing storage', error);
    }
  },

  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys from storage', error);
      return [];
    }
  },
};
