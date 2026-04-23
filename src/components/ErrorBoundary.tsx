import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
// Sentry removed for launch — will re-add post-launch
import { colors, darkColors, fontFamily } from '../styles/theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryKey: number;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, retryKey: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error.message);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
    // TODO: Re-add Sentry.captureException after launch
  }

  handleRetry = () => {
    // Increment retryKey to force a full remount of children (fresh state)
    this.setState((prev) => ({
      hasError: false,
      error: null,
      retryKey: prev.retryKey + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            The app ran into an unexpected error. Try again, and if the problem
            persists, restart the app.
          </Text>
          {this.state.error && (
            <Text style={styles.devError} numberOfLines={6}>
              {this.state.error.message}
            </Text>
          )}
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={this.handleRetry}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </Pressable>
        </View>
      );
    }

    // Key forces full unmount/remount on retry, ensuring fresh component state
    return (
      <View key={this.state.retryKey} style={{ flex: 1 }}>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkColors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 22,
    color: colors.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: darkColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  devError: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: colors.brand,
    backgroundColor: darkColors.surfaceElevated,
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
    overflow: 'hidden',
  },
  button: {
    backgroundColor: colors.brand,
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 16,
    color: colors.white,
  },
});
