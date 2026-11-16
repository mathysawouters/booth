import type { ComponentProps } from 'react';
import type Ionicons from '@expo/vector-icons/Ionicons';

import type { Category, LegendKind, Mode, SkillName } from '@/lib/types';

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

type MenuItem = { category: Category; label: string };

const MENUS: Record<Mode, MenuItem[]> = {
  real: [
    { category: 'build', label: 'Build' },
    { category: 'outside', label: 'Outside' },
    { category: 'kitchen', label: 'Kitchen' },
    { category: 'art', label: 'Art' },
    { category: 'music', label: 'Music' },
    { category: 'skills', label: 'Skills' },
    { category: 'calm', label: 'Calm' },
    { category: 'bedtime', label: 'Bedtime' },
  ],
  phone: [
    { category: 'story', label: 'Story time' },
    { category: 'art', label: 'Draw together' },
    { category: 'skills', label: 'Quiz' },
    { category: 'music', label: 'Guess the sound' },
    { category: 'bedtime', label: 'Bedtime story' },
  ],
};

export function menuFor(mode: Mode, now: Date): MenuItem[] {
  const menu = MENUS[mode];
  if (now.getHours() < 18) {
    return menu;
  }
  return [...menu.filter((item) => item.category === 'bedtime'), ...menu.filter((item) => item.category !== 'bedtime')];
}

export const KINDS: Record<LegendKind, { label: string; icon: IconName; line: string }> = {
  story: { label: 'Story', icon: 'book', line: 'A story to read together.' },
  adventure: { label: 'Adventure', icon: 'compass', line: 'A little mission for two.' },
  skill: { label: 'Skill', icon: 'trophy', line: 'Learn a real-life trick.' },
  draw: { label: 'Draw', icon: 'brush', line: 'Make something silly together.' },
  quiz: { label: 'Quiz', icon: 'help-circle', line: 'A quick quiz, out loud.' },
  sound: { label: 'Sound', icon: 'musical-note', line: 'Make and guess funny sounds.' },
};

export const SKILLS: Record<SkillName, { label: string; icon: IconName; growing: string }> = {
  brave: { label: 'Brave', icon: 'shield-checkmark', growing: 'braver' },
  kind: { label: 'Kind', icon: 'heart', growing: 'kinder' },
  curious: { label: 'Curious', icon: 'search', growing: 'more curious' },
  money: { label: 'Money', icon: 'cash', growing: 'smarter with money' },
  helper: { label: 'Helper', icon: 'hand-left', growing: 'more helpful' },
  reader: { label: 'Reader', icon: 'library', growing: 'a stronger reader' },
};

const STEP_EMOJI: [RegExp, string][] = [
  [/photo|snap|picture|selfie/i, '📸'],
  [/draw|doodle|sketch|crayon|marker|paint|color/i, '🖍️'],
  [/build|stack|fort|tower|cushion|pillow|blanket|box|den/i, '🧱'],
  [/read|story|book|page/i, '📖'],
  [/sing|song|hum|music|beat|drum|band/i, '🎵'],
  [/dance|jump|hop|run|race|wiggle|crawl|stomp/i, '🤸'],
  [/hide|find|search|hunt|spy|treasure|look for/i, '🔍'],
  [/count|coin|pay|price|money|shop/i, '🪙'],
  [/eat|snack|fruit|cook|kitchen|taste|smell|mix|stir/i, '🍓'],
  [/sleep|bed|breath|calm|quiet|whisper|eyes/i, '🌙'],
  [/outside|walk|garden|park|sky|cloud|leaf|leaves|nature/i, '🌿'],
  [/guess|quiz|question|ask|answer/i, '❓'],
  [/record|sound|listen|voice/i, '🎤'],
  [/hug|thank|kind|help|share|tidy/i, '💛'],
  [/swap|turn|together|cheer|celebrate|high five/i, '🙌'],
];

const STEP_FALLBACK = ['👉', '✨', '🎉'];

export function stepEmoji(step: string, index: number): string {
  return STEP_EMOJI.find(([pattern]) => pattern.test(step))?.[1] ?? STEP_FALLBACK[index % STEP_FALLBACK.length];
}

export function shortStep(step: string): string {
  const first = step.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? step;
  return first.replace(/\.$/, '');
}

export const WAITING_LINES = [
  'Leggy is tying its shoelaces…',
  'Leggy is looking under the couch…',
  'Leggy is asking the cat for advice…',
  'Leggy tripped over an idea…',
  'Leggy is counting on its toes…',
];
