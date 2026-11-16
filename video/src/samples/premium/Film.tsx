import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';

import { NightBackdrop, PaperBackdrop } from './Backdrop';
import { Chrome, Disclaimer } from './Chrome';
import { DriftCards } from './DriftCards';
import { HookScene } from './HookScene';
import { GLIDE, ramp } from './motion';
import { OutroScene } from './OutroScene';
import { type PhoneBeat, PhoneShowcase } from './PhoneShowcase';
import { COLOR } from './theme';
import { WeekScene, type WeekStop } from './WeekScene';

export type FilmPlan = {
  frames: number;
  hook: { beat: number; exitAt: number };
  phone: { from: number; exitAt: number; beats: PhoneBeat[] };
  week: { from: number; exitAt: number; finaleAt?: number; stops: WeekStop[] };
  outro: { from: number; builtWithAt: number };
};

export function PremiumFilm({ plan }: { plan: FilmPlan }) {
  const frame = useCurrentFrame();
  const lightAt = plan.hook.exitAt + 2;
  const lightDone = lightAt + 30;
  const reveal = ramp(frame, lightAt, lightDone, GLIDE);
  const radius = reveal * 2200;
  const clip = (extra: number) => (frame >= lightDone ? undefined : `circle(${radius + extra}px at 50% 106%)`);
  const chapters = [0, plan.phone.from, plan.week.from, plan.outro.from];
  const disclaimer = ramp(frame, plan.phone.from + 24, plan.phone.from + 40) * (1 - ramp(frame, plan.outro.from + 2, plan.outro.from + 12));
  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.night }}>
      {frame < lightDone ? (
        <AbsoluteFill>
          <NightBackdrop />
          <HookScene beat={plan.hook.beat} exitAt={plan.hook.exitAt} />
          <Chrome tone="dark" chapters={chapters} />
        </AbsoluteFill>
      ) : null}
      {frame >= lightAt && frame < lightDone ? (
        <AbsoluteFill style={{ backgroundColor: COLOR.accent, clipPath: clip(30 * (1 - reveal) + 6) }} />
      ) : null}
      {frame >= lightAt ? (
        <AbsoluteFill style={{ clipPath: clip(0) }}>
          <PaperBackdrop />
          <DriftCards />
          <Sequence from={plan.phone.from} durationInFrames={plan.phone.exitAt + 22} layout="none">
            <PhoneShowcase beats={plan.phone.beats} exitAt={plan.phone.exitAt} />
          </Sequence>
          <Sequence from={plan.week.from} durationInFrames={plan.week.exitAt + 18} layout="none">
            <WeekScene stops={plan.week.stops} exitAt={plan.week.exitAt} finaleAt={plan.week.finaleAt} />
          </Sequence>
          <Sequence from={plan.outro.from} layout="none">
            <OutroScene builtWithAt={plan.outro.builtWithAt} length={plan.frames - plan.outro.from} />
          </Sequence>
          <Disclaimer opacity={disclaimer} />
          <Chrome tone="light" chapters={chapters} hideTopAt={plan.outro.from} />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
}
