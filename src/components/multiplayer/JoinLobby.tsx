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
import { colors, darkColors, fontFamily, spacing, radius, layout } from '../../styles/theme'
import { joinLobby } from '../../lib/multiplayer'
import { supabase } from '../../lib/supabase'

interface JoinLobbyProps {
  onJoin: (lobbyId: string, playerIndex: number) => void
  onBack: () => void
}

export function JoinLobby({ onJoin, onBack }: JoinLobbyProps) {
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
      const result = await joinLobby(code.toUpperCase(), displayName.trim(), userId)
      onJoin(result.lobbyId, result.playerIndex)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to join lobby'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
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
          <Text style={styles.backText}>{'<'}</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>JOIN GAME</Text>

        {/* Code input */}
        <TextInput
          style={[styles.codeInput, codeFocused && styles.codeInputFocused]}
          value={code}
          onChangeText={(text) => {
            setCode(text.toUpperCase())
            setError(null)
          }}
          placeholder="ABCDEF"
          placeholderTextColor={darkColors.border}
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
          style={styles.nameInput}
          value={displayName}
          onChangeText={(text) => {
            setDisplayName(text)
            setError(null)
          }}
          placeholder="Your Display Name"
          placeholderTextColor={darkColors.textSecondary}
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
            <ActivityIndicator color={colors.white} />
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
    backgroundColor: darkColors.background,
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
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.white,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.white,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing['3xl'],
  },
  codeInput: {
    backgroundColor: darkColors.surfaceElevated,
    borderWidth: 2,
    borderColor: darkColors.border,
    borderRadius: radius.primary,
    height: 64,
    fontFamily: fontFamily.bold,
    fontSize: 32,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: spacing.lg,
  },
  codeInputFocused: {
    borderColor: colors.brand,
  },
  nameInput: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: radius.secondary,
    height: layout.inputHeight,
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.white,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing['2xl'],
  },
  joinButton: {
    backgroundColor: colors.brand,
    borderRadius: radius.primary,
    height: layout.buttonHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtonDisabled: {
    opacity: 0.5,
  },
  joinButtonText: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.white,
  },
  errorText: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.brandDark,
    textAlign: 'center',
    marginTop: spacing.md,
  },
})
