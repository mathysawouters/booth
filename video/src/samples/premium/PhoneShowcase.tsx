import { AbsoluteFill, useCurrentFrame } from 'remotion';

import type { LeggyPose } from '../../lib/assets';
import { GhostNumeral } from './Backdrop';
import { Confetti, EmojiBurst } from './Confetti';
import { KineticLine, Label, toWords } from './KineticText';
import { FloatingLeggy } from './Leggy';
import { EXPO_OUT, GLIDE, SOFT, clamp, mix, ramp, sway } from './motion';
import { FloatingPhone, ScreenShot, phoneSize } from './Phone';
import { COLOR, FONT, SAFE, shade } from './theme';

export type PhoneScreen = { src: string; at: number; long?: boolean };

export type PhoneBeat = {
  at: number;
  caption: string;
  chip: string;
  ghost: string;
  screens: PhoneScreen[];
  leggy?: LeggyPose;
  confettiAt?: number;
  cheerAt?: number;
  cheer?: string[];
};

type PhoneShowcaseProps = { beats: PhoneBeat[]; exitAt: number };

const SCREEN_WIDTH = 478;
const PHONE_X = 520;
const PHONE_Y = 1128;

const captionSize = (text: string) => (text.length <= 22 ? 144 : text.length <= 28 ? 118 : 102);

export function PhoneShowcase({ beats, exitAt }: PhoneShowcaseProps) {
  const frame = useCurrentFrame();
  const { height } = phoneSize(SCREEN_WIDTH);
  const enter = ramp(frame, 0, 36, EXPO_OUT);
  const exit = ramp(frame, exitAt, exitAt + 20, GLIDE);
  const beatEnd = (index: number) => beats[index + 1]?.at ?? exitAt;
  const screens = beats.flatMap((beat) => beat.screens.map((screen) => ({ ...screen, at: beat.at + screen.at })));
  const current = Math.max(0, screens.filter((screen) => frame >= screen.at).length - 1);
  const slide = current === 0 ? 1 : ramp(frame, screens[current].at, screens[current].at + 18, EXPO_OUT);
  const scrollOf = (index: number) =>
    screens[index].long ? ramp(frame, screens[index].at + 12, (screens[index + 1]?.at ?? exitAt) + 6, SOFT) * 0.74 : 0;
  const kick = current === 0 ? 0 : 1 - slide;
  const beatIndex = Math.max(0, beats.filter((beat) => frame >= beat.at).length - 1);
  const lean = (index: number) => (index % 2 === 0 ? -7 : 7);
  const bias = mix(ramp(frame, beats[beatIndex].at, beats[beatIndex].at + 34, GLIDE), lean(Math.max(0, beatIndex - 1)), lean(beatIndex));
  const rotateY = bias + sway(frame, 'phone-ry', 230, 8) + mix(enter, -18, 0) + kick * 7 + exit * 34;
  const rotateX = 6 + sway(frame, 'phone-rx', 170, 3.5) + mix(enter, 22, 0);
  const rotateZ = sway(frame, 'phone-rz', 260, 1.6) - exit * 6;
  const sheenStart = current === 0 ? 6 : screens[current].at;
  const sheen = mix(ramp(frame, sheenStart, sheenStart + 30, SOFT), -0.9, 1.3);
  const x = PHONE_X - bias * 3 + sway(frame, 'phone-x', 210, 10) - exit * 760;
  const y = PHONE_Y + mix(enter, 1250, 0) + sway(frame, 'phone-y', 120, 12);
  const scale = mix(enter, 0.9, 1) + (frame / exitAt) * 0.03 - exit * 0.2;
  return (
    <AbsoluteFill>
      {beats.map((beat, index) => {
        const show = ramp(frame, beat.at, beat.at + 24) * (1 - ramp(frame, beatEnd(index) - 10, beatEnd(index) + 6));
        if (show <= 0) {
          return null;
        }
        return (
          <GhostNumeral
            key={index}
            text={beat.ghost}
            size={880}
            color="rgba(12, 13, 11, 0.05)"
            x={540 - rotateY * 6 + mix(show, 80, 0)}
            y={1150 - rotateX * 4}
            style={{ opacity: show }}
          />
        );
      })}
      <div style={{ position: 'absolute', left: SAFE.x, right: SAFE.x, top: 216 }}>
        {beats.map((beat, index) => {
          const end = beatEnd(index) - clamp((beatEnd(index) - beat.at) * 0.25, 12, 16);
          if (frame < beat.at - 2 || frame > end + 24) {
            return null;
          }
          return (
            <div key={index} style={{ position: 'absolute', left: 0, right: 0, top: 0 }}>
              <KineticLine
                words={toWords(beat.caption, 1)}
                at={beat.at + (index === 0 ? 8 : 3)}
                stagger={2}
                out={end}
                size={captionSize(beat.caption)}
                color={COLOR.ink}
                style={{ rowGap: '0.06em' }}
              />
            </div>
          );
        })}
      </div>
      <Label
        color={COLOR.inkSoft}
        style={{
          position: 'absolute',
          left: 96,
          top: 1180,
          transformOrigin: 'left top',
          transform: `rotate(-90deg) translateX(${mix(enter, -80, 0) + sway(frame, 'side-label', 200, 16)}px)`,
          opacity: enter * (1 - exit),
        }}
      >
        10 minutes · every day
      </Label>
      <FloatingPhone
        screenWidth={SCREEN_WIDTH}
        x={x}
        y={y}
        scale={scale}
        opacity={1 - exit}
        rotateX={rotateX}
        rotateY={rotateY}
        rotateZ={rotateZ}
        sheen={sheen}
      >
        {current > 0 && slide < 1 ? (
          <ScreenShot src={screens[current - 1].src} scroll={scrollOf(current - 1)} offset={-0.3 * slide} dim={0.3 * slide} />
        ) : null}
        <ScreenShot src={screens[current].src} scroll={scrollOf(current)} offset={1 - slide} />
      </FloatingPhone>
      {beats.map((beat, index) => {
        const end = beatEnd(index);
        const show = ramp(frame, beat.at + 14, beat.at + 36) * (1 - ramp(frame, end - 8, end + 4, SOFT));
        if (show <= 0) {
          return null;
        }
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: 44,
              top: 1420 + (index % 2) * 90 + sway(frame, `chip-${index}`, 110, 10),
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              height: 88,
              padding: '0 34px 0 28px',
              borderRadius: 44,
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              boxShadow: `0 26px 50px ${shade(0.16)}, 0 4px 10px ${shade(0.08)}`,
              fontFamily: FONT.display,
              fontWeight: 800,
              fontSize: 40,
              letterSpacing: '-0.03em',
              color: COLOR.ink,
              opacity: show,
              transform: `translateX(${mix(show, -90, 0)}px)`,
            }}
          >
            <div style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: COLOR.accent }} />
            {beat.chip}
          </div>
        );
      })}
      {beats.map((beat, index) => {
        const end = beatEnd(index);
        if (!beat.leggy) {
          return null;
        }
        const show = ramp(frame, beat.at + 8, beat.at + 32) * (1 - ramp(frame, end - 10, end + 2, SOFT));
        if (show <= 0) {
          return null;
        }
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: 770,
              top: 1170,
              opacity: Math.min(1, show * 1.4),
              transform: `translate(${mix(show, 150, 0)}px, ${mix(show, 40, 0)}px)`,
            }}
          >
            <FloatingLeggy pose={beat.leggy} height={440} seed={`showcase-${index}`} tilt={3} softShadow />
          </div>
        );
      })}
      {beats.map((beat, index) => (
        <AbsoluteFill key={index} style={{ opacity: 1 - exit }}>
          {beat.confettiAt === undefined ? null : (
            <Confetti at={beat.at + beat.confettiAt} x={x} y={y - height * 0.1} seed={`confetti-${index}`} />
          )}
          {beat.cheerAt === undefined || !beat.cheer ? null : (
            <EmojiBurst at={beat.at + beat.cheerAt} x={x} y={y + height * 0.2} emoji={beat.cheer} seed={`cheer-${index}`} />
          )}
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
}
