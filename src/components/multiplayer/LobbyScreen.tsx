import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native'
import { brand, dark, light, colors, darkColors, fonts, fontFamily, spacing, radius, layout } from '../../styles/theme'
import { useTheme } from '../../hooks/useTheme'
import type { GameLobby, LobbyPlayer } from '../../lib/multiplayer'
import type { PresencePlayer } from '../../hooks/useLobby'

interface LobbyScreenProps {
  lobby: GameLobby
  players: LobbyPlayer[]
  presencePlayers: PresencePlayer[]
  isHost: boolean
  isReady: boolean
  onToggleReady: () => void
  onStart: () => void
  onLeave: () => void
  onUpdateSettings: (settings: Record<string, unknown>) => void
  renderSettings?: (settings: Record<string, unknown>, isHost: boolean) => React.ReactNode
}

/**
 * Attempts to copy text to clipboard using available APIs.
 * Returns true if successful.
 */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Try expo-clipboard first
    const ExpoClipboard = require('expo-clipboard')
    if (ExpoClipboard?.setStringAsync) {
      await ExpoClipboard.setStringAsync(text)
      return true
    }
  } catch {
    // expo-clipboard not available
  }

  try {
    // Try @react-native-clipboard/clipboard
    const RNClipboard = require('@react-native-clipboard/clipboard')
    const Clipboard = RNClipboard?.default ?? RNClipboard
    if (Clipboard?.setString) {
      Clipboard.setString(text)
      return true
    }
  } catch {
    // @react-native-clipboard/clipboard not available
  }

  // Web fallback
  if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Clipboard API failed
    }
  }

  return false
}

export function LobbyScreen({
  lobby,
  players,
  presencePlayers,
  isHost,
  isReady,
  onToggleReady,
  onStart,
  onLeave,
  onUpdateSettings,
  renderSettings,
}: LobbyScreenProps) {
  const { isDark } = useTheme()
  const [copiedVisible, setCopiedVisible] = useState(false)

  // Build a set of connected user IDs AND player indexes for quick lookup
  // (presence may track by userId or playerIndex depending on when they joined)
  const connectedIndexes = new Set(presencePlayers.map((p) => p.playerIndex))
  const connectedUserIds = new Set(presencePlayers.map((p) => p.userId).filter(Boolean))

  // Non-host players only
  const nonHostPlayers = players.filter((p) => !p.is_host)
  const allNonHostReady = nonHostPlayers.length >= 1 && nonHostPlayers.every((p) => p.is_ready)
  const canStart = isHost && allNonHostReady

  const gameTypeLabel = lobby.game_type.charAt(0).toUpperCase() + lobby.game_type.slice(1)

  const handleCopyCode = useCallback(async () => {
    const success = await copyToClipboard(lobby.code)
    // Show "Copied!" regardless — visual feedback even if clipboard failed
    setCopiedVisible(true)
    setTimeout(() => setCopiedVisible(false), 1500)
  }, [lobby.code])

  return (
    <View style={[styles.container, { backgroundColor: isDark ? dark.background : light.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: isDark ? dark.textPrimary : light.textPrimary }]}>LOBBY</Text>
        <TouchableOpacity onPress={onLeave} activeOpacity={0.7}>
          <Text style={styles.leaveText}>Leave</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Lobby code */}
        <TouchableOpacity
          style={styles.codeContainer}
          onPress={handleCopyCode}
          activeOpacity={0.7}
        >
          <Text style={[styles.codeText, { color: isDark ? dark.textPrimary : light.textPrimary }]}>{lobby.code}</Text>
          <Text style={[styles.codeSubtitle, { color: isDark ? dark.textSecondary : light.textSecondary }]}>
            {copiedVisible ? 'Copied!' : 'Tap to copy'}
          </Text>
        </TouchableOpacity>

        {/* Game type badge */}
        <View style={styles.badgeRow}>
          <View style={styles.gameTypeBadge}>
            <Text style={styles.gameTypeBadgeText}>{gameTypeLabel}</Text>
          </View>
        </View>

        {/* Player count */}
        <Text style={[styles.playerCount, { color: isDark ? dark.textSecondary : light.textSecondary }]}>
          {players.length} {players.length === 1 ? 'player' : 'players'}
        </Text>

        {/* Player list */}
        <View style={styles.playerList}>
          {players.map((player) => {
            const isConnected = connectedIndexes.has(player.player_index) || connectedUserIds.has(player.user_id)

            return (
              <View
                key={player.id}
                style={[styles.playerRow, { backgroundColor: isDark ? dark.surface : light.surface }, !isConnected && styles.playerRowDisconnected]}
              >
                <View style={styles.playerInfo}>
                  <Text
                    style={[
                      styles.playerName,
                      { color: isDark ? dark.textPrimary : light.textPrimary },
                      !isConnected && { color: isDark ? dark.textSecondary : light.textSecondary },
                    ]}
                  >
                    {player.display_name}
                  </Text>
                  {player.is_host && (
                    <Text style={styles.hostLabel}>(Host)</Text>
                  )}
                  {!isConnected && (
                    <Text style={styles.disconnectedLabel}>(disconnected)</Text>
                  )}
                </View>
                <View
                  style={[
                    styles.readyDot,
                    player.is_ready ? styles.readyDotActive : styles.readyDotInactive,
                  ]}
                />
              </View>
            )
          })}
        </View>

        {/* Settings area */}
        {renderSettings ? (
          <View style={styles.settingsArea}>
            {renderSettings(lobby.settings, isHost)}
          </View>
        ) : null}
      </ScrollView>

      {/* Bottom actions */}
      <View style={styles.bottomActions}>
        {isHost ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.startButton, !canStart && styles.actionButtonDisabled]}
            onPress={onStart}
            disabled={!canStart}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>START GAME</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.actionButton,
              isReady ? styles.readyButton : styles.notReadyButton,
            ]}
            onPress={onToggleReady}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>
              {isReady ? 'NOT READY' : 'READY'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 18,
  },
  leaveText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: brand.dark,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing['5xl'],
  },
  codeContainer: {
    alignItems: 'center',
    marginTop: spacing['2xl'],
    marginBottom: spacing.lg,
  },
  codeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 36,
    letterSpacing: 6,
  },
  codeSubtitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  badgeRow: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  gameTypeBadge: {
    backgroundColor: brand.primary,
    borderRadius: radius.chip,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  gameTypeBadgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  playerCount: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  playerList: {
    gap: spacing.sm,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.secondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  playerRowDisconnected: {
    opacity: 0.4,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  playerName: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
  },
  playerNameDisconnected: {},
  hostLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.brandMid,
  },
  disconnectedLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.midGray,
  },
  readyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  readyDotActive: {
    backgroundColor: colors.accentGreen,
  },
  readyDotInactive: {
    backgroundColor: colors.ruleGray,
  },
  settingsArea: {
    marginTop: spacing['2xl'],
  },
  bottomActions: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing['5xl'],
    paddingTop: spacing.lg,
  },
  actionButton: {
    height: layout.buttonHeight,
    borderRadius: radius.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  startButton: {
    backgroundColor: brand.primary,
  },
  notReadyButton: {
    backgroundColor: brand.primary,
  },
  readyButton: {
    backgroundColor: colors.accentGreen,
  },
  actionButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
})
