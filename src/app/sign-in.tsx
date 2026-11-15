import {
  useSignInWithUsernamePassword,
  useSignUpWithUsernamePassword,
} from '@convex-dev/auth/methods/username-password/react';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Body, Button, Field, Screen, Title } from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
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
          <Text style={styles.wordmark}>BOOTH</Text>
          <Body muted>Four photos a day. Only for friends.</Body>
        </View>

        <View style={styles.form}>
          <Title style={styles.heading}>{mode === 'signIn' ? 'Sign in' : 'Sign up'}</Title>
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
            onPress={submit}
            loading={pending}
            disabled={username.trim().length === 0 || password.length === 0}
          />
          <Pressable
            onPress={() => {
              setMode(mode === 'signIn' ? 'signUp' : 'signIn');
              setError(null);
            }}
            style={styles.switch}>
            <Body muted style={styles.switchText}>
              {mode === 'signIn' ? 'New here? Create an account' : 'Have an account? Sign in'}
            </Body>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: Spacing.five,
  },
  hero: {
    paddingTop: Spacing.six,
    gap: Spacing.two,
  },
  wordmark: {
    color: Colors.white,
    fontSize: 80,
    fontWeight: '900',
    letterSpacing: -4,
  },
  heading: {
    fontSize: 32,
  },
  form: {
    gap: Spacing.three,
  },
  error: {
    fontWeight: '700',
  },
  switch: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  switchText: {
    textDecorationLine: 'underline',
  },
});
