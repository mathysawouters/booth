import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { LeggySays } from '@/components/leggy';
import { Body, Button, Card, TextButton } from '@/components/ui';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { CATEGORY_ART, KINDS, SKILLS } from '@/lib/legends';
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
      <Card style={styles.card}>
        <View style={styles.hero}>
          {legend.challengeImageUrl !== null ? (
            <Image source={{ uri: legend.challengeImageUrl }} style={styles.heroImage} contentFit="cover" transition={200} />
          ) : (
            <Image
              source={CATEGORY_ART[legend.category]}
              style={[styles.heroArt, legend.challenge !== undefined && styles.heroArtCaptioned]}
              contentFit="contain"
            />
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
          {legend.challenge !== undefined && (
            <View style={[styles.badge, styles.caption]}>
              {legend.challengeImageUrl === null && <ActivityIndicator size="small" color={Colors.black} />}
              <Text style={styles.badgeLabel}>
                {legend.challengeImageUrl !== null ? "Leggy's try. Can you do better?" : 'Leggy is still drawing its try…'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>{legend.title}</Text>
          {legend.challenge !== undefined && (
            <LeggySays pose={legend.category === 'bedtime' ? 'sleeping' : 'waving'} size={96}>
              {legend.challenge}
            </LeggySays>
          )}
          <View style={styles.steps}>
            {legend.steps.map((step, i) => (
              <View key={i} style={styles.step}>
                <View style={styles.stepDot}>
                  <Text style={styles.stepNumber}>{i + 1}</Text>
                </View>
                <Body style={styles.stepText}>{step}</Body>
              </View>
            ))}
          </View>
          <View style={styles.skill}>
            <Ionicons name={skill.icon} size={18} color={Colors.greenDeep} />
            <Text style={styles.skillText}>Trains {skill.label}</Text>
            <View style={styles.xp}>
              <Text style={styles.xpText}>+{legend.xp} XP</Text>
            </View>
          </View>
        </View>
      </Card>

      {legend.kind === 'story' && (legend.story?.length ?? 0) > 0 && (
        <Button label="Read it aloud" icon="book" variant="soft" onPress={onRead} />
      )}
      <Button label="We did it!" icon="checkmark-circle" variant="accent" onPress={onDone} />
      <Button label="Another idea" icon="shuffle" variant="soft" onPress={onReroll} loading={rerolling} />
      <View style={styles.links}>
        <TextButton label="Pick something else" onPress={onPicker} />
        <TextButton label="Not today" onPress={onSkip} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  card: {
    padding: 0,
    gap: 0,
  },
  hero: {
    aspectRatio: 4 / 3,
    borderTopLeftRadius: Radius.card,
    borderTopRightRadius: Radius.card,
    backgroundColor: Colors.greenSoft,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroArt: {
    position: 'absolute',
    top: 56,
    bottom: Spacing.two,
    left: 0,
    right: 0,
  },
  heroArtCaptioned: {
    bottom: 60,
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
    fontFamily: Fonts.sansBold,
    fontSize: 14,
  },
  caption: {
    position: 'absolute',
    bottom: Spacing.three,
    alignSelf: 'center',
  },
  body: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    color: Colors.black,
    fontFamily: Fonts.displayBold,
    fontSize: 30,
    lineHeight: 36,
  },
  steps: {
    gap: Spacing.three,
  },
  step: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'flex-start',
  },
  stepDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 16,
  },
  stepText: {
    flex: 1,
    paddingTop: 2,
  },
  skill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.two,
    backgroundColor: Colors.greenSoft,
    borderRadius: Radius.pill,
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
  },
  skillText: {
    color: Colors.black,
    fontFamily: Fonts.sansBold,
    fontSize: 15,
  },
  xp: {
    backgroundColor: Colors.green,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  xpText: {
    color: Colors.black,
    fontFamily: Fonts.sansHeavy,
    fontSize: 14,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.three,
  },
});
