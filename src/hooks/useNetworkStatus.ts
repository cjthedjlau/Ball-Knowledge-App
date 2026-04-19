import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
let NetInfo: any = null;
try { NetInfo = require('@react-native-community/netinfo').default; } catch {}
import { processQueue } from '../lib/offlineQueue';

interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean;
}

/**
 * Tracks network connectivity and automatically processes the offline queue
 * when the device reconnects.
 *
 * On web, NetInfo may not work reliably so we always report connected.
 */
export default function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
  });

  // Track previous state so we can detect reconnection
  const wasOffline = useRef(false);

  useEffect(() => {
    // On web or if NetInfo not available, always report connected
    if (Platform.OS === 'web' || !NetInfo) return;

    const unsubscribe = NetInfo.addEventListener((state: any) => {
      const connected = state.isConnected ?? true;
      const reachable = state.isInternetReachable ?? connected;

      setStatus({ isConnected: connected, isInternetReachable: reachable });

      // If we were offline and are now back online, process the queue
      if (wasOffline.current && connected && reachable) {
        console.log('[useNetworkStatus] Back online — processing offline queue');
        processQueue().catch((err) =>
          console.warn('[useNetworkStatus] Queue processing failed:', err),
        );
      }

      wasOffline.current = !connected || !reachable;
    });

    return () => unsubscribe();
  }, []);

  return status;
}
