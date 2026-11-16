import {
  useSignInWithUsernamePassword,
  useSignUpWithUsernamePassword,
} from '@convex-dev/auth/methods/username-password/react';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { Platform } from 'react-native';

import { api } from '../../convex/_generated/api';

type Credentials = { username: string; password: string };

const KEY = 'deviceCredentials';

async function loadCredentials(): Promise<Credentials | null> {
  const raw = Platform.OS === 'web' ? localStorage.getItem(KEY) : await SecureStore.getItemAsync(KEY);
  return raw === null ? null : (JSON.parse(raw) as Credentials);
}

async function saveCredentials(credentials: Credentials) {
  const raw = JSON.stringify(credentials);
  if (Platform.OS === 'web') {
    localStorage.setItem(KEY, raw);
  } else {
    await SecureStore.setItemAsync(KEY, raw);
  }
}

function newCredentials(): Credentials {
  const bytes = Crypto.getRandomBytes(24);
  return {
    username: `device-${Crypto.randomUUID()}`,
    password: Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(''),
  };
}

export function useDeviceSignIn(needed: boolean) {
  const { signIn } = useSignInWithUsernamePassword(api.auth);
  const { signUp } = useSignUpWithUsernamePassword(api.auth);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const running = useRef(false);

  const signInOrSignUp = useEffectEvent(async () => {
    const saved = await loadCredentials();
    if (saved !== null) {
      const result = await signIn(saved);
      if (result.status === 'complete') return;
      if (result.userError.error !== 'USER_NOT_FOUND') {
        throw new Error(result.userError.error);
      }
    }
    const fresh = newCredentials();
    await saveCredentials(fresh);
    const result = await signUp(fresh);
    if (result.status !== 'complete') {
      throw new Error(result.userError.error);
    }
  });

  useEffect(() => {
    if (!needed || running.current) return;
    running.current = true;
    setFailed(false);
    signInOrSignUp()
      .catch(() => setFailed(true))
      .finally(() => {
        running.current = false;
      });
  }, [needed, attempt]);

  return { failed, retry: () => setAttempt((n) => n + 1) };
}
