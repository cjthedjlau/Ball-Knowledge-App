import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { colors, darkColors, fontFamily, spacing } from '../../styles/theme';
import { supabase } from '../../lib/supabase';
import PrimaryButton from '../../screens/components/ui/PrimaryButton';

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
  const [selections, setSelections] = useState<Record<string, string>>({
    NBA: '', NFL: '', MLB: '', NHL: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Zone 1 */}
      <View style={styles.zone1}>
        <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
          <ArrowLeft size={22} color={colors.white} strokeWidth={2.5} />
        </Pressable>
        <Text style={styles.zone1Title}>FAVORITE TEAMS</Text>
      </View>

      {/* Zone 2 */}
      <ScrollView
        style={styles.zone2}
        contentContainerStyle={styles.zone2Content}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator color={colors.brand} style={{ marginTop: spacing['3xl'] }} />
        ) : (
          <>
            {LEAGUE_ORDER.map(league => (
              <View key={league} style={styles.leagueSection}>
                <Text style={styles.leagueHeader}>{league}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
                  {LEAGUE_TEAMS[league].map(team => {
                    const isSelected = selections[league] === team;
                    return (
                      <Pressable
                        key={team}
                        onPress={() => selectTeam(league, team)}
                        style={[styles.teamPill, isSelected && styles.teamPillSelected]}
                      >
                        <Text style={[styles.teamPillText, isSelected && styles.teamPillTextSelected]}>
                          {team}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            ))}

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
    backgroundColor: 'transparent',
  },
  zone1: {
    backgroundColor: colors.brand,
    paddingTop: spacing.lg,
    paddingBottom: spacing['3xl'] + spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    zIndex: 2,
  },
  backBtn: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    padding: spacing.sm,
    zIndex: 10,
  },
  zone1Title: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 28,
    letterSpacing: 3,
    color: colors.white,
  },
  zone2: {
    flex: 1,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1,
  },
  zone2Content: {
    paddingTop: spacing['4xl'],
    paddingHorizontal: spacing.lg,
    paddingBottom: 48,
    gap: spacing.lg,
  },
  leagueSection: {
    gap: spacing.sm,
  },
  leagueHeader: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 2,
    color: darkColors.textSecondary,
  },
  pillRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  teamPill: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 999,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  teamPillSelected: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  teamPillText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: darkColors.textSecondary,
  },
  teamPillTextSelected: {
    color: colors.white,
  },
  savedText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 14,
    color: colors.accentGreen,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
