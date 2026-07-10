import { useEffect, useState } from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { PaperProvider, ActivityIndicator, Text } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../store/settings';
import { LightTheme, DarkTheme, COLORS } from '../constants/theme';
import { SPACING } from '../constants/theme';

let GestureHandler: typeof View = View;
if (Platform.OS !== 'web') {
  try {
    const GH = require('react-native-gesture-handler');
    GestureHandler = GH.GestureHandlerRootView;
  } catch {
    GestureHandler = View;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 10000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default function RootLayout() {
  const { darkMode, loadSettings } = useSettingsStore();
  const [ready, setReady] = useState(false);
  const theme = darkMode ? DarkTheme : LightTheme;

  useEffect(() => {
    loadSettings().finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View style={[styles.root, styles.center, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.splashIcon, { backgroundColor: COLORS.voltageAC + '15' }]}>
          <Ionicons name="flash" size={32} color={COLORS.voltageAC} />
        </View>
        <Text variant="displaySmall" style={{ fontWeight: '800', color: COLORS.voltageAC, letterSpacing: 1 }}>
          Monitoring
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: SPACING.xs }}>
          Sistem
        </Text>
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: SPACING.xl }} />
      </View>
    );
  }

  return (
    <GestureHandler style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={theme}>
          <StatusBar style={darkMode ? 'light' : 'dark'} />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: Platform.OS === 'web' ? 'none' : 'slide_from_right',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="monitoring/[id]"
              options={{
                headerShown: true,
                title: 'Detail Monitoring',
                animation: Platform.OS === 'web' ? 'none' : 'slide_from_bottom',
              }}
            />
          </Stack>
        </PaperProvider>
      </QueryClientProvider>
    </GestureHandler>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
});
