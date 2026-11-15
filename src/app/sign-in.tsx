import {
  useSignInWithUsernamePassword,
  useSignUpWithUsernamePassword,
} from '@convex-dev/auth/methods/username-password/react';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import { Leggy } from '@/components/leggy';
import { Body, Button, Field, Screen, TextButton } from '@/components/ui';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { api } from '../../convex/_generated/api';

type Mode = 'signIn' | 'signUp';

function authErrorMessage(userError: { error: string; minimumLength?: number; maximumLength?: number }) {
  switch (userError.error) {
    case 'USER_NOT_FOUND':
      return 'No account with that username.';
    case 'INVALID_CREDENTIALS':
      return 'Wrong username or password.';
    case 'USERNAME_TAKEN':
      return 'That username is taken.';
    case 'RATE_LIMITED':
      return 'Too many attempts. Wait a moment and try again.';
    case 'USERNAME_TOO_SHORT':
      return `Username must be at least ${userError.minimumLength} characters.`;
    case 'USERNAME_TOO_LONG':
      return `Username must be at most ${userError.maximumLength} characters.`;
    case 'PASSWORD_TOO_SHORT':
      return `Password must be at least ${userError.minimumLength} characters.`;
    case 'PASSWORD_TOO_LONG':
      return `Password must be at most ${userError.maximumLength} characters.`;
    case 'PASSWORD_TOO_COMMON':
      return 'That password is too common. Pick another.';
    case 'OTHER_ERROR':
      return 'Something went wrong. Try again.';
    default: {
      const words = userError.error.toLowerCase().replaceAll('_', ' ');
      return words.charAt(0).toUpperCase() + words.slice(1) + '.';
    }
  }
}

export default function SignInScreen() {
  const [mode, setMode] = useState<Mode>('signIn');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signIn, pending: signingIn } = useSignInWithUsernamePassword(api.auth);
  const { signUp, pending: signingUp } = useSignUpWithUsernamePassword(api.auth);
  const pending = signingIn || signingUp;

  async function submit() {
    setError(null);
    const credentials = { username: username.trim(), password };
    const result = mode === 'signIn' ? await signIn(credentials) : await signUp(credentials);
    if (result.status !== 'complete') {
      setError(authErrorMessage(result.userError));
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <View style={styles.hero}>
          <Leggy size={220} pose="waving" />
          <Text style={styles.wordmark}>Little Legends</Text>
          <Body muted style={styles.tagline}>
            One fun thing with your kid, every day
          </Body>
        </View>

        <View style={styles.form}>
          <Text style={styles.heading}>{mode === 'signIn' ? 'Sign in' : 'Sign up'}</Text>
          <Field
            nativeID="username"
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoComplete="username"
            textContentType="username"
            editable={!pending}
          />
          <Field
            nativeID="password"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
            textContentType={mode === 'signIn' ? 'password' : 'newPassword'}
            editable={!pending}
            onSubmitEditing={submit}
          />
          {error !== null && <Body style={styles.error}>{error}</Body>}
          <Button
            label={mode === 'signIn' ? 'Sign in' : 'Create account'}
            variant="accent"
            onPress={submit}
            loading={pending}
            disabled={username.trim().length === 0 || password.length === 0}
          />
          <TextButton
            label={mode === 'signIn' ? 'New here? Create an account' : 'Have an account? Sign in'}
            onPress={() => {
              setMode(mode === 'signIn' ? 'signUp' : 'signIn');
              setError(null);
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: Spacing.four,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  wordmark: {
    color: Colors.black,
    fontFamily: Fonts.displayBold,
    fontSize: 42,
    lineHeight: 48,
    textAlign: 'center',
  },
  tagline: {
    textAlign: 'center',
  },
  form: {
    gap: Spacing.three,
  },
  heading: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 22,
  },
  error: {
    fontFamily: Fonts.sansBold,
  },
});
