import { StyleSheet } from 'react-native';

export const typography = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
  },
  h3: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  // Modern app title style - clean, friendly, mobile-native
  appTitle: {
    fontSize: 26,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 16,
  },
  button: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
});
