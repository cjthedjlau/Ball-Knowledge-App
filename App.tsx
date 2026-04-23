import { useState, useEffect, useRef } from 'react';
let PostHogProvider: any = null;
let usePostHog: any = () => null;
try {
  const ph = require('posthog-react-native');
  PostHogProvider = ph.PostHogProvider;
  usePostHog = ph.usePostHog;
} catch {}

import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

// Keep the native splash screen visible until our animated splash is ready
SplashScreen.preventAutoHideAsync().catch(() => {});

import { View, Animated, Easing, StyleSheet, ActivityIndicator, Platform, AppState, AppStateStatus } from 'react-native';
// Native-only modules — wrapped in try-catch to prevent crash
let StoreReview: any = null;
try {
  if (Platform.OS !== 'web') {
    StoreReview = require('expo-store-review');
  }
} catch {}
import { useFonts } from 'expo-font';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenBase from './src/components/ScreenBase';
import ErrorBoundary from './src/components/ErrorBoundary';
import { ThemeProvider, useTheme } from './src/hooks/useTheme';
import { colors, brand } from './src/styles/theme';
import { supabase } from './src/lib/supabase';
import type { JoinedLobbyInfo } from './src/lib/multiplayer';
import Splash from './src/app/components/Splash';
import Login from './src/app/components/Login';
import Home from './src/screens/components/Home';
import Games from './src/app/components/Games';
import Leaderboard from './src/app/components/Leaderboard';
import Profile from './src/app/components/Profile';
import Onboarding from './src/app/components/Onboarding';
import PlayerGuessScreen from './src/app/game/player-guess';
import BlindRank5Screen from './src/app/game/blind-rank-5';
import BlindShowdownScreen from './src/app/game/blind-showdown';
import TriviaScreen from './src/app/game/trivia';
import WavelengthScreen from './src/app/game/wavelength';
import WhoAmIScreen from './src/app/game/who-am-i';
import DraftWithFriendsScreen from './src/app/game/draft-with-friends';
import ImposterScreen from './src/app/game/imposter';
import ThirteenWordsScreen from './src/app/game/13-words';
import CustomMysteryPlayerScreen from './src/app/game/custom-mystery-player';
import PowerPlayScreen from './src/app/game/power-play';
import AutoCompleteScreen from './src/app/game/auto-complete';
import HotTakeShowdownScreen from './src/app/game/hot-take-showdown';
import GameIntro from './src/app/components/GameIntro';
import BottomNav, { type Tab } from './src/app/components/ui/BottomNav';
import Archive from './src/app/components/Archive';
import MyStats from './src/app/components/MyStats';
import FavoriteTeams from './src/app/components/FavoriteTeams';
import Achievements from './src/app/components/Achievements';
import NotificationsScreen from './src/app/components/Notifications';
import SettingsScreen from './src/app/components/Settings';
import AuthCallback from './src/app/components/AuthCallback';
import {
  registerForPushNotifications,
  savePushToken,
  scheduleDailyReminder,
  cancelAllNotifications,
} from './src/lib/notifications';
import { initAdsense } from './src/lib/adsense';
import { getInviteCodeFromURL } from './src/lib/friends';
import { processQueue } from './src/lib/offlineQueue';
import { cleanStaleCache } from './src/lib/dailyGames';
import useNetworkStatus from './src/hooks/useNetworkStatus';
import OfflineBanner from './src/components/OfflineBanner';

type Screen = 'splash' | 'onboarding' | 'login' | 'home' | 'games' | 'game' | 'leaderboard' | 'profile' | 'archive' | 'settings' | 'favorite-teams' | 'achievements' | 'my-stats' | 'notifications' | 'game-intro' | 'auth-callback';

// Screens where the bottom nav should NOT appear
const NO_NAV_SCREENS = new Set<Screen>([
  'splash', 'onboarding', 'login', 'auth-callback', 'game-intro',
]);

type GameScreenComponent = React.ComponentType<{
  onBack: () => void;
  onNavigate: (tab: Tab) => void;
  archiveDate?: string;
  joinedLobby?: JoinedLobbyInfo;
}>;

const GAME_SCREENS: Record<string, GameScreenComponent> = {
  'player-guess': PlayerGuessScreen,
  'blind-rank-5': BlindRank5Screen,
  'blind-showdown': BlindShowdownScreen,
  'trivia': TriviaScreen,
  'wavelength': WavelengthScreen,
  'who-am-i': WhoAmIScreen,
  'draft-with-friends': DraftWithFriendsScreen,
  'imposter': ImposterScreen,
  '13-words': ThirteenWordsScreen,
  'custom-mystery-player': CustomMysteryPlayerScreen,
  'power-play': PowerPlayScreen,
  'auto-complete': AutoCompleteScreen,
  'hot-take-showdown': HotTakeShowdownScreen,
};

// Daily games return to home after completion; party/unlimited games return to games hub
const DAILY_GAMES = new Set([
  'player-guess', 'blind-rank-5', 'blind-showdown', 'trivia', 'power-play', 'auto-complete',
]);

function AppContent() {
  const { isDark } = useTheme();
  const posthog = usePostHog();
  const statusBarStyle = isDark ? 'light' : 'dark';
  const [screen, setScreen] = useState<Screen>('splash');
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [archiveDate, setArchiveDate] = useState<string | null>(null);
  const [joinedLobby, setJoinedLobby] = useState<JoinedLobbyInfo | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [homeRefreshTrigger, setHomeRefreshTrigger] = useState(0);
  const [pendingInviteCode, setPendingInviteCode] = useState<string | null>(null);
  const [authCallbackError, setAuthCallbackError] = useState<string | null>(null);

  // Network status — tracks connectivity and auto-processes offline queue on reconnect
  const { isConnected, isInternetReachable } = useNetworkStatus();
  const isOffline = !isConnected || !isInternetReachable;

  // Splash routing: store destination here; splash navigates when both
  // the animation AND the session check are done (whichever finishes last).
  const pendingDestination = useRef<Screen | null>(null);
  const splashDone = useRef(false);

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslateY = useRef(new Animated.Value(30)).current;

  const [fontsLoaded, fontError] = useFonts({
    BebasNeue_400Regular,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  useEffect(() => {
    if (fontError) console.error('[App] Font loading error:', fontError);
  }, [fontError]);

  useEffect(() => {
    // Identify user in PostHog once session is known
    try {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          posthog?.identify(session.user.id, { email: session.user.email });
        }
      }).catch(e => console.error('[App] PostHog identify failed:', e));
    } catch (e) {
      console.error('[App] Session check for PostHog failed:', e);
    }
  }, []);

  useEffect(() => {
    console.log('[App] Starting initialization...');

    // Initialize AdSense: first visit = no ads, return visits = ads enabled
    try { initAdsense(); } catch (e) { console.error('[App] AdSense init failed:', e); }


    console.log('[App] Checking session and onboarding state...');

    Promise.all([
      supabase.auth.getSession().catch(e => { console.error('[App] getSession failed:', e); return { data: { session: null } }; }),
      AsyncStorage.getItem('onboarded').catch(() => null),
      AsyncStorage.getItem('bk_intros_seen').catch(() => null),
    ]).then(async ([sessionResult, onboarded, introSeen]) => {
      const session = (sessionResult as any)?.data?.session ?? null;
      console.log('[App] Session:', !!session, 'Onboarded:', !!onboarded, 'IntroSeen:', !!introSeen);
      // Check for invite code in URL (web only)
      const inviteCode = getInviteCodeFromURL();
      if (inviteCode) setPendingInviteCode(inviteCode);

      // Determine post-splash destination
      let dest: Screen;
      if (!introSeen) {
        // First ever open — show gameplay preview after splash
        dest = 'game-intro';
      } else if (inviteCode && onboarded && session) {
        // Deep-linked invite — go straight to leaderboard friends tab
        dest = 'leaderboard';
      } else if (!session && !onboarded) {
        // Play-first: auto-create anonymous session so new users can play immediately
        // They'll be prompted to sign up later from the profile/leaderboard screens
        try {
          const { error: anonError } = await supabase.auth.signInAnonymously();
          if (anonError) throw anonError;
          await AsyncStorage.setItem('onboarded', '1');
          dest = 'home';
        } catch (e) {
          console.warn('[App] Anonymous sign-in failed, falling back to login:', e);
          dest = 'login';
        }
      } else if (onboarded && session) {
        dest = 'home';
        // Ensure profile exists for returning users
        const user = session.user;
        if (user) {
          supabase.from('profiles').select('id').eq('id', user.id).single().then(({ data }: any) => {
            if (!data) {
              const username =
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                user.email?.split('@')[0] ||
                'Player';
              supabase.from('profiles').upsert({
                id: user.id,
                username,
                lifetime_xp: 0,
                weekly_xp: 0,
                level: 1,
                streak: 0,
                streak_at_risk: false,
                favorite_league: 'NBA',
              }).then(({ error }: any) => {
                if (error) console.error('[App] Profile creation failed:', error.message);
              }).catch((e: any) => console.error('[App] Profile upsert error:', e));
            }
          }).catch((e: any) => console.error('[App] Profile lookup error:', e));
        }
        // Clean stale offline cache
        cleanStaleCache().catch(() => {});
        // Register for push notifications on session restore
        try {
          registerForPushNotifications().then(token => {
            if (token) {
              void savePushToken(token);
              void scheduleDailyReminder(18);
            }
          }).catch(e => console.error('[App] Push notification registration failed:', e));
        } catch (e) { console.error('[App] Push notification setup failed:', e); }
      } else if (onboarded && !session) {
        dest = 'login';
      } else {
        dest = 'home';
      }

      pendingDestination.current = dest;
      setSessionChecked(true);

      // If splash already finished before session check completed, navigate now
      if (splashDone.current) {
        setScreen(dest);
      }
    }).catch((err) => {
      console.error('[App] Init failed:', err);
      // Fallback: show login if init fails
      pendingDestination.current = 'login';
      setSessionChecked(true);
      if (splashDone.current) setScreen('login');
    });

    let subscription: any = null;
    try {
      const result = supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_OUT') setScreen('login');
      });
      subscription = result?.data?.subscription;
    } catch (e) {
      console.error('[App] Auth state change listener failed:', e);
    }

    return () => { try { subscription?.unsubscribe(); } catch {} };
  }, []);

  // OAuth redirect detection (web only)
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const hash = window.location.hash;
    if (hash && (hash.includes('access_token') || hash.includes('error'))) {
      setScreen('auth-callback');
      if (hash.includes('error')) {
        const params = new URLSearchParams(hash.substring(1));
        setAuthCallbackError(
          params.get('error_description') || params.get('error') || 'Sign-in failed',
        );
      }
      // On success, supabase detects the hash automatically (detectSessionInUrl: true on web)
      // and fires SIGNED_IN, which the onAuthStateChange listener handles below.
    }
  }, []);

  // When auth state changes to SIGNED_IN while on callback screen, navigate home
  useEffect(() => {
    if (screen !== 'auth-callback') return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        // Clear the hash so a page refresh doesn't re-trigger
        if (Platform.OS === 'web') {
          window.history.replaceState(null, '', window.location.pathname);
        }
        // Ensure profile row exists for OAuth users
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: existing } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', user.id)
              .single();
            if (!existing) {
              const username =
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                user.email?.split('@')[0] ||
                'Player';
              await supabase.from('profiles').upsert({
                id: user.id,
                username,
                lifetime_xp: 0,
                weekly_xp: 0,
                level: 1,
                streak: 0,
                streak_at_risk: false,
                favorite_league: 'NBA',
              });
            }
          }
        } catch (e) {
          console.error('[App] OAuth profile creation failed:', e);
        }
        setScreen('home');
      }
    });
    return () => subscription.unsubscribe();
  }, [screen]);

  // Screen transition animation
  useEffect(() => {
    screenOpacity.setValue(0);
    screenTranslateY.setValue(30);
    Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.bezier(0.0, 0.0, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.timing(screenTranslateY, {
        toValue: 0,
        duration: 500,
        easing: Easing.bezier(0.0, 0.0, 0.2, 1),
        useNativeDriver: true,
      }),
    ]).start();
  }, [screen]);

  // ---------------------------------------------------------------------------
  // AppState lifecycle — handle foreground/background transitions
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        // App came to foreground — refresh auth session if stale
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            // Refreshing the session ensures the access token is current
            supabase.auth.refreshSession().catch((err: unknown) =>
              console.warn('[AppState] Session refresh failed:', err),
            );
          }
        });

        // Process any queued offline game results
        processQueue().catch((err: unknown) =>
          console.warn('[AppState] Queue processing failed:', err),
        );

        // Refresh profile data so XP / streak / level are up to date
        setHomeRefreshTrigger((prev) => prev + 1);
      }
      // Background/inactive: individual game screens handle their own timer cleanup
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  // ── AdMob init (disabled until ads are enabled) ──
  const adInitDone = useRef(false);
  useEffect(() => {
    if (screen !== 'home' || adInitDone.current) return;
    adInitDone.current = true;
    // AdMob SDK init is skipped when ADS_ENABLED=false.
    // When re-enabling ads, uncomment the init block below and
    // add expo-tracking-transparency back to app.json plugins.
  }, [screen]);

  // ── App rating prompt (after 3rd game completion) ──
  const gameCompletionCount = useRef(0);
  const ratingShown = useRef(false);
  useEffect(() => {
    if (screen === 'home' && !ratingShown.current) {
      gameCompletionCount.current += 1;
      // Show rating after 3rd return to home from a game (proxy for 3 games played)
      if (gameCompletionCount.current >= 4) {
        ratingShown.current = true;
        setTimeout(async () => {
          try {
            if (await StoreReview.isAvailableAsync()) {
              await StoreReview.requestReview();
            }
          } catch {}
        }, 1500);
      }
    }
  }, [screen]);

  function handleSplashFinish() {
    splashDone.current = true;
    if (pendingDestination.current) {
      setScreen(pendingDestination.current);
    }
    // else: session check will call setScreen when it completes (handled above)
  }

  function handleNavigate(tab: Tab | 'logout' | string) {
    if (tab === 'logout') {
      void cancelAllNotifications();
      setActiveGame(null);
      setScreen('login');
    } else if (tab === 'home') {
      setActiveGame(null);
      setHomeRefreshTrigger(prev => prev + 1);
      setScreen('home');
    } else if (tab === 'games') {
      setActiveGame(null);
      setScreen('games');
    } else if (tab === 'leaderboard') {
      setActiveGame(null);
      setScreen('leaderboard');
    } else if (tab === 'profile') {
      setActiveGame(null);
      setScreen('profile');
    } else if (tab === 'archive') {
      setActiveGame(null);
      setArchiveDate(null);
      setScreen('archive');
    } else if (tab === 'settings' || tab === 'favorite-teams' || tab === 'achievements' || tab === 'my-stats' || tab === 'notifications') {
      setActiveGame(null);
      setScreen(tab as Screen);
    }
  }


  function navigateToGame(gameId: string) {
    setArchiveDate(null);
    setJoinedLobby(null);
    setActiveGame(gameId);
    setScreen('game');
  }

  function navigateToLobbyGame(gameId: string, lobby: JoinedLobbyInfo) {
    setArchiveDate(null);
    setJoinedLobby(lobby);
    setActiveGame(gameId);
    setScreen('game');
  }

  function navigateToArchiveGame(gameId: string, date: string) {
    setArchiveDate(date);
    setActiveGame(gameId);
    setScreen('game');
  }

  function navigateToArchive() {
    setActiveGame(null);
    setArchiveDate(null);
    setScreen('archive');
  }

  function renderScreen() {
    // Splash always plays first on every launch.
    // Keep native splash visible until fonts load, then show animated splash.
    if (screen === 'splash') {
      if (!fontsLoaded) {
        return <ScreenBase starCount={0} />;
      }
      // Fonts loaded — hide native splash and show our animated one
      SplashScreen.hideAsync().catch(() => {});
      return (
        <ScreenBase starCount={120}>
          <StatusBar style={statusBarStyle} />
          <Splash onFinish={handleSplashFinish} />
        </ScreenBase>
      );
    }

    // All other screens require fonts + session to be ready
    if (!fontsLoaded || !sessionChecked) {
      return (
        <ScreenBase>
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.brand} />
          </View>
        </ScreenBase>
      );
    }

    if (screen === 'onboarding') {
      return (
        <ScreenBase>
          <StatusBar style={statusBarStyle} />
          <Onboarding onFinish={() => {
            AsyncStorage.setItem('onboarded', 'true')
              .then(() => setScreen('login'))
              .catch(() => setScreen('login'));
          }} />
        </ScreenBase>
      );
    }

    if (screen === 'game-intro') {
      return (
        <ScreenBase>
          <StatusBar style={statusBarStyle} />
          <GameIntro
            onFinish={() => {
              AsyncStorage.setItem('bk_intros_seen', 'true').catch(() => {});
              setScreen('home');
            }}
          />
        </ScreenBase>
      );
    }

    if (screen === 'auth-callback') {
      return (
        <ScreenBase>
          <StatusBar style={statusBarStyle} />
          <AuthCallback error={authCallbackError} />
        </ScreenBase>
      );
    }

    if (screen === 'login') {
      return (
        <ScreenBase>
          <StatusBar style={statusBarStyle} />
          <Login onLogin={() => {
            setHomeRefreshTrigger(prev => prev + 1);
            setScreen('home');
          }} />
        </ScreenBase>
      );
    }

    if (screen === 'leaderboard') {
      return (
        <ScreenBase>
          <StatusBar style={statusBarStyle} />
          <Leaderboard
            onNavigate={handleNavigate}
            initialInviteCode={pendingInviteCode}
            onInviteCodeConsumed={() => setPendingInviteCode(null)}
          />
        </ScreenBase>
      );
    }

    if (screen === 'profile') {
      return (
        <ScreenBase>
          <StatusBar style={statusBarStyle} />
          <Profile onNavigate={handleNavigate} />
        </ScreenBase>
      );
    }

    if (screen === 'archive') {
      return (
        <ScreenBase>
          <StatusBar style={statusBarStyle} />
          <Archive
            onBack={() => handleNavigate('home')}
            onNavigate={handleNavigate}
            onPlayArchiveGame={navigateToArchiveGame}
          />
        </ScreenBase>
      );
    }

    if (screen === 'my-stats') {
      return (
        <ScreenBase>
          <StatusBar style={statusBarStyle} />
          <MyStats onBack={() => setScreen('profile')} />
        </ScreenBase>
      );
    }

    if (screen === 'favorite-teams') {
      return (
        <ScreenBase>
          <StatusBar style={statusBarStyle} />
          <FavoriteTeams onBack={() => setScreen('profile')} />
        </ScreenBase>
      );
    }

    if (screen === 'achievements') {
      return (
        <ScreenBase>
          <StatusBar style={statusBarStyle} />
          <Achievements onBack={() => setScreen('profile')} />
        </ScreenBase>
      );
    }

    if (screen === 'notifications') {
      return (
        <ScreenBase>
          <StatusBar style={statusBarStyle} />
          <NotificationsScreen onBack={() => setScreen('profile')} />
        </ScreenBase>
      );
    }

    if (screen === 'settings') {
      return (
        <ScreenBase>
          <StatusBar style={statusBarStyle} />
          <SettingsScreen onBack={() => setScreen('profile')} onNavigate={handleNavigate} />
        </ScreenBase>
      );
    }

    if (screen === 'games') {
      return (
        <ScreenBase>
          <StatusBar style={statusBarStyle} />
          <Games
            onBack={() => handleNavigate('home')}
            onGoToGame={navigateToGame}
            onGoToLobbyGame={navigateToLobbyGame}
            onGoToArchive={navigateToArchive}
            onNavigate={handleNavigate}
          />
        </ScreenBase>
      );
    }


    if (screen === 'game' && activeGame) {
      const GameScreen = GAME_SCREENS[activeGame];
      if (GameScreen) {
        const backTarget = archiveDate ? 'archive' : (DAILY_GAMES.has(activeGame) ? 'home' : 'games');
        return (
          <ScreenBase>
            <StatusBar style="light" />
            <GameScreen
              joinedLobby={joinedLobby ?? undefined}
              onBack={() => {
                setActiveGame(null);
                setArchiveDate(null);
                setJoinedLobby(null);
                AsyncStorage.getItem('onboarded').catch(() => null).then(async (val: any) => {
                  if (!val) {
                    setScreen('onboarding');
                    return;
                  }
                  setHomeRefreshTrigger(prev => prev + 1);
                  setScreen(backTarget as Screen);
                });
              }}
              onNavigate={handleNavigate}
              archiveDate={archiveDate ?? undefined}
            />
          </ScreenBase>
        );
      }
    }

    return (
      <ScreenBase>
        <StatusBar style={statusBarStyle} />
        <Home onNavigate={handleNavigate} onGoToGame={navigateToGame} onGoToArchive={navigateToArchive} onGoToNotifications={() => setScreen('notifications')} refreshTrigger={homeRefreshTrigger} />
      </ScreenBase>
    );
  }

  // Determine active tab for the nav pill based on current screen
  const getActiveTab = (): Tab => {
    if (screen === 'games' || screen === 'game' || screen === 'archive') return 'games';
    if (screen === 'leaderboard') return 'leaderboard';
    if (screen === 'profile' || screen === 'settings' || screen === 'favorite-teams' || screen === 'achievements' || screen === 'my-stats' || screen === 'notifications') return 'profile';
    return 'home';
  };

  const showNav = !NO_NAV_SCREENS.has(screen);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <OfflineBanner visible={isOffline} />
          <Animated.View
            style={{
              flex: 1,
              opacity: screenOpacity,
              transform: [{ translateY: screenTranslateY }],
            }}
          >
            {renderScreen()}
          </Animated.View>
          {showNav && (
            <BottomNav activeTab={getActiveTab()} onNavigate={handleNavigate} />
          )}
        </View>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

function App() {
  const posthogKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;

  const content = (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );

  // Only wrap in PostHog if API key exists AND provider loaded
  if (posthogKey && PostHogProvider) {
    return (
      <PostHogProvider
        apiKey={posthogKey}
        options={{
          host: process.env.EXPO_PUBLIC_POSTHOG_HOST,
          captureScreens: true,
          captureLifecycleEvents: true,
        }}
      >
        {content}
      </PostHogProvider>
    );
  }

  return content;
}

export default App;

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
