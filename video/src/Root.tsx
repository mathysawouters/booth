import { Composition } from 'remotion';

import { CANDY_POP_FULL_FRAMES, CandyPopFull } from './full/CandyPop';
import { PREMIUM_FULL_FRAMES, PremiumFull } from './full/Premium';
import { SCRAPBOOK_FULL_FRAMES, ScrapbookFull } from './full/Scrapbook';
import { FPS, HEIGHT, WIDTH } from './lib/format';
import { CANDY_POP_FRAMES, CandyPop } from './samples/CandyPop';
import { PREMIUM_FRAMES, Premium } from './samples/Premium';
import { SCRAPBOOK_FRAMES, Scrapbook } from './samples/Scrapbook';

export function RemotionRoot() {
  const format = { fps: FPS, width: WIDTH, height: HEIGHT };
  return (
    <>
      <Composition id="SampleA-CandyPop" component={CandyPop} durationInFrames={CANDY_POP_FRAMES} {...format} />
      <Composition id="SampleB-Scrapbook" component={Scrapbook} durationInFrames={SCRAPBOOK_FRAMES} {...format} />
      <Composition id="SampleC-Premium" component={Premium} durationInFrames={PREMIUM_FRAMES} {...format} />
      <Composition id="Full-CandyPop" component={CandyPopFull} durationInFrames={CANDY_POP_FULL_FRAMES} {...format} />
      <Composition id="Full-Scrapbook" component={ScrapbookFull} durationInFrames={SCRAPBOOK_FULL_FRAMES} {...format} />
      <Composition id="Full-Premium" component={PremiumFull} durationInFrames={PREMIUM_FULL_FRAMES} {...format} />
    </>
  );
}
