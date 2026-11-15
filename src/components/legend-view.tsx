import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { LeggySays } from '@/components/leggy';
import { Body, Button, Card, TextButton } from '@/components/ui';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { KINDS, SKILLS } from '@/lib/legends';
import type { Legend } from '@/lib/types';

export function LegendView({
  legend,
  rerolling,
  onRead,
  onDone,
  onReroll,
  onPicker,
  onSkip,
}: {
  legend: Legend;
  rerolling: boolean;
  onRead: () => void;
  onDone: () => void;
  onReroll: () => void;
  onPicker: () => void;
  onSkip: () => void;
}) {
  const kind = KINDS[legend.kind];
  const skill = SKILLS[legend.skill];
  return (
    <View style={styles.container}>
      <TextButton label="Pick something else" onPress={onPicker} />

      {legend.challenge !== undefined && (
        <View style={styles.challenge}>
          <LeggySays mood="wow">{legend.challenge}</LeggySays>
          <View style={styles.attempt}>
            {legend.challengeImageUrl !== null ? (
              <Image source={{ uri: legend.challengeImageUrl }} style={styles.attemptImage} contentFit="cover" />
            ) : (
              <View style={[styles.attemptImage, styles.attemptPending]}>
                <ActivityIndicator color={Colors.black} />
              </View>
            )}
            <Text style={styles.caption}>
              {legend.challengeImageUrl !== null ? "Leggy's try. Can you do better?" : 'Leggy is still drawing its try…'}
            </Text>
          </View>
        </View>
      )}

      <Card style={styles.card}>
        <View style={styles.meta}>
          <View style={styles.kind}>
            <Ionicons name={kind.icon} size={22} color={Colors.black} />
            <Text style={styles.kindLabel}>{kind.label}</Text>
          </View>
          <Text style={styles.minutes}>{legend.minutes} min</Text>
        </View>
        <Text style={styles.title}>{legend.title}</Text>
        <View style={styles.steps}>
          {legend.steps.map((step, i) => (
            <View key={i} style={styles.step}>
              <Text style={styles.stepNumber}>{i + 1}</Text>
              <Body style={styles.stepText}>{step}</Body>
            </View>
          ))}
        </View>
        <View style={styles.skill}>
          <Ionicons name={skill.icon} size={20} color={Colors.black} />
          <Text style={styles.skillText}>
            Trains {skill.label} · +{legend.xp} XP
          </Text>
        </View>
      </Card>

      {legend.kind === 'story' && (legend.story?.length ?? 0) > 0 && (
        <Button label="Read it aloud" icon="book" variant="outline" onPress={onRead} />
      )}
      <Button label="We did it!" icon="checkmark-circle" variant="accent" onPress={onDone} />
      <Button label="Another idea" icon="shuffle" variant="outline" onPress={onReroll} loading={rerolling} />
      <TextButton label="Not today" onPress={onSkip} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  challenge: {
    gap: Spacing.three,
  },
  attempt: {
    gap: Spacing.two,
  },
  attemptImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: Radius.tile,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.soft,
  },
  attemptPending: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {
    color: Colors.gray,
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  card: {
    gap: Spacing.four,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kind: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.greenSoft,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
  },
  kindLabel: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '800',
  },
  minutes: {
    color: Colors.gray,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '800',
  },
  title: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  steps: {
    gap: Spacing.three,
  },
  step: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.black,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 32,
    fontFamily: Fonts.sans,
    fontSize: 17,
    fontWeight: '900',
    overflow: 'hidden',
  },
  stepText: {
    flex: 1,
    fontSize: 20,
    lineHeight: 28,
  },
  skill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderTopWidth: 1,
    borderTopColor: Colors.line,
    paddingTop: Spacing.three,
  },
  skillText: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 17,
    fontWeight: '800',
  },
});
