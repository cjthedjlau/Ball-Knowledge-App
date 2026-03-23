import React from 'react';
import { Composition } from 'remotion';
import { PowerPlayPreview } from './PowerPlayPreview';
import { BallKnowledgeSplash } from './BallKnowledgeSplash';

export const RemotionRoot: React.FC = () => (
  <>
    {/* Landing splash — 1080x1920 portrait, 30fps, ~6.3 seconds */}
    <Composition
      id="BallKnowledgeSplash"
      component={BallKnowledgeSplash}
      durationInFrames={190}
      fps={30}
      width={1080}
      height={1920}
    />

    {/* Power Play gameplay preview — 1080×1920 portrait, 30fps, 11 seconds */}
    <Composition
      id="PowerPlay"
      component={PowerPlayPreview}
      durationInFrames={330}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
