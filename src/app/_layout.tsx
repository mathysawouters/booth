import { ConvexAuthProvider, type TokenStorage } from '@convex-dev/auth/react';
import { ConvexReactClient, useConvexAuth } from 'convex/react';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { Colors } from '@/constants/theme';
import { api } from '../../convex/_generated/api';

SplashScreen.preventAutoHideAsync();

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const secureStorage: TokenStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: Colors.black, card: Colors.black, primary: Colors.white },
};

export default function RootLayout() {
  return (
    <ConvexAuthProvider
      client={convex}
      api={{
        refreshSession: api.auth.refreshSession,
        signOut: api.auth.signOut,
        isAuthenticated: api.auth.isAuthenticated,
      }}
      storage={Platform.OS === 'web' ? undefined : secureStorage}
      ambientSignIns={[]}>
      <ThemeProvider value={theme}>
        <StatusBar style="light" />
        <RootNavigator />
      </ThemeProvider>
    </ConvexAuthProvider>
  );
}

function RootNavigator() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.black } }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="booth" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  );
}
