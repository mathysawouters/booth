import type { ReactNode } from 'react';
import { AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

import { LEGGY, type LeggyPose, SCREENS, photo } from '../lib/assets';
import { COPY, KID, WEEK } from '../lib/data';
import {
  Bg,
  C,
  Confetti,
  Disclaimer,
  DISPLAY,
  Leggy,
  Phone,
  PHONE_SCREEN,
  PhotoCard,
  PopWords,
  SANS,
  Shot,
  Sticker,
  usePop,
  Wipe,
} from './candy/kit';

const HOOK = 50;
const STING = 64;
const BEAT = 96;
const WEEK_INTRO = 40;
const DAY = 62;
const WEEK_END = 76;
const OUTRO = 180;
const OVERLAP = 12;

type Beat = {
  caption: string;
  accent?: string;
  bg: string;
  ray: string;
  pose: LeggyPose;
  shots: [string, number][];
  scroll?: [string, number];
  stickers: [string, number, number, number, string][];
  confetti?: number;
  emoji?: number;
};

const BEATS: Beat[] = [
  {
    caption: 'One surprise every night',
    accent: 'surprise',
    bg: C.pink,
    ray: C.pinkLight,
    pose: 'thinking',
    shots: [
      [SCREENS.todaySurprise, 0],
      [SCREENS.surpriseShake, 30],
      [SCREENS.surpriseOpen, 48],
      [SCREENS.revealed, 58],
    ],
    stickers: [
      ['🎁', 120, 700, -12, C.lemon],
      ['Tap!', 965, 1180, 10, C.mint],
    ],
    confetti: 50,
  },
  {
    caption: 'A 10-minute idea, made for your kid',
    accent: '10-minute',
    bg: C.mint,
    ray: C.mintLight,
    pose: 'waving',
    shots: [],
    scroll: [SCREENS.tonightLong, 520],
    stickers: [
      ['10 min', 125, 760, -10, C.lemon],
      ['🦖', 965, 1050, 12, C.pink],
    ],
  },
  {
    caption: 'Leggy tries it first. Badly.',
    accent: 'Badly.',
    bg: C.lemon,
    ray: C.lemonLight,
    pose: 'thinking',
    shots: [[SCREENS.legend, 0]],
    stickers: [
      ['Oops!', 130, 900, -14, C.pink],
      ['😅', 960, 700, 10, C.white],
      ['Can you do better?', 720, 1560, -4, C.mint],
    ],
  },
  {
    caption: 'Snap it. Save what they said.',
    accent: 'Snap',
    bg: C.green,
    ray: '#9BEA55',
    pose: 'proud',
    shots: [
      [SCREENS.weDidIt, 0],
      [SCREENS.celebration, 50],
    ],
    stickers: [
      ['📸', 120, 720, -12, C.white],
      ['+40 XP', 950, 1100, 12, C.lemon],
    ],
    confetti: 52,
  },
  {
    caption: 'Skills level up',
    accent: 'level',
    bg: C.pink,
    ray: C.pinkLight,
    pose: 'cheering',
    shots: [[SCREENS.levelUp, 0]],
    stickers: [
      ['Level 2!', 140, 800, -12, C.lemon],
      ['⭐', 960, 660, 14, C.white],
      ['Curious', 940, 1250, 8, C.mint],
    ],
    confetti: 10,
  },
  {
    caption: 'Every memory lands in the Book',
    accent: 'Book',
    bg: C.mint,
    ray: C.mintLight,
    pose: 'reading',
    shots: [],
    scroll: [SCREENS.bookLong, 1080],
    stickers: [
      ['📖', 120, 700, -10, C.white],
      ['🔥 7 days', 930, 1150, 10, C.lemon],
    ],
  },
  {
    caption: 'Grandma cheers live',
    accent: 'live',
    bg: C.lemon,
    ray: C.lemonLight,
    pose: 'cheering',
    shots: [
      [SCREENS.familyFeed, 0],
      [SCREENS.familyCheer, 44],
    ],
    stickers: [
      ['👵', 125, 760, -12, C.white],
      ['Live!', 955, 700, 12, C.pink],
    ],
    emoji: 46,
    confetti: 48,
  },
];

const APP = BEATS.length * BEAT;
const WEEK_LENGTH = WEEK_INTRO + WEEK.length * DAY + WEEK_END;

export const CANDY_POP_FULL_FRAMES = HOOK * 3 + STING + APP + WEEK_LENGTH + OUTRO;

function Scene({ from, length, first, children }: { from: number; length: number; first?: boolean; children: ReactNode }) {
  return (
    <Sequence from={from} durationInFrames={length + OVERLAP}>
      <Wipe off={first}>{children}</Wipe>
    </Sequence>
  );
}

function Centered({ bottom = 140, top = 140, children }: { bottom?: number; top?: number; children: ReactNode }) {
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: `${top}px 64px ${bottom}px` }}>
      {children}
    </AbsoluteFill>
  );
}

function Hook() {
  return (
    <>
      <Scene from={0} length={HOOK} first>
        <Bg color={C.night} ray={C.nightLight} seed="h1">
          <Centered bottom={640}>
            <PopWords text={COPY.hook[0]} size={250} color={C.lemon} shadow={C.greenDark} />
          </Centered>
          <Sticker x={260} y={300} rot={-10} start={8} bg={C.pink} size={62}>
            🕖 7:00 PM
          </Sticker>
          <Sticker x={880} y={1180} rot={12} start={14} bg={C.mint} size={84}>
            🌙
          </Sticker>
          <Leggy pose="sleeping" x={250} y={1230} height={540} from="bottom" start={4} />
        </Bg>
      </Scene>
      <Scene from={HOOK} length={HOOK}>
        <Bg color={C.pink} ray={C.pinkLight} seed="h2">
          <Centered bottom={700}>
            <PopWords text={COPY.hook[1]} size={230} color={C.white} outline={C.ink} shadow={C.ink} />
          </Centered>
          <Sticker x={850} y={290} rot={12} start={8} bg={C.white} size={84}>
            😴
          </Sticker>
          <Sticker x={820} y={1240} rot={-8} start={14} bg={C.lemon} size={60}>
            Long day
          </Sticker>
          <Leggy pose="thinking" x={110} y={1130} height={660} from="left" start={3} />
        </Bg>
      </Scene>
      <Scene from={HOOK * 2} length={HOOK}>
        <Bg color={C.lemon} ray={C.lemonLight} seed="h3">
          <Centered bottom={680}>
            <PopWords text={COPY.hook[2]} size={186} accent="play." accentColor={C.pink} outline={C.ink} color={C.white} shadow={C.ink} />
          </Centered>
          <Sticker x={210} y={1290} rot={-12} start={10} bg={C.mint} size={90}>
            🦖
          </Sticker>
          <Sticker x={250} y={1560} rot={8} start={16} bg={C.pink} size={56}>
            Now?!
          </Sticker>
          <Leggy pose="cheering" x={520} y={1120} height={660} from="right" start={3} />
          <Confetti start={12} y={700} seed="h3" />
        </Bg>
      </Scene>
    </>
  );
}

function Sting() {
  return (
    <Bg color={C.green} ray="#9BEA55" seed="sting">
      <Sticker x={540} y={250} rot={-4} start={2} bg={C.lemon} size={64}>
        Meet
      </Sticker>
      <Centered bottom={860} top={300}>
        <PopWords text={COPY.name} size={214} color={C.white} outline={C.ink} shadow={C.ink} />
      </Centered>
      <Leggy pose="waving" x={340} y={1010} height={720} from="bottom" start={6} />
      <Confetti start={8} y={800} seed="sting" />
    </Bg>
  );
}

function Scrolling({ src, amount }: { src: string; amount: number }) {
  const frame = useCurrentFrame();
  const scroll = interpolate(frame, [20, BEAT - 2], [0, amount], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  return <Shot src={src} scroll={scroll} />;
}

function BigEmoji({ start }: { start: number }) {
  const frame = useCurrentFrame();
  const s = usePop(start, { damping: 7, stiffness: 150, mass: 0.7 });
  const t = frame - start;
  if (t < 0) {
    return null;
  }
  return (
    <>
      {['🎉', '❤️', '👏'].map((emoji, i) => (
        <div
          key={emoji}
          style={{
            position: 'absolute',
            left: 540 + (i - 1) * 300,
            top: 1040 - t * (3 + i) - (i === 0 ? 0 : 140),
            fontSize: i === 0 ? 400 : 210,
            lineHeight: 1,
            transform: `translate(-50%, -50%) scale(${s}) rotate(${Math.sin((t + i * 8) / 5) * 12}deg)`,
          }}>
          {emoji}
        </div>
      ))}
    </>
  );
}

function App() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const index = Math.min(BEATS.length - 1, Math.floor(frame / BEAT));
  const enter = spring({ frame: frame - 4, fps, config: { damping: 11, stiffness: 110, mass: 0.8 } });
  const bump = spring({ frame: frame - index * BEAT, fps, config: { damping: 7, stiffness: 190, mass: 0.5 } });
  const tilt = (index % 2 === 0 ? -3 : 3) * bump + Math.sin(frame / 22) * 1.2;
  return (
    <AbsoluteFill>
      {BEATS.map((beat, i) =>
        i > index || i < index - 1 ? null : (
          <Sequence key={beat.caption} from={i * BEAT} durationInFrames={BEAT + OVERLAP}>
            <Wipe off={i === 0} y={1090}>
              <Bg color={beat.bg} ray={beat.ray} seed={`b${i}`}>
                <div
                  style={{
                    position: 'absolute',
                    left: 64,
                    right: 64,
                    top: 140,
                    height: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <PopWords
                    text={beat.caption}
                    size={beat.caption.length > 26 ? 92 : 112}
                    start={3}
                    gap={3}
                    color={C.white}
                    outline={C.ink}
                    shadow={C.ink}
                    accent={beat.accent}
                    accentColor={beat.bg === C.lemon ? C.pink : C.lemon}
                  />
                </div>
              </Bg>
            </Wipe>
          </Sequence>
        ),
      )}
      <div
        style={{
          position: 'absolute',
          left: (1080 - PHONE_SCREEN - 36) / 2,
          top: 470,
          transform: `translateY(${(1 - enter) * 1500}px) rotate(${tilt}deg) scale(${0.93 + bump * 0.07})`,
        }}>
        <Phone>
          {BEATS.map((beat, i) => (
            <Sequence key={beat.caption} from={i * BEAT} durationInFrames={BEAT * 2} layout="none">
              {beat.scroll ? <Scrolling src={beat.scroll[0]} amount={beat.scroll[1]} /> : null}
              {beat.shots.map(([src, at]) => (
                <Shot key={src} src={src} at={at} />
              ))}
            </Sequence>
          ))}
        </Phone>
      </div>
      {BEATS.map((beat, i) => {
        const height = 430;
        const width = (height * LEGGY[beat.pose].width) / LEGGY[beat.pose].height;
        const left = i % 2 === 0;
        return (
          <Sequence key={beat.caption} from={i * BEAT} durationInFrames={BEAT} layout="none">
            {beat.stickers.map(([label, x, y, rot, bg], j) => (
              <Sticker key={label} x={x} y={y} rot={rot} bg={bg} start={10 + j * 6} size={label.length > 8 ? 46 : label.length > 2 ? 58 : 92}>
                {label}
              </Sticker>
            ))}
            <Leggy pose={beat.pose} x={left ? -24 : 1104 - width} y={1380} height={height} from={left ? 'left' : 'right'} start={4} />
            {beat.emoji !== undefined ? <BigEmoji start={beat.emoji} /> : null}
            {beat.confetti !== undefined ? <Confetti start={beat.confetti} y={1000} seed={`b${i}`} /> : null}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
}

const DAY_COLORS: [string, string][] = [
  [C.lemon, C.lemonLight],
  [C.pink, C.pinkLight],
  [C.mint, C.mintLight],
  [C.green, '#9BEA55'],
];
const DAY_POSES: LeggyPose[] = ['cheering', 'proud', 'waving', 'thinking', 'sleeping', 'proud', 'cheering'];

function Day({ index }: { index: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const day = WEEK[index];
  const [bg, ray] = DAY_COLORS[index % DAY_COLORS.length];
  const side = index % 2 === 0 ? -1 : 1;
  const fly = spring({ frame: frame - 2, fps, config: { damping: 11, stiffness: 140, mass: 0.7 } });
  const title = usePop(6);
  const bubble = usePop(14);
  const pose = DAY_POSES[index % DAY_POSES.length];
  const leggyHeight = pose === 'sleeping' ? 300 : 430;
  const leggyWidth = (leggyHeight * LEGGY[pose].width) / LEGGY[pose].height;
  return (
    <Bg color={bg} ray={ray} seed={`d${index}`}>
      <Sticker x={200} y={250} rot={-8} bg={C.white} size={88}>
        {day.weekday.toUpperCase()}
      </Sticker>
      <div
        style={{
          position: 'absolute',
          left: 370,
          right: 56,
          top: 150,
          height: 200,
          display: 'flex',
          alignItems: 'center',
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: day.title.length > 24 ? 60 : 70,
          lineHeight: 1.04,
          color: C.ink,
          transform: `scale(${title})`,
          transformOrigin: '0% 50%',
        }}>
        {day.title}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 150,
          top: 400,
          transform: `translateX(${(1 - fly) * side * 1300}px) rotate(${(1 - fly) * side * 34}deg)`,
        }}>
        <PhotoCard src={photo(day.photo)} size={780} rot={side * -3 + Math.sin(frame / 14) * 1.2} />
      </div>
      {day.level !== null ? (
        <Sticker x={side < 0 ? 800 : 290} y={430} rot={side * -9} start={18} bg={bg === C.lemon ? C.pink : C.lemon} size={48}>
          {day.skill} level {day.level}!
        </Sticker>
      ) : null}
      {day.cheer !== null ? (
        <Sticker x={side < 0 ? 270 : 810} y={1150} rot={side * 8} start={24} size={56}>
          {day.cheer} Grandma
        </Sticker>
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: side < 0 ? 56 : 330,
          width: 694,
          top: 1250,
          transform: `scale(${bubble}) rotate(${side * 1.5}deg)`,
          transformOrigin: side < 0 ? '100% 50%' : '0% 50%',
          backgroundColor: C.white,
          borderRadius: 48,
          boxShadow: `0 0 0 6px ${C.ink}, 0 16px 0 6px ${C.ink}`,
          padding: '30px 38px',
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 44,
          lineHeight: 1.18,
          color: C.ink,
        }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 34, color: C.greenDark, marginBottom: 6 }}>
          {KID.name}, {KID.age}
        </div>
        “{day.quote}”
      </div>
      <Leggy
        pose={pose}
        x={side < 0 ? 1090 - leggyWidth : -10}
        y={1730 - leggyHeight}
        height={leggyHeight}
        from={side < 0 ? 'right' : 'left'}
        start={8}
      />
      <Disclaimer />
    </Bg>
  );
}

const GRID: [number, number][] = [
  [215, 600],
  [565, 600],
  [40, 950],
  [390, 950],
  [740, 950],
  [215, 1300],
  [565, 1300],
];

function WeekEnd() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Bg color={C.green} ray="#9BEA55" seed="end">
      <div style={{ position: 'absolute', left: 64, right: 64, top: 140, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PopWords text="7 days. 7 little legends." size={132} color={C.white} outline={C.ink} shadow={C.ink} accent="legends." accentColor={C.lemon} />
      </div>
      {WEEK.map((day, i) => {
        const s = spring({ frame: frame - 6 - i * 4, fps, config: { damping: 9, stiffness: 170, mass: 0.6 } });
        return (
          <div
            key={day.photo}
            style={{
              position: 'absolute',
              left: GRID[i][0],
              top: GRID[i][1],
              transform: `scale(${s}) rotate(${(i % 2 === 0 ? -5 : 5) + Math.sin((frame + i * 11) / 9) * 2}deg)`,
            }}>
            <PhotoCard src={photo(day.photo)} size={300} />
          </div>
        );
      })}
      <Sticker x={540} y={1690} rot={-3} start={34} bg={C.lemon} size={60}>
        🔥 7 day streak
      </Sticker>
      <Confetti start={30} y={900} seed="end" />
      <Disclaimer />
    </Bg>
  );
}

function WeekIntro() {
  return (
    <Bg color={C.pink} ray={C.pinkLight} seed="wi">
      <Centered bottom={760}>
        <PopWords text={`One week with ${KID.name}`} size={190} color={C.white} outline={C.ink} shadow={C.ink} accent={KID.name} accentColor={C.lemon} />
      </Centered>
      <Sticker x={300} y={1180} rot={-8} start={10} bg={C.lemon} size={62}>
        🦖 loves {KID.loves}
      </Sticker>
      <Sticker x={800} y={1340} rot={8} start={15} bg={C.mint} size={62}>
        Mon → Sun
      </Sticker>
      <Leggy pose="proud" x={380} y={1290} height={480} from="bottom" start={4} />
    </Bg>
  );
}

function Outro() {
  return (
    <Bg color={C.green} ray="#9BEA55" seed="outro">
      <Leggy pose="waving" x={352} y={200} height={640} from="bottom" start={2} />
      <div style={{ position: 'absolute', left: 64, right: 64, top: 880, height: 470, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PopWords text={COPY.name} size={214} start={8} color={C.white} outline={C.ink} shadow={C.ink} />
      </div>
      <Sticker
        x={540}
        y={1480}
        rot={-2}
        start={28}
        bg={C.lemon}
        size={58}
        style={{ whiteSpace: 'normal', width: 860, textAlign: 'center' }}>
        {COPY.tagline}
      </Sticker>
      <Sticker x={540} y={1716} rot={1} start={70} bg={C.white} size={36}>
        {COPY.builtWith}
      </Sticker>
      <Confetti start={10} y={900} seed="o1" />
      <Confetti start={72} y={1300} seed="o2" />
    </Bg>
  );
}

export function CandyPopFull() {
  const app = HOOK * 3 + STING;
  const week = app + APP;
  const outro = week + WEEK_LENGTH;
  return (
    <AbsoluteFill style={{ backgroundColor: C.night }}>
      <Hook />
      <Scene from={HOOK * 3} length={STING}>
        <Sting />
      </Scene>
      <Scene from={app} length={APP}>
        <App />
      </Scene>
      <Scene from={week} length={WEEK_INTRO}>
        <WeekIntro />
      </Scene>
      {WEEK.map((day, i) => (
        <Scene key={day.photo} from={week + WEEK_INTRO + i * DAY} length={DAY}>
          <Day index={i} />
        </Scene>
      ))}
      <Scene from={week + WEEK_INTRO + WEEK.length * DAY} length={WEEK_END}>
        <WeekEnd />
      </Scene>
      <Scene from={outro} length={OUTRO}>
        <Outro />
      </Scene>
    </AbsoluteFill>
  );
}
