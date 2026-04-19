import { useCallback, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { shouldShowAds, getAdUnitId, canShowInterstitial, recordInterstitialShown, AD_CONFIG, getTrackingConsent, adMobInitialized, markAdMobInitialized } from '../../lib/adConfig';

/**
 * Hook for AdMob Interstitial Ads
 *
 * Returns a `showInterstitial()` function. Call it at natural transition
 * points (after game results, between sessions). Respects cooldown timer.
 *
 * Usage:
 *   const { showInterstitial } = useInterstitialAd();
 *   // After game ends:
 *   showInterstitial();
 */

let InterstitialAd: any = null;
let AdEventType: any = null;

if (Platform.OS !== 'web') {
  try {
    const mobileAds = require('react-native-google-mobile-ads');
    InterstitialAd = mobileAds.InterstitialAd;
    AdEventType = mobileAds.AdEventType;
  } catch {}
}

export function useInterstitialAd() {
  const adRef = useRef<any>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (!shouldShowAds() || !AD_CONFIG.interstitial.enabled || !InterstitialAd) return;

    // Initialize SDK on first ad component mount (native only)
    if (!adMobInitialized) {
      try {
        const mobileAdsModule = require('react-native-google-mobile-ads');
        const mobileAds = mobileAdsModule.default;
        mobileAds().setRequestConfiguration({
          maxAdContentRating: mobileAdsModule.MaxAdContentRating.G,
          tagForChildDirectedTreatment: false,
          tagForUnderAgeOfConsent: false,
        });
        mobileAds().initialize();
        markAdMobInitialized();
      } catch {}
    }

    const unitId = getAdUnitId('interstitial');
    const ad = InterstitialAd.createForAdRequest(unitId, {
      requestNonPersonalizedAdsOnly: !getTrackingConsent(),
    });

    const loadedUnsub = ad.addAdEventListener(AdEventType.LOADED, () => {
      isLoaded.current = true;
    });

    const closedUnsub = ad.addAdEventListener(AdEventType.CLOSED, () => {
      isLoaded.current = false;
      // Preload next ad
      ad.load();
    });

    const errorUnsub = ad.addAdEventListener(AdEventType.ERROR, (error: any) => {
      console.warn('[AdMob] Interstitial error:', error?.message);
      isLoaded.current = false;
    });

    adRef.current = ad;
    ad.load();

    return () => {
      loadedUnsub();
      closedUnsub();
      errorUnsub();
    };
  }, []);

  const showInterstitial = useCallback(() => {
    if (!canShowInterstitial() || !isLoaded.current || !adRef.current) return;
    try {
      adRef.current.show();
      recordInterstitialShown();
    } catch (e) {
      console.warn('[AdMob] Failed to show interstitial:', e);
    }
  }, []);

  return { showInterstitial };
}
