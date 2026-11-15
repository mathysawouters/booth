import type { ComponentProps } from 'react';
import type Ionicons from '@expo/vector-icons/Ionicons';

import type { Category, LegendKind, SkillName } from '@/lib/types';

type IconName = ComponentProps<typeof Ionicons>['name'];

export const CATEGORIES: { id: Category; label: string; icon: IconName }[] = [
  { id: 'bedtime', label: 'Bedtime', icon: 'moon' },
  { id: 'build', label: 'Build', icon: 'construct' },
  { id: 'story', label: 'Story', icon: 'book' },
  { id: 'outside', label: 'Outside', icon: 'leaf' },
  { id: 'kitchen', label: 'Kitchen', icon: 'restaurant' },
  { id: 'art', label: 'Art', icon: 'color-palette' },
  { id: 'music', label: 'Music', icon: 'musical-notes' },
  { id: 'skills', label: 'Skills', icon: 'trophy' },
  { id: 'calm', label: 'Calm', icon: 'water' },
  { id: 'surprise', label: 'Surprise me', icon: 'gift' },
];

export function orderedCategories(now: Date) {
  if (now.getHours() >= 18) {
    return CATEGORIES;
  }
  const [bedtime, ...rest] = CATEGORIES;
  const surprise = rest.pop()!;
  return [...rest, bedtime, surprise];
}

export const KINDS: Record<LegendKind, { label: string; icon: IconName }> = {
  story: { label: 'Story', icon: 'book' },
  adventure: { label: 'Adventure', icon: 'compass' },
  skill: { label: 'Skill', icon: 'trophy' },
  draw: { label: 'Draw', icon: 'brush' },
  quiz: { label: 'Quiz', icon: 'help-circle' },
  sound: { label: 'Sound', icon: 'musical-note' },
};

export const SKILLS: Record<SkillName, { label: string; icon: IconName }> = {
  brave: { label: 'Brave', icon: 'shield-checkmark' },
  kind: { label: 'Kind', icon: 'heart' },
  curious: { label: 'Curious', icon: 'search' },
  money: { label: 'Money', icon: 'cash' },
  helper: { label: 'Helper', icon: 'hand-left' },
  reader: { label: 'Reader', icon: 'library' },
};

export const WAITING_LINES = [
  'Leggy is tying its shoelaces…',
  'Leggy is looking under the couch for ideas…',
  'Leggy is asking the cat for advice…',
  'Leggy tripped over an idea. Picking it up…',
  'Leggy is counting to ten on its toes…',
];
