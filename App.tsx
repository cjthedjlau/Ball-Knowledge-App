import { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Animated, Easing, StyleSheet, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenBase from './src/components/ScreenBase';
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
import GameIntro from './src/app/components/GameIntro';
import { type Tab } from './src/app/components/ui/BottomNav';
import Archive from './src/app/components/Archive';
import MyStats from './src/app/components/MyStats';
import FavoriteTeams from './src/app/components/FavoriteTeams';
import Achievements from './src/app/components/Achievements';
import NotificationsScreen from './src/app/components/Notifications';
import SettingsScreen from './src/app/components/Settings';
import {
  registerForPushNotifications,
  savePushToken,
  scheduleDailyReminder,
  cancelAllNotifications,
} from './src/lib/notifications';

type Screen = 'splash' | 'onboarding' | 'login' | 'home' | 'games' | 'game' | 'leaderboard' | 'profile' | 'archive' | 'settings' | 'favorite-teams' | 'achievements' | 'my-stats' | 'notifications' | 'game-intro';

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
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [archiveDate, setArchiveDate] = useState<string | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [homeRefreshTrigger, setHomeRefreshTrigger] = useState(0);

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslateY = useRef(new Animated.Value(30)).current;

  const [fontsLoaded] = useFonts({
    'Chillax-Bold': require('./assets/fonts/Chillax-Bold.otf'),
  });

  useEffect(() => {
    Promise.all([
      supabase.auth.getSession(),
      AsyncStorage.getItem('onboarded'),
      AsyncStorage.getItem('bk_intros_seen'),
    ]).then(([{ data: { session } }, onboarded, introSeen]) => {
      const homeScreen: Screen = introSeen ? 'home' : 'game-intro';

      if (onboarded && session) {
        setScreen(homeScreen);
        // Register for push notifications on session restore
        registerForPushNotifications().then(token => {
          if (token) {
            void savePushToken(token);
            void scheduleDailyReminder(18); // default 6pm
          }
        });
      } else if (onboarded && !session) {
        setScreen('login');
      } else {
        // Not onboarded — go straight to home (or intro) as guest
        setScreen(homeScreen);
      }
      setSessionChecked(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) setScreen('login');
    });

    return () => subscription.unsubscribe();
  }, []);

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
    if (!fontsLoaded || !sessionChecked) {
      return (
        <ScreenBase>
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.brand} />
          </View>
        </ScreenBase>
      );
    }

    if (screen === 'splash') {
      return (
        <ScreenBase starCount={120}>
          <StatusBar style="light" />
          <Splash onFinish={() => setScreen('onboarding')} />
        </ScreenBase>
      );
    }

    if (screen === 'onboarding') {
      return (
        <ScreenBase>
          <StatusBar style="light" />
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
          <StatusBar style="light" />
          <GameIntro
            onFinish={() => {
              void AsyncStorage.setItem('bk_intros_seen', 'true');
              setScreen('home');
            }}
          />
        </ScreenBase>
      );
    }

    if (screen === 'login') {
      return (
        <ScreenBase>
          <StatusBar style="light" />
          <Login onLogin={() => setScreen('home')} />
        </ScreenBase>
      );
    }

    if (screen === 'leaderboard') {
      return (
        <ScreenBase>
          <StatusBar style="light" />
          <Leaderboard onNavigate={handleNavigate} />
        </ScreenBase>
      );
    }

    if (screen === 'profile') {
      return (
        <ScreenBase>
          <StatusBar style="light" />
          <Profile onNavigate={handleNavigate} />
        </ScreenBase>
      );
    }

    if (screen === 'archive') {
      return (
        <ScreenBase>
          <StatusBar style="light" />
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
          <StatusBar style="light" />
          <MyStats onBack={() => setScreen('profile')} />
        </ScreenBase>
      );
    }

    if (screen === 'favorite-teams') {
      return (
        <ScreenBase>
          <StatusBar style="light" />
          <FavoriteTeams onBack={() => setScreen('profile')} />
        </ScreenBase>
      );
    }

    if (screen === 'achievements') {
      return (
        <ScreenBase>
          <StatusBar style="light" />
          <Achievements onBack={() => setScreen('profile')} />
        </ScreenBase>
      );
    }

    if (screen === 'notifications') {
      return (
        <ScreenBase>
          <StatusBar style="light" />
          <NotificationsScreen onBack={() => setScreen('profile')} />
        </ScreenBase>
      );
    }

    if (screen === 'settings') {
      return (
        <ScreenBase>
          <StatusBar style="light" />
          <SettingsScreen onBack={() => setScreen('profile')} onNavigate={handleNavigate} />
        </ScreenBase>
      );
    }

    if (screen === 'games') {
      return (
        <ScreenBase>
          <StatusBar style="light" />
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
        const backTarget = archiveDate ? 'archive' : 'games';
        return (
          <ScreenBase>
            <StatusBar style="light" />
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
        <StatusBar style="light" />
        <Home onNavigate={handleNavigate} onGoToGame={navigateToGame} onGoToArchive={navigateToArchive} refreshTrigger={homeRefreshTrigger} />
      </ScreenBase>
    );
  }

  return (
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
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
