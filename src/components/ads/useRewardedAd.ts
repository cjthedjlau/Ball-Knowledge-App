import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { shouldShowAds, getAdUnitId, AD_CONFIG, getTrackingConsent } from '../../lib/adConfig';

/**
 * Hook for AdMob Rewarded Ads
 *
 * Returns `showRewardedAd()` and `isRewardedReady`.
 * The callback receives no args — the caller decides what reward to give.
 *
 * Usage:
 *   const { showRewardedAd, isRewardedReady } = useRewardedAd();
 *   <Button onPress={() => showRewardedAd(() => giveHint())} />
 */

let RewardedAd: any = null;
let RewardedAdEventType: any = null;
let AdEventType: any = null;

if (Platform.OS !== 'web') {
  try {
    const mobileAds = require('react-native-google-mobile-ads');
    RewardedAd = mobileAds.RewardedAd;
    RewardedAdEventType = mobileAds.RewardedAdEventType;
    AdEventType = mobileAds.AdEventType;
  } catch {}
}

export function useRewardedAd() {
  const adRef = useRef<any>(null);
  const [isRewardedReady, setIsRewardedReady] = useState(false);
  const rewardCallbackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!shouldShowAds() || !AD_CONFIG.rewarded.enabled || !RewardedAd) return;

    const unitId = getAdUnitId('rewarded');
    const ad = RewardedAd.createForAdRequest(unitId, {
      requestNonPersonalizedAdsOnly: !getTrackingConsent(),
    });

    const loadedUnsub = ad.addAdEventListener(AdEventType.LOADED, () => {
      setIsRewardedReady(true);
    });

    const earnedUnsub = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      rewardCallbackRef.current?.();
    });

    const closedUnsub = ad.addAdEventListener(AdEventType.CLOSED, () => {
      setIsRewardedReady(false);
      ad.load();
    });

    const errorUnsub = ad.addAdEventListener(AdEventType.ERROR, (error: any) => {
      console.warn('[AdMob] Rewarded ad error:', error?.message);
      setIsRewardedReady(false);
    });

    adRef.current = ad;
    ad.load();

    return () => {
      loadedUnsub();
      earnedUnsub();
      closedUnsub();
      errorUnsub();
    };
  }, []);

  const showRewardedAd = useCallback((onReward: () => void) => {
    if (!isRewardedReady || !adRef.current) return;
    rewardCallbackRef.current = onReward;
    try {
      adRef.current.show();
    } catch (e) {
      console.warn('[AdMob] Failed to show rewarded ad:', e);
    }
  }, [isRewardedReady]);

  return { showRewardedAd, isRewardedReady };
}
