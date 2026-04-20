import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { brand, dark, light, colors, darkColors, fonts, fontFamily, spacing, radius, layout } from '../../styles/theme'
import { useTheme } from '../../hooks/useTheme'
import { joinLobby } from '../../lib/multiplayer'
import { supabase } from '../../lib/supabase'

interface JoinLobbyProps {
  onJoin: (lobbyId: string, playerIndex: number, lobbyCode: string, gameType: string) => void
  onBack: () => void
}

export function JoinLobby({ onJoin, onBack }: JoinLobbyProps) {
  const { isDark } = useTheme()
  const [code, setCode] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [userId, setUserId] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [codeFocused, setCodeFocused] = useState(false)

  const nameInputRef = useRef<TextInput>(null)

  // Pre-fill display name from auth user metadata on mount
  useEffect(() => {
    async function loadUser() {
      try {
        const { data } = await supabase.auth.getUser()
        if (data?.user) {
          setUserId(data.user.id)
          const meta = data.user.user_metadata
          if (meta?.display_name) {
            setDisplayName(meta.display_name)
          } else if (meta?.full_name) {
            setDisplayName(meta.full_name)
          } else if (meta?.name) {
            setDisplayName(meta.name)
          }
        }
      } catch {
        // Silently fail — user can still type a name manually
      }
    }
    loadUser()
  }, [])

  const canJoin = code.length === 6 && displayName.trim().length > 0

  async function handleJoin() {
    if (!canJoin || loading) return

    setLoading(true)
    setError(null)

    try {
      const upperCode = code.toUpperCase()
      const result = await joinLobby(upperCode, displayName.trim(), userId)
      onJoin(result.lobbyId, result.playerIndex, upperCode, result.lobby.game_type)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to join lobby'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: isDark ? dark.background : light.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.backText, { color: isDark ? dark.textPrimary : light.textPrimary }]}>{'<'}</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={[styles.title, { color: isDark ? dark.textPrimary : light.textPrimary }]}>JOIN GAME</Text>

        {/* Code input */}
        <TextInput
          style={[
            styles.codeInput,
            { backgroundColor: isDark ? dark.inputBg : light.inputBg, borderColor: isDark ? dark.inputBorder : light.inputBorder, color: isDark ? dark.textPrimary : light.textPrimary },
            codeFocused && styles.codeInputFocused,
          ]}
          value={code}
          onChangeText={(text) => {
            setCode(text.toUpperCase())
            setError(null)
          }}
          placeholder="ABCDEF"
          placeholderTextColor={isDark ? dark.textMuted : light.textMuted}
          autoCapitalize="characters"
          maxLength={6}
          onFocus={() => setCodeFocused(true)}
          onBlur={() => setCodeFocused(false)}
          onSubmitEditing={() => nameInputRef.current?.focus()}
          returnKeyType="next"
        />

        {/* Display name input */}
        <TextInput
          ref={nameInputRef}
          style={[styles.nameInput, { backgroundColor: isDark ? dark.inputBg : light.inputBg, color: isDark ? dark.textPrimary : light.textPrimary }]}
          value={displayName}
          onChangeText={(text) => {
            setDisplayName(text)
            setError(null)
          }}
          placeholder="Your Display Name"
          placeholderTextColor={isDark ? dark.textSecondary : light.textSecondary}
          maxLength={30}
          returnKeyType="go"
          onSubmitEditing={handleJoin}
        />

        {/* Join button */}
        <TouchableOpacity
          style={[styles.joinButton, !canJoin && styles.joinButtonDisabled]}
          onPress={handleJoin}
          disabled={!canJoin || loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.joinButtonText}>JOIN GAME</Text>
          )}
        </TouchableOpacity>

        {/* Error message */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing['3xl'],
  },
  backButton: {
    width: layout.minTapTarget,
    height: layout.minTapTarget,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  backText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 22,
  },
  title: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 22,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing['3xl'],
  },
  codeInput: {
    borderWidth: 2,
    borderRadius: radius.primary,
    height: 64,
    fontFamily: fonts.bodySemiBold,
    fontSize: 32,
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: spacing.lg,
  },
  codeInputFocused: {
    borderColor: brand.primary,
  },
  nameInput: {
    borderRadius: radius.secondary,
    height: layout.inputHeight,
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing['2xl'],
  },
  joinButton: {
    backgroundColor: brand.primary,
    borderRadius: radius.primary,
    height: layout.buttonHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtonDisabled: {
    opacity: 0.5,
  },
  joinButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  errorText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: brand.dark,
    textAlign: 'center',
    marginTop: spacing.md,
  },
})
