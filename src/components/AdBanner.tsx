import React, { useEffect, useRef } from 'react';
import { Platform, View } from 'react-native';
import { shouldShowAds } from '../lib/adsense';

interface Props {
  /** AdSense slot ID (from your AdSense dashboard). Leave empty for auto ads. */
  slot?: string;
  /** Ad format — defaults to 'auto'. */
  format?: string;
  /** Whether to use full-width responsive. Defaults to true. */
  fullWidthResponsive?: boolean;
  style?: object;
}

/**
 * Web-only AdSense banner. Renders nothing on native or for first-time visitors.
 */
export default function AdBanner({
  slot,
  format = 'auto',
  fullWidthResponsive = true,
  style,
}: Props) {
  const adRef = useRef<HTMLDivElement | null>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (Platform.OS !== 'web' || !shouldShowAds() || pushed.current) return;

    try {
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet or blocked
    }
  }, []);

  if (Platform.OS !== 'web' || !shouldShowAds()) return null;

  return (
    <View style={[{ width: '100%' as any, alignItems: 'center' }, style]}>
      <div ref={adRef}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-1818161492484327"
          {...(slot ? { 'data-ad-slot': slot } : {})}
          data-ad-format={format}
          data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
        />
      </div>
    </View>
  );
}
