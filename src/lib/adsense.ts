import { Platform } from 'react-native';

const STORAGE_KEY = 'bk_has_visited';
const ADSENSE_SRC =
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1818161492484327';

/** Whether the current user is a returning visitor (eligible for ads). */
let _isReturningVisitor = false;

/**
 * Call once at app startup (web only).
 * - First visit: sets the flag in localStorage, does NOT load AdSense.
 * - Return visit: detects the flag and injects the AdSense script.
 */
export function initAdsense(): void {
  if (Platform.OS !== 'web') return;

  try {
    const visited = localStorage.getItem(STORAGE_KEY);

    if (visited) {
      // Returning visitor — load the AdSense script
      _isReturningVisitor = true;
      injectAdsenseScript();
    } else {
      // First visit — mark for next time, no ads
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
      _isReturningVisitor = false;
    }
  } catch {
    // localStorage unavailable (private browsing, etc.) — no ads
    _isReturningVisitor = false;
  }
}

/** Returns true if ads should be shown to this user. */
export function shouldShowAds(): boolean {
  return _isReturningVisitor;
}

function injectAdsenseScript(): void {
  // Don't inject twice
  if (document.querySelector(`script[src*="adsbygoogle"]`)) return;

  const script = document.createElement('script');
  script.src = ADSENSE_SRC;
  script.async = true;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
}
