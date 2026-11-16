import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { COPY, WEEK } from '../../lib/data';
import { CATEGORY_ART, SCREENS, photo } from '../../lib/assets';
import { Backdrop, FloatingShapes } from './Backdrop';
import { ChunkyText } from './ChunkyText';
import { Confetti, ConfettiRain } from './Confetti';
import { FinePrint } from './FinePrint';
import { Leggy } from './Leggy';
import { SPRINGS, pop, wobble } from './motion';
import { PhotoCard, SpeechBubble } from './PhotoCard';
import { ScreenShot, ToyPhone, phoneMetrics } from './Phone';
import { PopText } from './PopText';
import { BurstSticker, CutoutSticker, EmojiSticker, HeartSticker, StarSticker, Sticker, TagSticker } from './Sticker';
import { C, FONT, H, W } from './theme';

export function HookScene() {
  const frame = useCurrentFrame();
  const beat = frame < 26 ? 0 : frame < 52 ? 1 : 2;
  const colors = [
    { bg: C.lime, accent: C.limeSoft },
    { bg: C.pink, accent: C.pinkSoft },
    { bg: C.lemon, accent: C.lemonSoft },
  ][beat];
  return (
    <AbsoluteFill>
      <Backdrop color={colors.bg} accent={colors.accent} kind="sunburst" cx={W / 2} cy={H * 0.45} />
      <FloatingShapes seed="hook" colors={[C.white, C.mint, C.lemon, C.pink]} count={9} />
      <div style={{ position: 'absolute', left: 64, right: 64, top: 190 }}>
        <PopText lines={[{ text: COPY.hook[0] }]} size={134} seed="h0" align="flex-start" />
        <PopText lines={[{ text: COPY.hook[1], fill: C.lemon }]} size={134} seed="h1" delay={26} align="flex-start" />
        <PopText
          lines={[{ text: 'Your kid', fill: C.mint }, { text: 'wants to', fill: C.mint }, { text: 'play.', fill: C.mint }]}
          size={134}
          seed="h2"
          delay={52}
          stagger={4}
          align="flex-start"
        />
      </div>
      <Sticker x={880} y={170} seed="s7" rotate={12} delay={8}>
        <BurstSticker size={290} lines={['7 PM']} fill={C.pink} />
      </Sticker>
      <Sticker x={930} y={820} seed="zz" rotate={-10} delay={28}>
        <EmojiSticker emoji="😴" size={190} />
      </Sticker>
      <Leggy pose="sleeping" height={520} x={W - 330} bottom={1740} from="right" delay={4} exitAt={78} />
      <Leggy pose="thinking" height={560} x={W - 190} bottom={1760} from="right" delay={54} exitAt={80} seed="think" />
    </AbsoluteFill>
  );
}

function PhoneStage({ src, scroll = 0 }: { src: string; scroll?: number }) {
  return (
    <ScreenShot src={src} scroll={scroll} />
  );
}

export function PhoneScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const width = 600;
  const m = phoneMetrics(width);
  const second = frame >= 44;
  const slam = pop(frame, fps, 6, SPRINGS.slam);
  const kickIn = frame >= 44 ? pop(frame, fps, 44, SPRINGS.pop) : 1;
  const tilt = interpolate(slam, [0, 1], [-18, -5]) + wobble(frame, 'ph', 0.5) * 2;
  const scrollMax = (m.screenWidth * 5200) / 1170 - m.screenHeight;
  const scroll = interpolate(frame, [48, 86], [0, Math.max(0, scrollMax)], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bg = second ? { color: C.pink, accent: C.pinkSoft } : { color: C.lemon, accent: C.lemonSoft };
  return (
    <AbsoluteFill>
      <Backdrop color={bg.color} accent={bg.accent} kind="halftone" cx={W / 2} cy={1050} />
      <FloatingShapes seed="phone" colors={[C.white, C.lime, C.mint, C.pink]} count={8} />
      <div style={{ position: 'absolute', left: 64, right: 64, top: 150, display: 'flex', justifyContent: 'center' }}>
        {second ? (
          <PopText lines={[{ text: 'Every memory' }, { text: 'in the Book', fill: C.lemon }]} size={118} seed="c2" delay={44} stagger={3} />
        ) : (
          <PopText lines={[{ text: "Tonight's" }, { text: 'legend!', fill: C.mint }]} size={140} seed="c1" delay={4} stagger={3} exitAt={38} />
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          left: (W - width) / 2 + 20,
          top: 500 + (1 - slam) * 1400,
          transform: `rotate(${tilt}deg) scale(${kickIn})`,
        }}
      >
        <ToyPhone width={width} body={C.white} sheen={interpolate(frame % 60, [0, 40], [0, 1], { extrapolateRight: 'clamp' })}>
          {second ? <PhoneStage src={SCREENS.bookLong} scroll={scroll} /> : <PhoneStage src={SCREENS.legend} />}
        </ToyPhone>
      </div>
      <Sticker x={160} y={640} seed="a" rotate={-12} delay={14}>
        <BurstSticker size={250} lines={['10', 'min']} fill={C.lime} />
      </Sticker>
      <Sticker x={930} y={720} seed="b" rotate={10} delay={22}>
        <TagSticker text="+40 XP" size={58} fill={C.lemon} />
      </Sticker>
      <Sticker x={900} y={1620} seed="c" rotate={-8} delay={50}>
        <HeartSticker size={170} />
      </Sticker>
      <Sticker x={170} y={1450} seed="d" rotate={14} delay={30} exitAt={64}>
        <CutoutSticker src={CATEGORY_ART.build} size={270} />
      </Sticker>
      <Sticker x={150} y={1360} seed="e" rotate={-9} delay={58}>
        <CutoutSticker src={CATEGORY_ART.story} size={280} />
      </Sticker>
      <Leggy pose="cheering" height={560} x={880} bottom={1800} from="right" delay={30} exitAt={78} seed="lc" />
      <Confetti x={W / 2} y={1000} seed="c1" delay={44} count={34} power={1700} />
    </AbsoluteFill>
  );
}

const CARDS = [
  { x: 285, y: 640, r: -7, from: { x: -900, y: -200, rotate: -50 } },
  { x: 800, y: 630, r: 6, from: { x: 900, y: -300, rotate: 50 } },
  { x: 540, y: 905, r: -3, from: { x: 0, y: -1200, rotate: 30 } },
  { x: 265, y: 1185, r: 5, from: { x: -900, y: 300, rotate: -40 } },
  { x: 815, y: 1175, r: -6, from: { x: 900, y: 300, rotate: 40 } },
  { x: 540, y: 1430, r: 4, from: { x: 0, y: 1200, rotate: -30 } },
];

export function WeekScene() {
  const frame = useCurrentFrame();
  const bubbles = [
    { i: 1, at: 22, out: 50, x: 540, top: 700, tail: 'up' as const, rot: -2 },
    { i: 5, at: 56, out: 98, x: 540, top: 780, tail: 'down' as const, rot: 2 },
  ];
  return (
    <AbsoluteFill>
      <Backdrop color={C.pink} accent={C.pinkSoft} kind="halftone" cx={W / 2} cy={900} />
      <FloatingShapes seed="week" colors={[C.lemon, C.mint, C.white, C.lime]} count={8} top={400} />
      <div style={{ position: 'absolute', left: 64, right: 64, top: 140, display: 'flex', justifyContent: 'center' }}>
        <PopText lines={[{ text: '7 days.' }, { text: '7 legends.', fill: C.lemon }]} size={125} seed="wk" stagger={3} delay={2} />
      </div>
      {CARDS.map((card, n) => (
        <PhotoCard
          key={n}
          src={photo(WEEK[n].photo)}
          size={n === 2 ? 440 : 400}
          x={card.x}
          y={card.y + 110}
          seed={`card${n}`}
          rotate={card.r}
          delay={2 + n * 5}
          from={card.from}
        >
          <div style={{ position: 'absolute', left: -14, bottom: -20, transform: 'rotate(-6deg)' }}>
            <TagSticker text={WEEK[n].weekday} size={40} fill={[C.lime, C.mint, C.lemon][n % 3]} />
          </div>
        </PhotoCard>
      ))}
      <Sticker x={940} y={440} seed="wc" rotate={10} delay={50}>
        <StarSticker size={200} />
      </Sticker>
      <Sticker x={140} y={1640} seed="wd" rotate={-8} delay={60}>
        <HeartSticker size={170} fill={C.pink} />
      </Sticker>
      {bubbles.map((b) => (
        <SpeechBubble
          key={b.i}
          text={WEEK[b.i].quote}
          x={b.x}
          top={b.top + 160}
          width={900}
          seed={`q${b.i}`}
          tail={b.tail}
          size={44}
          delay={b.at}
          exitAt={b.out}
          rotate={b.rot}
        />
      ))}
      <Leggy pose="proud" height={440} x={W - 110} bottom={1760} from="right" delay={70} exitAt={95} seed="wl" />
      <Confetti x={W / 2} y={900} seed="wk" delay={40} count={30} power={1500} />
      <FinePrint text={COPY.disclaimer} delay={4} />
      <span style={{ display: 'none', fontFamily: FONT.brand }} />
    </AbsoluteFill>
  );
}

export function OutroScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tag = pop(frame, fps, 24);
  const built = pop(frame, fps, 38, SPRINGS.snap);
  return (
    <AbsoluteFill>
      <Backdrop color={C.lime} accent={C.limeSoft} kind="sunburst" cx={W / 2} cy={760} />
      <FloatingShapes seed="out" colors={[C.white, C.lemon, C.pink, C.mint]} count={10} />
      <ConfettiRain seed="out" count={22} />
      <div style={{ position: 'absolute', left: 64, right: 64, top: 200, display: 'flex', justifyContent: 'center' }}>
        <PopText lines={[{ text: 'Little' }, { text: 'Legends', fill: C.lemon }]} size={210} seed="lg" stagger={5} delay={3} leading={1.02} />
      </div>
      <Leggy pose="waving" height={760} x={W / 2} bottom={1470} from="right" delay={10} seed="ow" />
      <div
        style={{
          position: 'absolute',
          left: 64,
          right: 64,
          top: 1500,
          display: 'flex',
          justifyContent: 'center',
          transform: `scale(${tag}) rotate(${(1 - tag) * 8 - 2}deg)`,
        }}
      >
        <div
          style={{
            backgroundColor: C.white,
            border: `7px solid ${C.ink}`,
            borderRadius: 48,
            boxShadow: `10px 13px 0 ${C.ink}`,
            padding: '24px 40px 28px',
            textAlign: 'center',
            fontFamily: FONT.brand,
            fontWeight: 700,
            fontSize: 56,
            lineHeight: 1.1,
            color: C.ink,
          }}
        >
          {COPY.tagline}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1716,
          textAlign: 'center',
          fontFamily: FONT.brand,
          fontWeight: 700,
          fontSize: 30,
          color: C.ink,
          opacity: built,
        }}
      >
        {COPY.builtWith}
      </div>
      <Sticker x={130} y={1010} seed="oa" rotate={-12} delay={16}>
        <StarSticker size={190} />
      </Sticker>
      <Sticker x={950} y={1000} seed="ob" rotate={12} delay={20}>
        <HeartSticker size={180} />
      </Sticker>
      <Confetti x={W / 2} y={800} seed="o" delay={6} count={48} power={2200} />
    </AbsoluteFill>
  );
}
