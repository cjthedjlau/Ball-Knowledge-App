import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { shouldShowAds, getAdUnitId, AD_CONFIG, getTrackingConsent } from '../../lib/adConfig';

/**
 * AdMob Banner Ad Component
 *
 * Renders a Google AdMob banner ad on native platforms only.
 * Returns null on web (web uses AdSense via AdBanner.tsx).
 * Returns null when ADS_ENABLED is false.
 *
 * Usage: <AdMobBanner />
 */

let BannerAd: any = null;
let BannerAdSize: any = null;

// Only load the ad SDK on native platforms
if (Platform.OS !== 'web') {
  try {
    const mobileAds = require('react-native-google-mobile-ads');
    BannerAd = mobileAds.BannerAd;
    BannerAdSize = mobileAds.BannerAdSize;
  } catch {
    // SDK not available — ads will be disabled
  }
}

interface AdMobBannerProps {
  style?: object;
}

export default function AdMobBanner({ style }: AdMobBannerProps) {
  if (!shouldShowAds() || !AD_CONFIG.banner.enabled || !BannerAd) return null;

  const unitId = getAdUnitId('banner');

  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: !getTrackingConsent() }}
        onAdFailedToLoad={(error: any) => {
          console.warn('[AdMob] Banner failed to load:', error?.message);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
});
