import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { brand, dark, light, colors, darkColors, fonts, fontFamily, spacing, radius } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import { supabase } from '../../lib/supabase';
import PrimaryButton from '../../screens/components/ui/PrimaryButton';
import SlideTag from '../../screens/components/ui/SlideTag';
import GhostWatermark from '../../screens/components/ui/GhostWatermark';

interface Props {
  onBack: () => void;
}

const NBA_TEAMS = [
  'Hawks', 'Celtics', 'Nets', 'Hornets', 'Bulls', 'Cavaliers', 'Mavericks', 'Nuggets',
  'Pistons', 'Warriors', 'Rockets', 'Pacers', 'Clippers', 'Lakers', 'Grizzlies', 'Heat',
  'Bucks', 'Timberwolves', 'Pelicans', 'Knicks', 'Thunder', 'Magic', '76ers', 'Suns',
  'Trail Blazers', 'Kings', 'Spurs', 'Raptors', 'Jazz', 'Wizards',
];

const NFL_TEAMS = [
  'Cardinals', 'Falcons', 'Ravens', 'Bills', 'Panthers', 'Bears', 'Bengals', 'Browns',
  'Cowboys', 'Broncos', 'Lions', 'Packers', 'Texans', 'Colts', 'Jaguars', 'Chiefs',
  'Raiders', 'Chargers', 'Rams', 'Dolphins', 'Vikings', 'Patriots', 'Saints', 'Giants',
  'Jets', 'Eagles', 'Steelers', '49ers', 'Seahawks', 'Buccaneers', 'Titans', 'Commanders',
];

const MLB_TEAMS = [
  'Diamondbacks', 'Braves', 'Orioles', 'Red Sox', 'Cubs', 'White Sox', 'Reds', 'Guardians',
  'Rockies', 'Tigers', 'Astros', 'Royals', 'Angels', 'Dodgers', 'Marlins', 'Brewers',
  'Twins', 'Mets', 'Yankees', 'Athletics', 'Phillies', 'Pirates', 'Padres', 'Giants',
  'Mariners', 'Cardinals', 'Rays', 'Rangers', 'Blue Jays', 'Nationals',
];

const NHL_TEAMS = [
  'Ducks', 'Coyotes', 'Bruins', 'Sabres', 'Flames', 'Hurricanes', 'Blackhawks', 'Avalanche',
  'Blue Jackets', 'Stars', 'Red Wings', 'Oilers', 'Panthers', 'Kings', 'Wild', 'Canadiens',
  'Predators', 'Devils', 'Islanders', 'Rangers', 'Senators', 'Flyers', 'Penguins', 'Sharks',
  'Kraken', 'Blues', 'Lightning', 'Maple Leafs', 'Canucks', 'Golden Knights', 'Jets', 'Capitals',
];

const LEAGUE_TEAMS: Record<string, string[]> = {
  NBA: NBA_TEAMS,
  NFL: NFL_TEAMS,
  MLB: MLB_TEAMS,
  NHL: NHL_TEAMS,
};

const LEAGUE_ORDER = ['NBA', 'NFL', 'MLB', 'NHL'];

export default function FavoriteTeams({ onBack }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const [selections, setSelections] = useState<Record<string, string>>({
    NBA: '', NFL: '', MLB: '', NHL: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const bgColor = isDark ? dark.background : light.background;
  const textSecondary = isDark ? dark.textSecondary : light.textSecondary;
  const textPrimary = isDark ? dark.textPrimary : light.textPrimary;
  const watermarkColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(252,52,92,0.05)';

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) { setLoading(false); return; }
      const { data } = await supabase
        .from('profiles')
        .select('favorite_nba_team, favorite_nfl_team, favorite_mlb_team, favorite_nhl_team')
        .eq('id', user.id)
        .single();
      if (!cancelled && data) {
        setSelections({
          NBA: data.favorite_nba_team ?? '',
          NFL: data.favorite_nfl_team ?? '',
          MLB: data.favorite_mlb_team ?? '',
          NHL: data.favorite_nhl_team ?? '',
        });
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  function selectTeam(league: string, team: string) {
    setSaved(false);
    setSelections(prev => ({
      ...prev,
      [league]: prev[league] === team ? '' : team,
    }));
  }

  async function handleSave() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').upsert({
        id: user.id,
        favorite_nba_team: selections.NBA || null,
        favorite_nfl_team: selections.NFL || null,
        favorite_mlb_team: selections.MLB || null,
        favorite_nhl_team: selections.NHL || null,
      });
      setSaved(true);
    }
    setSaving(false);
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: bgColor }]} edges={['top']}>
      <GhostWatermark text="BK" color={watermarkColor} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
          <ArrowLeft size={22} color={textPrimary} strokeWidth={2.5} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: textPrimary }]}>Favorite Teams</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator color={brand.primary} style={{ marginTop: spacing['3xl'] }} />
        ) : (
          <>
            {LEAGUE_ORDER.map(league => {
              const teams = LEAGUE_TEAMS[league];
              return (
                <View key={league} style={styles.leagueSection}>
                  {/* Section tag */}
                  <SlideTag label={league} variant="red" />

                  {/* Team list — timeline style */}
                  <View style={styles.teamList}>
                    {teams.map(team => {
                      const isSelected = selections[league] === team;
                      return (
                        <Pressable
                          key={team}
                          onPress={() => selectTeam(league, team)}
                          style={styles.teamRow}
                        >
                          <Text style={[
                            styles.leagueAbbr,
                            { color: isSelected ? brand.primary : textSecondary },
                          ]}>
                            {league}
                          </Text>
                          <Text style={[
                            styles.teamName,
                            { color: isSelected ? textPrimary : textSecondary },
                            isSelected && styles.teamNameSelected,
                          ]}>
                            {team}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              );
            })}

            <View style={{ marginTop: spacing.lg }}>
              <PrimaryButton label={saving ? 'SAVING...' : 'SAVE'} onPress={handleSave} loading={saving} />
            </View>

            {saved && (
              <Text style={styles.savedText}>Saved successfully!</Text>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  backBtn: {
    padding: spacing.sm,
    marginRight: spacing.md,
  },
  headerTitle: {
    fontFamily: fonts.display,
    fontSize: 36,
    lineHeight: 38,
    letterSpacing: 1,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 48,
    gap: spacing['2xl'],
  },
  leagueSection: {
    gap: spacing.md,
  },
  teamList: {
    gap: 0,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  leagueAbbr: {
    fontFamily: fonts.display,
    fontSize: 26,
    width: 72,
    letterSpacing: 1,
  },
  teamName: {
    fontFamily: fonts.body,
    fontSize: 15,
    flex: 1,
  },
  teamNameSelected: {
    fontFamily: fonts.bodyBold,
    fontWeight: '700',
  },
  savedText: {
    fontFamily: fonts.bodyBold,
    fontWeight: '700',
    fontSize: 14,
    color: colors.accentGreen,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
