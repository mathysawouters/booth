import type { ReactNode } from 'react';
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import type { LeggyPose } from '../../lib/assets';

import { photo } from '../../lib/assets';
import { COPY, WEEK, type WeekDay } from '../../lib/data';
import { ArtSticker, DayTab, Disclaimer, EmojiBurst, Leggy, RoundSticker, TAB_COLORS } from './Bits';
import { ARROW, BATTERY, CLOCK, Confetti, Doodle, Footprints, HEART, MOON, SPIRAL, STAR, ZIGZAG, burst, loop, underline } from './Doodles';
import { PaperPage, Scrap, Tape } from './Paper';
import { Phone, PhoneSlides, phoneSize, type Slide } from './Phone';
import { Polaroid } from './Polaroid';
import { C, CLAMP, FONT, INK, jitter, pop, ramp, wobble, wrap } from './theme';
import { Cutout, Handwriting, Headline, RubberStamp } from './Text';

const flow = { position: 'relative' } as const;

function Show({ from, to, children }: { from: number; to?: number; children: ReactNode }) {
  return (
    <Sequence from={from} durationInFrames={to === undefined ? undefined : to - from} layout="none">
      {children}
    </Sequence>
  );
}

export function HookPage({ step = 16 }: { step?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = pop(frame, fps, step + 4, 'soft');
  const bob = wobble(frame, 'leggy-hook', 14);
  return (
    <PaperPage color={C.cream} pattern="dots">
      <Scrap w={560} h={400} color={C.pink} seed="hp1" pattern="confetti" rotate={9} style={{ left: 640, top: -90 }} from={[120, -100]} />
      <Scrap w={600} h={430} color={C.mint} seed="hp2" pattern="stripes" rotate={-7} style={{ left: -120, top: 1560 }} from={[-120, 100]} at={4} />
      <Scrap w={340} h={260} color={C.yellow} seed="hp3" rotate={6} style={{ left: 760, top: 1420 }} from={[100, 100]} at={8} />
      <Tape w={190} color={C.pink} rotate={-14} style={{ left: 120, top: 150 }} seed="t1" at={6} />
      <div style={{ position: 'absolute', left: 120, top: 330, width: 860, display: 'flex', flexDirection: 'column', rowGap: 110 }}>
        <Headline text={COPY.hook[0]} size={160} at={0} style={flow} />
        <Headline text={COPY.hook[1]} size={128} at={step} style={flow} />
        <Headline text={COPY.hook[2]} size={132} at={step * 2} style={flow} color={C.green} />
      </div>
      <Doodle {...CLOCK} width={170} progress={ramp(frame, 6, 18)} color={C.coral} rotate={12} style={{ left: 790, top: 120 }} />
      <Doodle {...underline(520)} width={520} progress={ramp(frame, step - 2, 14)} color={C.coral} weight={9} style={{ left: 330, top: 500 }} />
      <Doodle {...BATTERY} width={170} progress={ramp(frame, step + 10, 16)} color={INK} fill={C.yellow} rotate={-8} style={{ left: 800, top: 790 }} />
      <Doodle {...MOON} width={110} progress={ramp(frame, step + 16, 14)} color={INK} fill={C.yellow} style={{ left: 900, top: 960 }} />
      <Doodle {...SPIRAL} width={130} progress={ramp(frame, step * 2 + 6, 20)} color={C.pink} weight={8} style={{ left: 120, top: 1130 }} />
      <Doodle {...STAR} width={110} progress={ramp(frame, step * 2 + 14, 14)} color={INK} fill={C.yellow} rotate={14} style={{ left: 880, top: 1150 }} />
      <Doodle {...HEART} width={90} progress={ramp(frame, step * 2 + 20, 14)} color={INK} fill={C.pink} rotate={-12} style={{ left: 120, top: 1180 }} />
      <Footprints from={[140, 1490]} to={[620, 1380]} count={7} at={step * 2 + 6} every={3} />
      <Leggy pose="thinking" height={620} sticker style={{ left: 640, top: 1240 + (1 - rise) * 700 + bob, transform: `rotate(${-4 + wobble(frame, 'lh', 4)}deg)` }} />
    </PaperPage>
  );
}

type Caption = { text: string; from: number; to?: number };

type AppPageProps = {
  slides: Slide[];
  captions: Caption[];
  length: number;
  color?: string;
  pattern?: 'grid' | 'dots' | 'ruled' | 'stripes' | 'confetti';
  accent?: string;
  pose?: LeggyPose;
  confettiAt?: number;
  extra?: ReactNode;
};

export function AppPage({ slides, captions, length, color = C.mint, pattern = 'grid', accent = C.pink, pose = 'reading', confettiAt, extra }: AppPageProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const screenWidth = 570;
  const size = phoneSize(screenWidth);
  const left = 290;
  const top = 400;
  const phoneIn = pop(frame, fps, 4, 'soft');
  const leggyIn = pop(frame, fps, 14, 'soft');
  return (
    <PaperPage color={color} pattern={pattern}>
      <Scrap w={900} h={1440} color={C.paper} seed="ap1" pattern="dots" rotate={-1.5} style={{ left: 100, top: 330 }} from={[0, 160]} />
      <Scrap w={420} h={300} color={C.yellow} seed="ap2" pattern="stripes" rotate={-9} style={{ left: 640, top: -60 }} from={[100, -100]} at={2} />
      <Scrap w={360} h={300} color={accent} seed="ap3" pattern="confetti" rotate={8} style={{ left: -90, top: 1620 }} from={[-100, 100]} at={6} />
      <Leggy
        pose={pose}
        height={560}
        sticker
        style={{ left: 640 + (1 - leggyIn) * 400, top: 1180 + wobble(frame, 'lr', 8), transform: `rotate(${6 + wobble(frame, 'lrr', 4)}deg)` }}
      />
      <div
        style={{
          position: 'absolute',
          left,
          top: top + (1 - phoneIn) * 800,
          transform: `rotate(${-3 + (1 - phoneIn) * 10 + wobble(frame, 'phone', 0.8)}deg)`,
        }}
      >
        <Phone screenWidth={screenWidth} style={{ position: 'relative' }}>
          <PhoneSlides slides={slides} screenWidth={screenWidth} />
        </Phone>
        <Tape w={230} color={C.pink} rotate={-24} style={{ left: -60, top: 40 }} at={16} seed="pt1" />
        <Tape w={230} color={C.yellow} rotate={-24} style={{ left: size.width - 190, top: size.height - 20 }} at={20} seed="pt2" />
      </div>
      {captions.map((caption) => (
        <Show key={caption.text} from={caption.from} to={caption.to}>
          <div style={{ position: 'absolute', left: 120, top: 120, width: 860 }}>
            <Headline text={caption.text} size={caption.text.length > 24 ? 88 : 104} at={0} stagger={3} style={flow} />
          </div>
        </Show>
      ))}
      <Doodle {...ARROW} width={190} progress={ramp(frame, 24, 16)} color={C.coral} rotate={-30} style={{ left: 90, top: 760 }} />
      <Doodle {...STAR} width={100} progress={ramp(frame, 30, 14)} color={INK} fill={C.yellow} rotate={-10} style={{ left: 880, top: 1000 }} />
      <Doodle {...HEART} width={80} progress={ramp(frame, 40, 14)} color={INK} fill={C.pink} rotate={14} style={{ left: 130, top: 1500 }} />
      <Doodle {...ZIGZAG} width={220} progress={ramp(frame, 36, 14)} color={C.green} style={{ left: 760, top: 1780 - 60 }} />
      <ArtSticker art="surprise" size={230} at={26} rotate={-10} style={{ left: 20, top: 1250 }} />
      {confettiAt === undefined ? null : <Confetti at={confettiAt} origin={[590, 1000]} count={50} power={1.1} seed={'app' + confettiAt} />}
      {extra}
    </PaperPage>
  );
}

const QUOTE_COLORS = [C.pink, C.yellow, C.mint, C.lime];

export function DayPage({ day, index, length, tilt = -3 }: { day: WeekDay; index: number; length: number; tilt?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flip = index % 2 ? 1 : -1;
  const peek = pop(frame, fps, 10, 'soft');
  const size = 700;
  const color = QUOTE_COLORS[index % QUOTE_COLORS.length];
  const quote = wrap('\u201C' + day.quote + '\u201D', 28);
  return (
    <PaperPage color={C.cream} pattern={index % 2 ? 'grid' : 'ruled'}>
      <Scrap w={760} h={520} color={color} seed={'dp' + index} pattern="stripes" rotate={flip * 5} style={{ left: 200, top: 300 }} from={[0, -140]} />
      <div style={{ position: 'absolute', left: 130, top: 130, display: 'flex', columnGap: 10 }}>
        {WEEK.map((entry, i) => (
          <DayTab key={i} label={entry.weekday} color={TAB_COLORS[i]} at={i * 2} active={i === index} style={{ width: 118 }} />
        ))}
      </div>
      <Leggy
        pose={index % 2 ? 'proud' : 'waving'}
        height={560}
        sticker
        style={{ left: 760 + (1 - peek) * 280, top: 330 + wobble(frame, 'dl' + index, 6), transform: `rotate(${flip * -8}deg)` }}
      />
      <Polaroid
        src={photo(day.photo)}
        size={size}
        at={4}
        rotate={flip * 3 + tilt * 0}
        seed={day.photo}
        captionHeight={120}
        style={{ left: 150, top: 330 }}
        caption={<span style={{ fontFamily: FONT.hand, fontWeight: 700, fontSize: 68, color: INK, lineHeight: 1 }}>{day.title}</span>}
      >
        <Tape w={210} color={C.yellow} rotate={-8} style={{ left: 250, top: -26 }} at={10} seed={'dt' + index} />
      </Polaroid>
      <Handwriting lines={quote} size={70} at={14} speed={2.6} rotate={flip * -1.5} style={{ left: 140, top: 1280 }} />
      <Doodle {...loop(340, 120)} width={340} progress={ramp(frame, 22, 16)} color={C.coral} weight={7} style={{ left: 160 + 380, top: 1240 + 380 > 0 ? 1250 : 0, opacity: 0 }} />
      <RoundSticker size={190} color={C.yellow} at={18} rotate={-10} style={{ left: 60, top: 280 }}>
        <span style={{ fontSize: 80 }}>{day.cheer ?? '\u2B50'}</span>
      </RoundSticker>
      <RubberStamp text={`${day.skill}${day.level ? ' level ' + day.level + '!' : '!'}`} at={24} size={46} rotate={flip * 7} style={{ left: 500, top: 1560 }} />
      <Doodle {...STAR} width={90} progress={ramp(frame, 28, 12)} color={INK} fill={C.pink} rotate={12} style={{ left: 880, top: 1210 }} />
      <Doodle {...SPIRAL} width={110} progress={ramp(frame, 20, 16)} color={C.green} style={{ left: 880, top: 1600 }} />
      <Footprints from={[150, 1660]} to={[640, 1700]} count={6} at={20} every={3} size={54} />
      <Disclaimer />
    </PaperPage>
  );
}

const SLOTS: [number, number, number][] = [
  [100, 500, -4],
  [400, 480, 3],
  [700, 510, -3],
  [100, 880, 3],
  [400, 890, -5],
  [700, 870, 4],
  [100, 1250, -3],
];

export function WeekCollage({ step = 6 }: { step?: number }) {
  const frame = useCurrentFrame();
  return (
    <PaperPage color={C.yellow} pattern="confetti">
      <Scrap w={940} h={1300} color={C.paper} seed="wc1" pattern="grid" rotate={-1} style={{ left: 70, top: 400 }} from={[0, 160]} />
      <div style={{ position: 'absolute', left: 120, top: 120, width: 860 }}>
        <Headline text="7 days." size={150} at={0} style={flow} />
        <Headline text="7 little legends." size={94} at={8} style={flow} color={C.green} />
      </div>
      <Doodle {...underline(700)} width={700} progress={ramp(frame, 16, 18)} color={C.coral} weight={9} style={{ left: 200, top: 400 }} />
      {WEEK.map((day, i) => {
        const [x, y, r] = SLOTS[i];
        return (
          <Polaroid key={day.photo} src={photo(day.photo)} size={262} at={10 + i * step} rotate={r} seed={day.photo} captionHeight={64} style={{ left: x, top: y }}
            caption={<span style={{ fontFamily: FONT.hand, fontWeight: 700, fontSize: 42, color: INK }}>{day.weekday}</span>}
          >
            <Tape w={110} h={38} color={[C.pink, C.mint, C.lime][i % 3]} rotate={-6} style={{ left: 70, top: -18 }} at={12 + i * step} seed={'ct' + i} />
          </Polaroid>
        );
      })}
      <Leggy pose="cheering" height={520} sticker style={{ left: 500, top: 1180 + (1 - pop(frame, 30, 20, 'soft')) * 600 + wobble(frame, 'cl', 8) }} />
      <RubberStamp text="Brave level 2!" at={30} size={46} rotate={-8} style={{ left: 120, top: 1580 }} />
      <Doodle {...HEART} width={90} progress={ramp(frame, 36, 14)} color={INK} fill={C.pink} rotate={-12} style={{ left: 900, top: 380 }} />
      <Doodle {...STAR} width={100} progress={ramp(frame, 44, 14)} color={INK} fill={C.mint} rotate={10} style={{ left: 60, top: 380 }} />
      <Confetti at={12} origin={[540, 300]} count={26} power={0.7} seed="wk" />
      <Disclaimer />
    </PaperPage>
  );
}

export function OutroPage() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = pop(frame, fps, 6, 'soft');
  return (
    <PaperPage color={C.lime} pattern="confetti">
      <Scrap w={940} h={1180} color={C.paper} seed="op1" pattern="dots" rotate={-2} style={{ left: 70, top: 170 }} from={[0, 200]} />
      <Scrap w={420} h={280} color={C.pink} seed="op2" pattern="stripes" rotate={8} style={{ left: 660, top: -60 }} from={[100, -100]} at={3} />
      <Tape w={230} color={C.yellow} rotate={-10} style={{ left: 150, top: 150 }} at={8} seed="ot1" />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 290, display: 'flex', flexDirection: 'column', alignItems: 'center', rowGap: 10 }}>
        <Cutout text="Little" size={170} at={4} stagger={3} />
        <Cutout text="Legends" size={150} at={14} stagger={3} />
      </div>
      <Doodle {...underline(760)} width={760} progress={ramp(frame, 34, 18)} color={C.coral} weight={10} style={{ left: 160, top: 760 }} />
      <Handwriting lines={wrap(COPY.tagline, 24)} size={96} at={26} speed={2.4} align="center" style={{ left: 130, top: 840, width: 820 }} />
      <Leggy pose="waving" height={760} sticker style={{ left: 330, top: 1160 + (1 - rise) * 800 + wobble(frame, 'ow', 8), transform: `rotate(${wobble(frame, 'owr', 4)}deg)` }} />
      <Doodle {...STAR} width={120} progress={ramp(frame, 30, 14)} color={INK} fill={C.yellow} rotate={-12} style={{ left: 120, top: 1200 }} />
      <Doodle {...HEART} width={100} progress={ramp(frame, 38, 14)} color={INK} fill={C.pink} rotate={12} style={{ left: 850, top: 1250 }} />
      <Doodle {...burst()} width={170} progress={ramp(frame, 24, 16)} color={C.coral} weight={8} style={{ left: 820, top: 200 }} />
      <Footprints from={[130, 1620]} to={[420, 1680]} count={4} at={36} every={4} size={54} />
      <ArtSticker art="surprise" size={200} at={40} rotate={10} style={{ left: 800, top: 1500 }} />
      <Confetti at={22} origin={[540, 700]} count={40} power={1} seed="out" />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 150, textAlign: 'center', fontFamily: FONT.chunky, fontWeight: 500, fontSize: 32, color: INK, opacity: ramp(frame, 44, 10) }}>
        <span style={{ backgroundColor: 'rgba(255,253,246,0.9)', padding: '8px 24px', borderRadius: 24 }}>{COPY.builtWith}</span>
      </div>
    </PaperPage>
  );
}

export { jitter, interpolate, Easing, CLAMP, AbsoluteFill };
