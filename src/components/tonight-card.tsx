import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { Burst } from '@/components/confetti';
import { Leggy } from '@/components/leggy';
import { MysteryBox } from '@/components/mystery-box';
import { Button, Tappable } from '@/components/ui';
import { CATEGORY_TONE, Colors, Fonts, Radius, Spacing, Tones } from '@/constants/theme';
import { successHaptic } from '@/lib/haptics';
import { CATEGORY_ART, WAITING_LINES } from '@/lib/legends';
import type { Legend } from '@/lib/types';

const UNWRAP_MS = 520;
const TURN_MS = 180;

export function TonightCard({
  legend,
  waiting,
  onUnwrap,
  onStart,
}: {
  legend: Legend | null;
  waiting: boolean;
  onUnwrap: () => void;
  onStart: () => void;
}) {
  const [shown, setShown] = useState(legend);
  const [party, setParty] = useState(0);
  const [line, setLine] = useState(() => Math.floor(Math.random() * WAITING_LINES.length));
  const turn = useSharedValue(0);
  const latest = useRef(legend);
  const targetId = legend?._id ?? null;
  const shownId = shown?._id ?? null;

  useEffect(() => {
    latest.current = legend;
  });

  useEffect(() => {
    if (!waiting) return;
    const timer = setInterval(() => setLine((i) => (i + 1) % WAITING_LINES.length), 2400);
    return () => clearInterval(timer);
  }, [waiting]);

  useEffect(() => {
    if (targetId === shownId) return;
    const wait = shownId === null ? UNWRAP_MS : 0;
    const out = setTimeout(
      () => turn.set(withTiming(90, { duration: TURN_MS, easing: Easing.in(Easing.quad) })),
      wait,
    );
    const swap = setTimeout(() => {
      setShown(latest.current);
      turn.set(-90);
      turn.set(withSpring(0, { damping: 12, stiffness: 170 }));
      if (latest.current !== null) {
        setParty((n) => n + 1);
        successHaptic();
      }
    }, wait + TURN_MS + 20);
    return () => {
      clearTimeout(out);
      clearTimeout(swap);
    };
  }, [targetId, shownId, turn]);

  const flip = useAnimatedStyle(() => ({ transform: [{ perspective: 900 }, { rotateY: `${turn.get()}deg` }] }));

  const unwrapping = shownId === null && targetId !== null;
  const display = shown !== null && legend !== null && shown._id === legend._id ? legend : shown;

  return (
    <Animated.View style={flip}>
      {display === null ? (
        <Tappable
          accessibilityLabel="Tonight's legend"
          onPress={onUnwrap}
          disabled={waiting || unwrapping}
          scaleTo={0.97}
          style={styles.wrapped}>
          <Text style={styles.overline}>Tonight&apos;s legend</Text>
          <Text style={styles.wrappedTitle}>It&apos;s a surprise!</Text>
          <View style={styles.stage}>
            <Leggy size={132} pose="thinking" bouncy={waiting} />
            <MysteryBox state={waiting ? 'shaking' : unwrapping ? 'open' : 'idle'} />
          </View>
          <View style={styles.cta}>
            <Text style={styles.ctaLabel}>
              {waiting ? WAITING_LINES[line] : unwrapping ? 'Ta-da!' : 'Tap to unwrap'}
            </Text>
          </View>
        </Tappable>
      ) : (
        <View style={styles.revealed}>
          <View style={[styles.picture, { backgroundColor: Tones[CATEGORY_TONE[display.category]].face }]}>
            <Image source={CATEGORY_ART[display.category]} style={styles.art} contentFit="contain" />
            {display.challengeImageUrl !== null && (
              <Image
                source={{ uri: display.challengeImageUrl }}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                transition={700}
              />
            )}
          </View>
          <View style={styles.body}>
            <Text style={styles.overline}>Tonight&apos;s legend</Text>
            <Text style={styles.title}>{display.title}</Text>
            <View style={styles.chips}>
              <View style={styles.chip}>
                <Ionicons name="time" size={18} color={Colors.black} />
                <Text style={styles.chipLabel}>{display.minutes} min</Text>
              </View>
              <View style={styles.chip}>
                <Ionicons name={display.mode === 'real' ? 'walk' : 'phone-portrait'} size={18} color={Colors.black} />
                <Text style={styles.chipLabel}>{display.mode === 'real' ? 'In real life' : 'On the phone'}</Text>
              </View>
            </View>
            <Button label="Let's do it" icon="play" variant="accent" onPress={onStart} />
          </View>
        </View>
      )}
      {party > 0 && <Burst key={party} radius={210} bursts={2} />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapped: {
    alignItems: 'center',
    gap: Spacing.one,
    borderRadius: 32,
    borderBottomWidth: 8,
    borderColor: Colors.lemonDark,
    backgroundColor: Colors.lemon,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  overline: {
    color: Colors.greenDeep,
    fontFamily: Fonts.sansHeavy,
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  wrappedTitle: {
    color: Colors.black,
    fontFamily: Fonts.displayBold,
    fontSize: 28,
    lineHeight: 34,
    textAlign: 'center',
  },
  stage: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.five,
  },
  cta: {
    backgroundColor: Colors.white,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.four,
    paddingVertical: 10,
    marginTop: Spacing.three,
  },
  ctaLabel: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 18,
    textAlign: 'center',
  },
  revealed: {
    borderRadius: 32,
    borderWidth: 2,
    borderBottomWidth: 8,
    borderColor: Colors.line,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  picture: {
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
  },
  art: {
    height: '92%',
    aspectRatio: 1,
  },
  body: {
    gap: Spacing.two,
    padding: Spacing.three,
    paddingTop: 14,
  },
  title: {
    color: Colors.black,
    fontFamily: Fonts.displayBold,
    fontSize: 30,
    lineHeight: 36,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: Radius.pill,
    backgroundColor: Colors.greenSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipLabel: {
    color: Colors.black,
    fontFamily: Fonts.sansHeavy,
    fontSize: 15,
  },
});
