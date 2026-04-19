import { Platform } from 'react-native';

/**
 * AdMob Configuration for Ball Knowledge
 *
 * AdMob is for the MOBILE APP only. AdSense is for the WEBSITE only.
 * They share the same Google publisher account but are separate products.
 *
 * To activate ads:
 * 1. Set ADS_ENABLED to true
 * 2. Ensure real ad unit IDs are in .env
 * 3. Push an OTA update
 */

// ── Master Kill Switch ──
export const ADS_ENABLED = true;

// ── Initialize the Google Mobile Ads SDK ──
// Called from native ad components only. Not imported on web.
export let adMobInitialized = false;
export function markAdMobInitialized(): void {
  adMobInitialized = true;
}

// ── Track ATT consent for personalized vs non-personalized ads ──
let userConsentedToTracking = false;
export function setTrackingConsent(consented: boolean): void {
  userConsentedToTracking = consented;
}
export function getTrackingConsent(): boolean {
  return userConsentedToTracking;
}

// ── Per-Format Toggles ──
export const AD_CONFIG = {
  banner: {
    enabled: false,
    maxPerScreen: 0,
  },
  interstitial: {
    enabled: true,
    // Minimum seconds between interstitials (Google policy: no more than 1 per natural break)
    cooldownSeconds: 180, // 3 minutes
  },
  rewarded: {
    enabled: true,
    // XP bonus for watching a rewarded ad
    xpBonus: 25,
  },
};

// ── Ad Unit IDs ──
// Use Google's test IDs during development. Replace with real IDs for production.
const TEST_IDS = {
  banner: {
    ios: 'ca-app-pub-3940256099942544/2934735716',
    android: 'ca-app-pub-3940256099942544/6300978111',
  },
  interstitial: {
    ios: 'ca-app-pub-3940256099942544/4411468910',
    android: 'ca-app-pub-3940256099942544/1033173712',
  },
  rewarded: {
    ios: 'ca-app-pub-3940256099942544/1712485313',
    android: 'ca-app-pub-3940256099942544/5224354917',
  },
};

// Production IDs — replace these with your actual AdMob unit IDs
const PROD_IDS = {
  banner: {
    ios: process.env.EXPO_PUBLIC_ADMOB_BANNER_IOS || TEST_IDS.banner.ios,
    android: process.env.EXPO_PUBLIC_ADMOB_BANNER_ANDROID || TEST_IDS.banner.android,
  },
  interstitial: {
    ios: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_IOS || TEST_IDS.interstitial.ios,
    android: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ANDROID || TEST_IDS.interstitial.android,
  },
  rewarded: {
    ios: process.env.EXPO_PUBLIC_ADMOB_REWARDED_IOS || TEST_IDS.rewarded.ios,
    android: process.env.EXPO_PUBLIC_ADMOB_REWARDED_ANDROID || TEST_IDS.rewarded.android,
  },
};

// Real production ad unit IDs (activate when App Store listing is approved by AdMob):
// Rewarded iOS:     ca-app-pub-1818161492484327/1436665354
// Interstitial iOS: ca-app-pub-1818161492484327/5402516470
// App ID iOS:       ca-app-pub-1818161492484327~4897353088

// Force test ads until AdMob approves the app. Flip to false when ready for real ads.
const USE_TEST_ADS = true;

export function getAdUnitId(format: 'banner' | 'interstitial' | 'rewarded'): string {
  const ids = USE_TEST_ADS ? TEST_IDS[format] : PROD_IDS[format];
  return Platform.OS === 'ios' ? ids.ios : ids.android;
}

// ── Helpers ──

export function shouldShowAds(): boolean {
  // Never show ads on web (web uses AdSense, not AdMob)
  if (Platform.OS === 'web') return false;
  return ADS_ENABLED;
}

// Track last interstitial time to enforce cooldown
let lastInterstitialTime = 0;

export function canShowInterstitial(): boolean {
  if (!shouldShowAds() || !AD_CONFIG.interstitial.enabled) return false;
  const now = Date.now();
  if (now - lastInterstitialTime < AD_CONFIG.interstitial.cooldownSeconds * 1000) return false;
  return true;
}

export function recordInterstitialShown(): void {
  lastInterstitialTime = Date.now();
}
