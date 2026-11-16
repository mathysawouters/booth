import { AbsoluteFill, Sequence } from 'remotion';

import { HookScene, OutroScene, PhoneScene, WeekScene } from './candy-pop/scenes';
import { StickerDefs } from './candy-pop/Sticker';
import { StripeWipe } from './candy-pop/Transitions';
import { C } from './candy-pop/theme';

export const CANDY_POP_FRAMES = 300;

export function CandyPop() {
  return (
    <AbsoluteFill style={{ backgroundColor: C.lime }}>
      <StickerDefs />
      <Sequence from={0} durationInFrames={92}>
        <HookScene />
      </Sequence>
      <Sequence from={78} durationInFrames={90}>
        <StripeWipe colors={[C.pink, C.ink, C.lemon]}>
          <PhoneScene />
        </StripeWipe>
      </Sequence>
      <Sequence from={154} durationInFrames={100}>
        <StripeWipe colors={[C.mint, C.ink, C.lime]}>
          <WeekScene />
        </StripeWipe>
      </Sequence>
      <Sequence from={240} durationInFrames={60}>
        <StripeWipe colors={[C.lemon, C.ink, C.pink]}>
          <OutroScene />
        </StripeWipe>
      </Sequence>
    </AbsoluteFill>
  );
}
