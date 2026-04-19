import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_KEY = 'bk_offline_queue';

export interface QueuedGameResult {
  id: string;
  timestamp: number;
  gameType: 'mystery-player' | 'showdown' | 'blind-rank-5' | 'trivia' | 'power-play' | 'auto-complete';
  league: string;
  score: number;
  xpEarned: number;
  userId: string;
}

/**
 * Queue a game result for later submission when the device is offline.
 */
export async function queueGameResult(result: Omit<QueuedGameResult, 'id' | 'timestamp'>): Promise<void> {
  const queue = await getQueue();
  const item: QueuedGameResult = {
    ...result,
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    timestamp: Date.now(),
  };
  queue.push(item);
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  console.log('[OfflineQueue] Queued game result:', item.id);
}

/**
 * Process all queued items — retry submission and remove successful ones.
 */
export async function processQueue(): Promise<void> {
  const queue = await getQueue();
  if (queue.length === 0) return;

  console.log(`[OfflineQueue] Processing ${queue.length} queued item(s)...`);

  const remaining: QueuedGameResult[] = [];

  // Lazy import to break circular dependency with gameResults.ts
  const { saveGameResult } = require('./gameResults');

  for (const item of queue) {
    try {
      const result = await saveGameResult(
        item.league,
        item.gameType,
        item.score,
        item.xpEarned,
      );
      if (result !== null) {
        console.log('[OfflineQueue] Successfully submitted:', item.id);
      } else {
        // saveGameResult returned null — could be auth issue or DB error; keep in queue
        console.warn('[OfflineQueue] Submit returned null, keeping in queue:', item.id);
        remaining.push(item);
      }
    } catch (err) {
      console.warn('[OfflineQueue] Failed to submit, keeping in queue:', item.id, err);
      remaining.push(item);
    }
  }

  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
  console.log(`[OfflineQueue] Done. ${remaining.length} item(s) still queued.`);
}

/**
 * Returns the number of pending items in the queue.
 */
export async function getQueueLength(): Promise<number> {
  const queue = await getQueue();
  return queue.length;
}

// ---------------------------------------------------------------------------
// Internal
// ---------------------------------------------------------------------------

async function getQueue(): Promise<QueuedGameResult[]> {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QueuedGameResult[];
  } catch {
    return [];
  }
}
