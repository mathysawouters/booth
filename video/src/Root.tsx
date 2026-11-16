import { Composition } from 'remotion';

import { PREMIUM_FULL_FRAMES, PremiumFull } from './full/Premium';
import { FPS, HEIGHT, WIDTH } from './lib/format';
import { CANDY_POP_FRAMES, CandyPop } from './samples/CandyPop';
import { PREMIUM_FRAMES, Premium } from './samples/Premium';
import { SCRAPBOOK_FRAMES, Scrapbook } from './samples/Scrapbook';

export function RemotionRoot() {
  const format = { fps: FPS, width: WIDTH, height: HEIGHT };
  return (
    <>
      <Composition id="Full-Premium" component={PremiumFull} durationInFrames={PREMIUM_FULL_FRAMES} {...format} />
      <Composition id="SampleA-CandyPop" component={CandyPop} durationInFrames={CANDY_POP_FRAMES} {...format} />
      <Composition id="SampleB-Scrapbook" component={Scrapbook} durationInFrames={SCRAPBOOK_FRAMES} {...format} />
      <Composition id="SampleC-Premium" component={Premium} durationInFrames={PREMIUM_FRAMES} {...format} />
    </>
  );
}
