import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  ListOrdered,
  Swords,
  Brain,
  Radio,
  HelpCircle,
  Users,
  EyeOff,
  MessageSquare,
  Archive,
  UserSearch,
  Zap,
  TextSearch,
  LogIn,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { brand, dark, light, colors, fontFamily, spacing } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import GameCard from '../../screens/components/ui/GameCard';
import GameCardWithPreview from '../../screens/components/ui/GameCardWithPreview';
import MysteryPlayerPreview from '../../screens/components/ui/previews/MysteryPlayerPreview';
import BlindRank5Preview from '../../screens/components/ui/previews/BlindRank5Preview';
import ShowdownPreview from '../../screens/components/ui/previews/ShowdownPreview';
import TriviaPreview from '../../screens/components/ui/previews/TriviaPreview';
import PowerPlayPreview from '../../screens/components/ui/previews/PowerPlayPreview';
import AutoCompletePreview from '../../screens/components/ui/previews/AutoCompletePreview';
import WavelengthPreview from '../../screens/components/ui/previews/WavelengthPreview';
import ImposterPreview from '../../screens/components/ui/previews/ImposterPreview';
import DraftPreview from '../../screens/components/ui/previews/DraftPreview';
import WhoAmIPreview from '../../screens/components/ui/previews/WhoAmIPreview';
import ThirteenWordsPreview from '../../screens/components/ui/previews/ThirteenWordsPreview';
import CustomMysteryPreview from '../../screens/components/ui/previews/CustomMysteryPreview';
import HotTakeShowdownPreview from '../../screens/components/ui/previews/HotTakeShowdownPreview';
import AnimatedCard from '../../components/AnimatedCard';
import { type Tab } from './ui/BottomNav';
import useZoneEntrance from '../../hooks/useZoneEntrance';
import { JoinLobby } from '../../components/multiplayer/JoinLobby';
import type { JoinedLobbyInfo } from '../../lib/multiplayer';

interface GamesProps {
  onBack: () => void;
  onGoToGame: (gameId: string) => void;
  onGoToLobbyGame: (gameId: string, lobby: JoinedLobbyInfo) => void;
  onGoToArchive: () => void;
  onNavigate: (tab: Tab) => void;
}

export default function Games({ onBack: _onBack, onGoToGame, onGoToLobbyGame, onGoToArchive, onNavigate }: GamesProps) {
  const insets = useSafeAreaInsets();
  const { zone1Style, zone2Style } = useZoneEntrance();
  const { isDark } = useTheme();
  const [showJoinLobby, setShowJoinLobby] = useState(false);

  if (showJoinLobby) {
    return (
      <SafeAreaView style={styles.root}>
        <JoinLobby
          onJoin={(lobbyId, playerIndex, lobbyCode, gameType) => {
            setShowJoinLobby(false);
            // Navigate to the correct game screen with lobby context
            const gameTypeToScreen: Record<string, string> = {
              imposter: 'imposter',
              wavelength: 'wavelength',
              draft: 'draft-with-friends',
              'hot-take-showdown': 'hot-take-showdown',
            };
            const screen = gameTypeToScreen[gameType ?? ''];
            if (screen) {
              onGoToLobbyGame(screen, {
                lobbyId,
                playerIndex,
                code: lobbyCode,
                gameType: gameType ?? '',
              });
            }
          }}
          onBack={() => setShowJoinLobby(false)}
        />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      {/* ── Zone 1: Header ── */}
      <Animated.View style={[styles.zone1, zone1Style, { backgroundColor: brand.primary, paddingTop: insets.top + spacing['2xl'] }]}>
        <Text style={styles.title}>All Games</Text>
        <Text style={styles.subtitle}>Choose Your Challenge</Text>

        <View style={styles.statStrip}>
          <View style={[styles.statItem, styles.statItemLeft]}>
            <Text style={styles.statLabel}>DAILY GAMES</Text>
            <Text style={styles.statValue}>6 Available</Text>
          </View>
          <View style={[styles.statItem, styles.statItemLeft]}>
            <Text style={styles.statLabel}>MULTIPLAYER</Text>
            <Text style={styles.statValue}>8 Available</Text>
          </View>
          <Pressable style={styles.archiveButton} onPress={onGoToArchive}>
            <Archive size={18} color={dark.textPrimary} strokeWidth={2} />
            <Text style={styles.archiveButtonText}>Archive</Text>
          </Pressable>
        </View>
      </Animated.View>

      {/* ── Zone 2: Content Sheet ── */}
      <Animated.View style={[{ flex: 1 }, zone2Style]}>
      <ScrollView
        style={styles.zone2}
        contentContainerStyle={[styles.zone2Content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Multiplayer — 3x2 grid */}
        <Text style={[styles.sectionLabel, { color: brand.primary }]}>── MULTIPLAYER ──</Text>
        <View style={styles.cardGrid}>
          <AnimatedCard delay={0} style={styles.cardGridItem}>
            <GameCardWithPreview
              title="Hot Take Showdown"
              subtitle="Party Game"
              icon={<Zap size={24} color={colors.brand} strokeWidth={2} />}
              onPress={() => onGoToGame('hot-take-showdown')}
              status="multiplayer"
              isNew
              PreviewComponent={HotTakeShowdownPreview}
            />
          </AnimatedCard>
          <AnimatedCard delay={80} style={styles.cardGridItem}>
            <GameCardWithPreview
              title="Wavelength"
              subtitle="Party Mode"
              icon={<Radio size={24} color={colors.brand} strokeWidth={2} />}
              onPress={() => onGoToGame('wavelength')}
              status="multiplayer"
              PreviewComponent={WavelengthPreview}
            />
          </AnimatedCard>
          <AnimatedCard delay={80} style={styles.cardGridItem}>
            <GameCardWithPreview
              title="Who Am I"
              subtitle="Social Play"
              icon={<HelpCircle size={24} color={colors.brand} strokeWidth={2} />}
              onPress={() => onGoToGame('who-am-i')}
              status="multiplayer"
              PreviewComponent={WhoAmIPreview}
            />
          </AnimatedCard>
          <AnimatedCard delay={160} style={styles.cardGridItem}>
            <GameCardWithPreview
              title="Draft With Friends"
              subtitle="Competitive"
              icon={<Users size={24} color={colors.brand} strokeWidth={2} />}
              onPress={() => onGoToGame('draft-with-friends')}
              status="multiplayer"
              PreviewComponent={DraftPreview}
            />
          </AnimatedCard>
          <AnimatedCard delay={240} style={styles.cardGridItem}>
            <GameCardWithPreview
              title="Imposter"
              subtitle="Deception"
              icon={<EyeOff size={24} color={colors.brand} strokeWidth={2} />}
              onPress={() => onGoToGame('imposter')}
              status="multiplayer"
              PreviewComponent={ImposterPreview}
            />
          </AnimatedCard>
          <AnimatedCard delay={320} style={styles.cardGridItem}>
            <GameCardWithPreview
              title="13 Words or Less"
              subtitle="Quick Play"
              icon={<MessageSquare size={24} color={colors.brand} strokeWidth={2} />}
              onPress={() => onGoToGame('13-words')}
              status="multiplayer"
              PreviewComponent={ThirteenWordsPreview}
            />
          </AnimatedCard>
          <AnimatedCard delay={400} style={styles.cardGridItem}>
            <GameCardWithPreview
              title="Custom Mystery"
              subtitle="Challenge Friends"
              icon={<UserSearch size={24} color={colors.brand} strokeWidth={2} />}
              onPress={() => onGoToGame('custom-mystery-player')}
              status="multiplayer"
              PreviewComponent={CustomMysteryPreview}
            />
          </AnimatedCard>
        </View>

        {/* Daily Games — 2x2 grid */}
        <Text style={[styles.sectionLabel, styles.sectionLabelTop, { color: brand.primary }]}>── DAILY GAMES ──</Text>
        <View style={styles.cardGrid}>
          <AnimatedCard delay={560} style={styles.cardGridItem}>
            <GameCardWithPreview
              title="Mystery Player"
              subtitle="Daily Challenge"
              icon={<Search size={24} color={colors.brand} strokeWidth={2} />}
              onPress={() => onGoToGame('player-guess')}
              status="unplayed"
              onArchivePress={onGoToArchive}
              PreviewComponent={MysteryPlayerPreview}
            />
          </AnimatedCard>
          <AnimatedCard delay={640} style={styles.cardGridItem}>
            <GameCardWithPreview
              title="Blind Rank 5"
              subtitle="Daily Challenge"
              icon={<ListOrdered size={24} color={colors.brand} strokeWidth={2} />}
              onPress={() => onGoToGame('blind-rank-5')}
              status="unplayed"
              onArchivePress={onGoToArchive}
              PreviewComponent={BlindRank5Preview}
            />
          </AnimatedCard>
          <AnimatedCard delay={720} style={styles.cardGridItem}>
            <GameCardWithPreview
              title="Showdown"
              subtitle="Daily Challenge"
              icon={<Swords size={24} color={colors.brand} strokeWidth={2} />}
              onPress={() => onGoToGame('blind-showdown')}
              status="unplayed"
              onArchivePress={onGoToArchive}
              PreviewComponent={ShowdownPreview}
            />
          </AnimatedCard>
          <AnimatedCard delay={800} style={styles.cardGridItem}>
            <GameCardWithPreview
              title="Ladder"
              subtitle="Daily Challenge"
              icon={<Brain size={24} color={colors.brand} strokeWidth={2} />}
              onPress={() => onGoToGame('trivia')}
              status="unplayed"
              onArchivePress={onGoToArchive}
              PreviewComponent={TriviaPreview}
            />
          </AnimatedCard>
          <AnimatedCard delay={880} style={styles.cardGridItem}>
            <GameCardWithPreview
              title="Power Play"
              subtitle="Daily Challenge"
              icon={<Zap size={24} color={colors.brand} strokeWidth={2} />}
              onPress={() => onGoToGame('power-play')}
              status="unplayed"
              onArchivePress={onGoToArchive}
              isNew
              PreviewComponent={PowerPlayPreview}
            />
          </AnimatedCard>
          <AnimatedCard delay={960} style={styles.cardGridItem}>
            <GameCardWithPreview
              title="Auto Complete"
              subtitle="Daily Challenge"
              icon={<TextSearch size={24} color={colors.brand} strokeWidth={2} />}
              onPress={() => onGoToGame('auto-complete')}
              status="unplayed"
              onArchivePress={onGoToArchive}
              isNew
              PreviewComponent={AutoCompletePreview}
            />
          </AnimatedCard>
        </View>
      </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  // ── Zone 1 ──
  zone1: {
    paddingTop: spacing['2xl'],
    paddingBottom: spacing['2xl'],
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    zIndex: 10,
  },
  title: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 42,
    lineHeight: 44,
    letterSpacing: 1,
    color: dark.textPrimary,
  },
  subtitle: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: 'rgba(255,255,255,0.70)',
    marginTop: 4,
    marginBottom: spacing['2xl'],
  },
  statStrip: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    padding: spacing.lg,
  },
  statItem: {
    flex: 1,
  },
  statItemLeft: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.20)',
    marginRight: spacing.lg,
    paddingRight: spacing.lg,
  },
  statLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.60)',
    marginBottom: 2,
  },
  statValue: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 15,
    color: dark.textPrimary,
  },

  // ── Zone 2 ──
  zone2: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  zone2Content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['3xl'],
    paddingBottom: 0,
    maxWidth: 960,
    alignSelf: 'center' as const,
    width: '100%',
  },
  sectionLabel: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  sectionLabelTop: {
    marginTop: spacing['3xl'],
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  cardGridItem: {
    width: '47%',
    maxWidth: 300,
  },
  cardGridCentered: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  archiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
  },
  archiveButtonText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: dark.textPrimary,
  },
});
