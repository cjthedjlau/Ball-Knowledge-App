import { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Animated, Easing, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenBase from './src/components/ScreenBase';
import ErrorBoundary from './src/components/ErrorBoundary';
import { ThemeProvider, useTheme } from './src/hooks/useTheme';
import { colors } from './src/styles/theme';
import { supabase } from './src/lib/supabase';
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
import GameIntro from './src/app/components/GameIntro';
import { type Tab } from './src/app/components/ui/BottomNav';
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

type Screen = 'splash' | 'onboarding' | 'login' | 'home' | 'games' | 'game' | 'leaderboard' | 'profile' | 'archive' | 'settings' | 'favorite-teams' | 'achievements' | 'my-stats' | 'notifications' | 'game-intro' | 'auth-callback';

type GameScreenComponent = React.ComponentType<{
  onBack: () => void;
  onNavigate: (tab: Tab) => void;
  archiveDate?: string;
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
};

// Daily games return to home after completion; party/unlimited games return to games hub
const DAILY_GAMES = new Set([
  'player-guess', 'blind-rank-5', 'blind-showdown', 'trivia', 'power-play', 'auto-complete',
]);

function AppContent() {
  const { isDark } = useTheme();
  const statusBarStyle = isDark ? 'light' : 'dark';
  const [screen, setScreen] = useState<Screen>('splash');
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [archiveDate, setArchiveDate] = useState<string | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [homeRefreshTrigger, setHomeRefreshTrigger] = useState(0);
  const [pendingInviteCode, setPendingInviteCode] = useState<string | null>(null);
  const [authCallbackError, setAuthCallbackError] = useState<string | null>(null);

  // Splash routing: store destination here; splash navigates when both
  // the animation AND the session check are done (whichever finishes last).
  const pendingDestination = useRef<Screen | null>(null);
  const splashDone = useRef(false);

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslateY = useRef(new Animated.Value(30)).current;

  const [fontsLoaded] = useFonts({
    'Chillax-Bold': require('./assets/fonts/Chillax-Bold.otf'),
  });

  useEffect(() => {
    // Initialize AdSense: first visit = no ads, return visits = ads enabled
    initAdsense();

    Promise.all([
      supabase.auth.getSession(),
      AsyncStorage.getItem('onboarded'),
      AsyncStorage.getItem('bk_intros_seen'),
    ]).then(([{ data: { session } }, onboarded, introSeen]) => {
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
      } else if (onboarded && session) {
        dest = 'home';
        // Ensure profile exists for returning users
        const user = session.user;
        if (user) {
          supabase.from('profiles').select('id').eq('id', user.id).single().then(({ data }) => {
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
              }).then(({ error }) => {
                if (error) console.error('[App] Session restore profile creation failed:', error.message);
                else console.log('[App] Profile created for returning user:', user.id);
              });
            }
          });
        }
        // Register for push notifications on session restore
        registerForPushNotifications().then(token => {
          if (token) {
            void savePushToken(token);
            void scheduleDailyReminder(18);
          }
        });
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      // Ignore INITIAL_SESSION — handled by getSession() above.
      // Only react to actual sign-out events to avoid race conditions
      // where the listener fires before session is restored from storage.
      if (event === 'SIGNED_OUT') setScreen('login');
    });

    return () => subscription.unsubscribe();
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
    // Show a blank dark screen for the brief moment before fonts load (<300ms).
    if (screen === 'splash') {
      if (!fontsLoaded) {
        return <ScreenBase starCount={0} />;
      }
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
            AsyncStorage.setItem('onboarded', 'true').then(() => {
              setScreen('login');
            });
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
              void AsyncStorage.setItem('bk_intros_seen', 'true');
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
          <Login onLogin={() => setScreen('home')} />
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
            <StatusBar style={statusBarStyle} />
            <GameScreen
              onBack={() => {
                setActiveGame(null);
                setArchiveDate(null);
                // After game, check if user has been onboarded
                AsyncStorage.getItem('onboarded').then(val => {
                  if (!val) {
                    setScreen('onboarding');
                  } else {
                    setHomeRefreshTrigger(prev => prev + 1);
                    setScreen(backTarget as Screen);
                  }
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
        <Home onNavigate={handleNavigate} onGoToGame={navigateToGame} onGoToArchive={navigateToArchive} refreshTrigger={homeRefreshTrigger} />
      </ScreenBase>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <Animated.View
          style={{
            flex: 1,
            opacity: screenOpacity,
            transform: [{ translateY: screenTranslateY }],
          }}
        >
          {renderScreen()}
        </Animated.View>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
