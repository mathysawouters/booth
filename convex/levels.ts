import type { Skill } from "./schema";

export const SKILLS: Skill[] = ["brave", "kind", "curious", "money", "helper", "reader"];

export function xpForMinutes(minutes: number): number {
  return 10 + minutes * 2;
}

export function levelForXp(xp: number) {
  let level = 1;
  let levelXp = Math.max(0, xp);
  let nextLevelXp = 50;
  while (levelXp >= nextLevelXp) {
    levelXp -= nextLevelXp;
    level += 1;
    nextLevelXp = 50 + 25 * (level - 1);
  }
  return { level, levelXp, nextLevelXp };
}
