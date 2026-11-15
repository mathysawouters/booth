import type { ComponentProps } from 'react';
import type Ionicons from '@expo/vector-icons/Ionicons';

import type { Category, LegendKind, SkillName } from '@/lib/types';

type IconName = ComponentProps<typeof Ionicons>['name'];

export const CATEGORY_ART: Record<Category, number> = {
  bedtime: require('@/assets/illustrations/category-bedtime.png'),
  build: require('@/assets/illustrations/category-build.png'),
  story: require('@/assets/illustrations/category-story.png'),
  outside: require('@/assets/illustrations/category-outside.png'),
  kitchen: require('@/assets/illustrations/category-kitchen.png'),
  art: require('@/assets/illustrations/category-art.png'),
  music: require('@/assets/illustrations/category-music.png'),
  skills: require('@/assets/illustrations/category-skills.png'),
  calm: require('@/assets/illustrations/category-calm.png'),
  surprise: require('@/assets/illustrations/category-surprise.png'),
};

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'bedtime', label: 'Bedtime' },
  { id: 'build', label: 'Build' },
  { id: 'story', label: 'Story' },
  { id: 'outside', label: 'Outside' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'art', label: 'Art' },
  { id: 'music', label: 'Music' },
  { id: 'skills', label: 'Skills' },
  { id: 'calm', label: 'Calm' },
  { id: 'surprise', label: 'Surprise me' },
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

export const SKILLS: Record<SkillName, { label: string; icon: IconName; growing: string }> = {
  brave: { label: 'Brave', icon: 'shield-checkmark', growing: 'braver' },
  kind: { label: 'Kind', icon: 'heart', growing: 'kinder' },
  curious: { label: 'Curious', icon: 'search', growing: 'more curious' },
  money: { label: 'Money', icon: 'cash', growing: 'smarter with money' },
  helper: { label: 'Helper', icon: 'hand-left', growing: 'more helpful' },
  reader: { label: 'Reader', icon: 'library', growing: 'a stronger reader' },
};

export const WAITING_LINES = [
  'Leggy is tying its shoelaces…',
  'Leggy is looking under the couch for ideas…',
  'Leggy is asking the cat for advice…',
  'Leggy tripped over an idea. Picking it up…',
  'Leggy is counting to ten on its toes…',
];
