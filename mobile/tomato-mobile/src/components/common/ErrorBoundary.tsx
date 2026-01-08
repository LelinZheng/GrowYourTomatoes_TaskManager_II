import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface State {
  hasError: boolean;
  error: Error | null;
  info: any;
}

export class ErrorBoundary extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('[ErrorBoundary] Caught error:', error, info);
    this.setState({ hasError: true, error, info });
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>An error occurred</Text>
          <Text style={styles.message}>{String(this.state.error)}</Text>
          <Text style={styles.stack}>{this.state.info?.componentStack}</Text>
        </ScrollView>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  message: { color: '#c00', marginBottom: 12 },
  stack: { color: '#333' },
});
