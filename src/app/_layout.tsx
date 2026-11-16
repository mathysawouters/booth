import { ConvexAuthProvider, type TokenStorage } from '@convex-dev/auth/react';
import { Fredoka_600SemiBold } from '@expo-google-fonts/fredoka/600SemiBold';
import { Fredoka_700Bold } from '@expo-google-fonts/fredoka/700Bold';
import { Literata_400Regular } from '@expo-google-fonts/literata/400Regular';
import { Literata_400Regular_Italic } from '@expo-google-fonts/literata/400Regular_Italic';
import { Literata_600SemiBold } from '@expo-google-fonts/literata/600SemiBold';
import { Nunito_400Regular } from '@expo-google-fonts/nunito/400Regular';
import { Nunito_600SemiBold } from '@expo-google-fonts/nunito/600SemiBold';
import { Nunito_700Bold } from '@expo-google-fonts/nunito/700Bold';
import { Nunito_800ExtraBold } from '@expo-google-fonts/nunito/800ExtraBold';
import { ConvexReactClient, useConvexAuth, useQuery } from 'convex/react';
import { useFonts } from 'expo-font';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';

import { LeggySays } from '@/components/leggy';
import { Button, Screen } from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { useDeviceSignIn } from '@/lib/device-sign-in';
import { KidProvider } from '@/lib/kids';
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
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: Colors.paper, card: Colors.white, primary: Colors.green, text: Colors.black },
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Fredoka_600SemiBold,
    Fredoka_700Bold,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Literata_400Regular,
    Literata_400Regular_Italic,
    Literata_600SemiBold,
  });

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
        <StatusBar style="dark" />
        <KidProvider>
          <RootNavigator fontsReady={fontsLoaded || fontError !== null} />
        </KidProvider>
      </ThemeProvider>
    </ConvexAuthProvider>
  );
}

function RootNavigator({ fontsReady }: { fontsReady: boolean }) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const signIn = useDeviceSignIn(!isLoading && !isAuthenticated);
  const kids = useQuery(api.kids.myKids, isAuthenticated ? {} : 'skip');
  const ready = fontsReady && !isLoading && (isAuthenticated ? kids !== undefined : signIn.failed);
  const onboarded = isAuthenticated && kids !== undefined && kids.length > 0;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  if (!isAuthenticated) {
    return <SignInFailed onRetry={signIn.retry} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.paper } }}>
      <Stack.Protected guard={onboarded}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-kid" options={{ presentation: 'modal' }} />
        <Stack.Screen name="story" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="done" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
      </Stack.Protected>
      <Stack.Protected guard={!onboarded}>
        <Stack.Screen name="welcome" />
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
    </Stack>
  );
}

function SignInFailed({ onRetry }: { onRetry: () => void }) {
  return (
    <Screen color={Colors.mint} style={styles.failed}>
      <LeggySays side="top" size={200} pose="thinking">
        Oops, I can&apos;t find the internet!
      </LeggySays>
      <Button label="Try again" icon="refresh" variant="accent" onPress={onRetry} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  failed: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.five,
  },
});
