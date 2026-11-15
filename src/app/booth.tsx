import { useMutation } from 'convex/react';
import { Asset } from 'expo-asset';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Device from 'expo-device';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Strip } from '@/components/strip';
import { Body, Button } from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { localDay } from '@/lib/day';
import { errorMessage } from '@/lib/errors';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

const PHOTO_COUNT = 4;
const SHOT_INTERVAL_MS = 1500;

const PLACEHOLDERS = [
  require('@/assets/images/placeholders/1.jpg'),
  require('@/assets/images/placeholders/2.jpg'),
  require('@/assets/images/placeholders/3.jpg'),
  require('@/assets/images/placeholders/4.jpg'),
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function placeholderUri(index: number) {
  const asset = await Asset.fromModule(PLACEHOLDERS[index]).downloadAsync();
  return asset.localUri ?? asset.uri;
}

export default function BoothScreen() {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);
  const cancelled = useRef(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [running, setRunning] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generateUploadUrl = useMutation(api.strips.generateUploadUrl);
  const createStrip = useMutation(api.strips.createStrip);

  useEffect(() => {
    cancelled.current = false;
    (Device.isDevice ? CameraView.isAvailableAsync() : Promise.resolve(false)).then(
      setHasCamera,
      () => setHasCamera(false),
    );
    return () => {
      cancelled.current = true;
    };
  }, []);

  useEffect(() => {
    if (hasCamera && permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [hasCamera, permission, requestPermission]);

  const resolving = hasCamera === null || (hasCamera && permission === null);
  const useCamera = hasCamera === true && permission?.granted === true;
  const done = photos.length === PHOTO_COUNT && !running;
  const canShoot = !resolving && !running && (!useCamera || cameraReady);

  async function capture(index: number) {
    if (!useCamera) {
      return await placeholderUri(index);
    }
    const picture = await cameraRef.current!.takePictureAsync({ quality: 0.6, shutterSound: false });
    return picture.uri;
  }

  async function shoot() {
    setError(null);
    setPhotos([]);
    setRunning(true);
    try {
      for (const n of [3, 2, 1]) {
        setCountdown(n);
        await sleep(1000);
        if (cancelled.current) return;
      }
      setCountdown(null);
      const taken: string[] = [];
      for (let i = 0; i < PHOTO_COUNT; i++) {
        const startedAt = Date.now();
        setFlash(true);
        setTimeout(() => setFlash(false), 150);
        taken.push(await capture(i));
        if (cancelled.current) return;
        setPhotos([...taken]);
        if (i < PHOTO_COUNT - 1) {
          await sleep(Math.max(0, SHOT_INTERVAL_MS - (Date.now() - startedAt)));
        }
      }
    } catch {
      setPhotos([]);
      setError('The camera failed. Try again.');
    } finally {
      setCountdown(null);
      setRunning(false);
    }
  }

  async function post() {
    setError(null);
    setPosting(true);
    try {
      const storageIds = await Promise.all(
        photos.map(async (uri) => {
          const uploadUrl = await generateUploadUrl();
          const blob = await (await fetch(uri)).blob();
          const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: { 'Content-Type': blob.type || 'image/jpeg' },
            body: blob,
          });
          if (!response.ok) {
            throw new Error(`Upload failed with status ${response.status}`);
          }
          const { storageId } = (await response.json()) as { storageId: Id<'_storage'> };
          return storageId;
        }),
      );
      await createStrip({ day: localDay(new Date()), photos: storageIds });
      router.back();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setPosting(false);
    }
  }

  if (done) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <ScrollView contentContainerStyle={styles.preview}>
          <Text style={styles.heading}>Your strip</Text>
          <Strip photos={photos} day={localDay(new Date())} width={240} />
        </ScrollView>
        <View style={[styles.actions, { paddingBottom: insets.bottom + Spacing.three }]}>
          {error !== null && <Body style={styles.error}>{error}</Body>}
          <Button label="Post" onPress={post} loading={posting} />
          <Button label="Retake" variant="outline" onPress={() => setPhotos([])} disabled={posting} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} disabled={running} hitSlop={16}>
          <Text style={[styles.close, running && styles.hidden]}>Close</Text>
        </Pressable>
        <Text style={styles.counter}>
          {running && countdown === null ? `${Math.min(photos.length + 1, PHOTO_COUNT)}/${PHOTO_COUNT}` : ''}
        </Text>
      </View>

      <View style={styles.viewfinder}>
        {useCamera ? (
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing="front"
            mirror
            onCameraReady={() => setCameraReady(true)}
          />
        ) : (
          <View style={styles.noCamera}>
            <Text style={styles.noCameraTitle}>No camera</Text>
            <Body muted style={styles.center}>
              {resolving ? 'Looking for a camera…' : 'Placeholder photos will be used instead.'}
            </Body>
          </View>
        )}
        {countdown !== null && (
          <View style={styles.overlay}>
            <Text style={styles.countdown}>{countdown}</Text>
          </View>
        )}
        {flash && <View style={[StyleSheet.absoluteFill, styles.flash]} />}
      </View>

      <View style={[styles.shutterRow, { paddingBottom: insets.bottom + Spacing.four }]}>
        {error !== null && <Body style={styles.error}>{error}</Body>}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Take photos"
          onPress={shoot}
          disabled={!canShoot}
          style={({ pressed }) => [styles.shutter, (!canShoot || pressed) && styles.dimmed]}>
          <View style={styles.shutterInner} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  close: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  hidden: {
    opacity: 0,
  },
  counter: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  viewfinder: {
    flex: 1,
    marginHorizontal: Spacing.three,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: Colors.line,
  },
  noCamera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
  },
  noCameraTitle: {
    color: Colors.white,
    fontSize: 36,
    fontWeight: '900',
  },
  center: {
    textAlign: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  countdown: {
    color: Colors.white,
    fontSize: 180,
    fontWeight: '900',
  },
  flash: {
    backgroundColor: Colors.white,
  },
  shutterRow: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingTop: Spacing.four,
  },
  shutter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 6,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.white,
  },
  dimmed: {
    opacity: 0.4,
  },
  preview: {
    alignItems: 'center',
    gap: Spacing.four,
    padding: Spacing.four,
  },
  heading: {
    color: Colors.white,
    fontSize: 44,
    fontWeight: '900',
    alignSelf: 'flex-start',
  },
  actions: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  error: {
    fontWeight: '700',
    textAlign: 'center',
  },
});
