import { usePostHog } from 'posthog-react-native';

export function useGameAnalytics() {
  const posthog = usePostHog();
  return {
    trackGameStart: (gameId: string, league: string) =>
      posthog?.capture('game_started', { game_id: gameId, league }),
    trackGameComplete: (gameId: string, league: string, score: number, xpEarned: number) =>
      posthog?.capture('game_completed', { game_id: gameId, league, score, xp_earned: xpEarned }),
    trackGameAbandoned: (gameId: string, league: string) =>
      posthog?.capture('game_abandoned', { game_id: gameId, league }),
    trackPowerPlayScore: (league: string, score: number, targetMet: boolean) =>
      posthog?.capture('power_play_score', { league, score, target_met: targetMet }),
    trackCrossoverComplete: (league: string, cellsFilled: number) =>
      posthog?.capture('crossover_completed', { league, cells_filled: cellsFilled }),
  };
}

export function useUserAnalytics() {
  const posthog = usePostHog();
  return {
    trackLogin: (method: 'email' | 'google', userId: string) => {
      posthog?.identify(userId);
      posthog?.capture('user_logged_in', { method });
    },
    trackSignup: (method: 'email' | 'google') =>
      posthog?.capture('user_signed_up', { method }),
    trackLogout: () => {
      posthog?.capture('user_logged_out');
      posthog?.reset();
    },
    trackLevelUp: (newLevel: number, levelName: string) =>
      posthog?.capture('level_up', { new_level: newLevel, level_name: levelName }),
    trackStreakUpdate: (streak: number) =>
      posthog?.capture('streak_updated', { streak_length: streak }),
  };
}

export function useErrorTracking() {
  const posthog = usePostHog();
  return {
    trackError: (errorType: string, errorMessage: string, context?: Record<string, unknown>) =>
      posthog?.capture('error_occurred', { error_type: errorType, error_message: errorMessage, ...context }),
  };
}
