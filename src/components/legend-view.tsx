import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { LeggySays } from '@/components/leggy';
import { Button, Card, TextButton } from '@/components/ui';
import { BRIGHT_TONES, CATEGORY_TONE, Colors, Fonts, Radius, SKILL_TONE, Spacing, Tones } from '@/constants/theme';
import { CATEGORY_ART, KINDS, shortStep, SKILLS, stepEmoji } from '@/lib/legends';
import type { Legend } from '@/lib/types';

const GLANCE_STEPS = 3;

export function LegendView({
  legend,
  name,
  rerolling,
  onRead,
  onDone,
  onReroll,
  onPicker,
  onSkip,
}: {
  legend: Legend;
  name: string;
  rerolling: boolean;
  onRead: () => void;
  onDone: () => void;
  onReroll: () => void;
  onPicker: () => void;
  onSkip: () => void;
}) {
  const [more, setMore] = useState(false);
  const kind = KINDS[legend.kind];
  const skill = SKILLS[legend.skill];
  const hasMore =
    legend.challenge !== undefined ||
    legend.steps.length > GLANCE_STEPS ||
    legend.steps.some((step) => shortStep(step).length < step.length - 1);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={[styles.hero, { backgroundColor: Tones[CATEGORY_TONE[legend.category]].face }]}>
          <Image source={CATEGORY_ART[legend.category]} style={styles.heroArt} contentFit="contain" />
          {legend.challengeImageUrl !== null && (
            <Image source={{ uri: legend.challengeImageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" transition={700} />
          )}
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Ionicons name={kind.icon} size={16} color={Colors.black} />
              <Text style={styles.badgeLabel}>{kind.label}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeLabel}>{legend.minutes} min</Text>
            </View>
          </View>
          {legend.challenge !== undefined &&
            (legend.challengeImageUrl === null ? (
              <Drawing />
            ) : (
              <Animated.View entering={FadeIn.duration(500)} style={[styles.badge, styles.caption]}>
                <Text style={styles.badgeLabel}>Leggy&apos;s try. Can you do better?</Text>
              </Animated.View>
            ))}
        </View>

        <View style={styles.body}>
          <View style={styles.heading}>
            <Text style={styles.title}>{legend.title}</Text>
            <Text style={styles.line}>{kind.line}</Text>
          </View>
          <View style={styles.steps}>
            {(more ? legend.steps : legend.steps.slice(0, GLANCE_STEPS)).map((step, i) => (
              <View key={i} style={styles.step}>
                <View style={[styles.stepDot, { backgroundColor: Tones[BRIGHT_TONES[i % BRIGHT_TONES.length]].soft }]}>
                  <Text style={styles.stepEmoji}>{stepEmoji(step, i)}</Text>
                </View>
                <Text style={styles.stepText} numberOfLines={more ? undefined : 2}>
                  {more ? step : shortStep(step)}
                </Text>
              </View>
            ))}
          </View>
          {more && legend.challenge !== undefined && (
            <LeggySays pose={legend.category === 'bedtime' ? 'sleeping' : 'waving'} size={88}>
              {legend.challenge}
            </LeggySays>
          )}
          {hasMore && <TextButton label={more ? 'Show less' : 'Show more'} onPress={() => setMore(!more)} />}
          {legend.question !== undefined && legend.question.length > 0 && (
            <View style={styles.question}>
              <Text style={styles.questionLabel}>Ask {name}</Text>
              <Text style={styles.questionText} numberOfLines={more ? undefined : 2}>
                {legend.question}
              </Text>
            </View>
          )}
          <View style={[styles.skill, { backgroundColor: Tones[SKILL_TONE[legend.skill]].soft }]}>
            <Ionicons name={skill.icon} size={18} color={Colors.black} />
            <Text style={styles.skillText}>{skill.label}</Text>
            <View style={[styles.xp, { backgroundColor: Tones[SKILL_TONE[legend.skill]].face }]}>
              <Text style={styles.xpText}>+{legend.xp} XP</Text>
            </View>
          </View>
        </View>
      </Card>

      <Button label="We did it!" icon="checkmark-circle" variant="accent" onPress={onDone} />
      {legend.kind === 'story' && (legend.story?.length ?? 0) > 0 && (
        <Button label="Read it aloud" icon="book" variant="lemon" onPress={onRead} />
      )}
      <View style={styles.row}>
        <View style={styles.flex}>
          <Button label="Another idea" icon="shuffle" variant="soft" small onPress={onReroll} loading={rerolling} />
        </View>
        <View style={styles.flex}>
          <Button label="Pick a theme" icon="grid" variant="soft" small onPress={onPicker} />
        </View>
      </View>
      <TextButton label="Not today" onPress={onSkip} />
    </View>
  );
}

function Drawing() {
  const scribble = useSharedValue(0);

  useEffect(() => {
    scribble.set(withRepeat(withTiming(1, { duration: 420 }), -1, true));
  }, [scribble]);

  const pencil = useAnimatedStyle(() => ({
    transform: [
      { translateX: (scribble.get() - 0.5) * 12 },
      { translateY: Math.abs(scribble.get() - 0.5) * -6 },
      { rotate: `${(scribble.get() - 0.5) * 28}deg` },
    ],
  }));

  return (
    <Animated.View exiting={FadeOut.duration(300)} style={[styles.badge, styles.caption]}>
      <Animated.Text style={[styles.pencil, pencil]}>✏️</Animated.Text>
      <Text style={styles.badgeLabel}>Leggy is drawing his attempt…</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  flex: {
    flex: 1,
  },
  card: {
    padding: 0,
    gap: 0,
    overflow: 'hidden',
  },
  hero: {
    aspectRatio: 4 / 3,
    overflow: 'hidden',
  },
  heroArt: {
    position: 'absolute',
    top: 52,
    bottom: 56,
    left: 0,
    right: 0,
  },
  badges: {
    position: 'absolute',
    top: Spacing.three,
    left: Spacing.three,
    right: Spacing.three,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeLabel: {
    color: Colors.black,
    fontFamily: Fonts.sansHeavy,
    fontSize: 14,
  },
  caption: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
  },
  pencil: {
    fontSize: 18,
  },
  body: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  heading: {
    gap: Spacing.one,
  },
  title: {
    color: Colors.black,
    fontFamily: Fonts.displayBold,
    fontSize: 32,
    lineHeight: 37,
  },
  line: {
    color: Colors.gray,
    fontFamily: Fonts.sansBold,
    fontSize: 17,
    lineHeight: 23,
  },
  steps: {
    gap: 12,
  },
  step: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  stepDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepEmoji: {
    fontSize: 22,
    lineHeight: 28,
  },
  stepText: {
    flex: 1,
    color: Colors.black,
    fontFamily: Fonts.sansBold,
    fontSize: 17,
    lineHeight: 23,
  },
  question: {
    gap: 2,
    backgroundColor: Colors.lemon,
    borderRadius: Radius.field,
    borderBottomWidth: 4,
    borderColor: Colors.lemonDark,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
  },
  questionLabel: {
    color: Colors.black,
    fontFamily: Fonts.sansHeavy,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  questionText: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 18,
    lineHeight: 24,
  },
  skill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.two,
    borderRadius: Radius.pill,
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
  },
  skillText: {
    color: Colors.black,
    fontFamily: Fonts.sansHeavy,
    fontSize: 15,
  },
  xp: {
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  xpText: {
    color: Colors.black,
    fontFamily: Fonts.sansHeavy,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
});
