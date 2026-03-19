import React from 'react';
import { Composition } from 'remotion';
import { PowerPlayPreview } from './PowerPlayPreview';

// 1080×1920 portrait (phone), 30fps, 11 seconds
export const RemotionRoot: React.FC = () => (
  <Composition
    id="PowerPlay"
    component={PowerPlayPreview}
    durationInFrames={330}
    fps={30}
    width={1080}
    height={1920}
  />
);
