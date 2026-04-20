import { useState, useRef, useEffect, useCallback } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { subscribeLobby, broadcastEvent } from '../lib/multiplayer'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseLobbyOptions {
  code: string | null
  displayName: string
  userId: string | null
  playerIndex: number
}

export interface PresencePlayer {
  displayName: string
  playerIndex: number
  userId: string | null
  presenceRef?: string
}

export interface UseLobbyReturn {
  channel: RealtimeChannel | null
  presencePlayers: PresencePlayer[]
  isConnected: boolean
  broadcast: (event: string, payload: unknown) => void
  onEvent: (event: string, callback: (payload: unknown) => void) => () => void
  leave: () => void
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useLobby({
  code,
  displayName,
  userId,
  playerIndex,
}: UseLobbyOptions): UseLobbyReturn {
  const [presencePlayers, setPresencePlayers] = useState<PresencePlayer[]>([])
  const [isConnected, setIsConnected] = useState(false)

  const channelRef = useRef<RealtimeChannel | null>(null)
  const eventListenersRef = useRef<Map<string, Set<(payload: unknown) => void>>>(
    new Map(),
  )

  // -------------------------------------------------------------------------
  // Channel lifecycle — subscribe on mount / code change, clean up on unmount
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (!code) {
      return
    }

    let stale = false
    const channel = subscribeLobby(code)
    channelRef.current = channel

    // Listen for presence sync events
    channel.on('presence', { event: 'sync' }, () => {
      if (stale) return
      const state = channel.presenceState()
      const players: PresencePlayer[] = []

      for (const key of Object.keys(state)) {
        const entries = state[key] as Array<
          PresencePlayer & { presence_ref?: string }
        >
        for (const entry of entries) {
          players.push({
            displayName: entry.displayName,
            playerIndex: entry.playerIndex,
            userId: entry.userId,
            presenceRef: entry.presence_ref,
          })
        }
      }

      setPresencePlayers(players)
    })

    // Single broadcast listener that dispatches to registered callbacks
    channel.on('broadcast', { event: '*' }, (message: { event: string; payload: unknown }) => {
      if (stale) return
      const listeners = eventListenersRef.current.get(message.event)
      if (listeners) {
        for (const cb of listeners) {
          cb(message.payload)
        }
      }
    })

    // Subscribe and track presence once connected
    channel.subscribe((status) => {
      if (stale) return
      if (status === 'SUBSCRIBED') {
        setIsConnected(true)
        channel.track({
          displayName,
          playerIndex,
          userId,
        })
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        setIsConnected(false)
        console.error(`Realtime channel error: ${status}`)
      }
    })

    // Cleanup on code change or unmount
    return () => {
      stale = true
      channel.unsubscribe()
      channelRef.current = null
      setIsConnected(false)
      setPresencePlayers([])
    }
    // Only re-subscribe when the lobby code changes. The identity values
    // (displayName, playerIndex, userId) are captured at subscribe time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  // -------------------------------------------------------------------------
  // broadcast — send a broadcast event on the current channel
  // -------------------------------------------------------------------------

  const broadcast = useCallback((event: string, payload: unknown) => {
    const channel = channelRef.current
    if (!channel) {
      return
    }
    broadcastEvent(channel, event, payload)
  }, [])

  // -------------------------------------------------------------------------
  // onEvent — register a callback for a specific broadcast event
  // -------------------------------------------------------------------------

  const onEvent = useCallback(
    (event: string, callback: (payload: unknown) => void): (() => void) => {
      const listeners = eventListenersRef.current

      if (!listeners.has(event)) {
        listeners.set(event, new Set())
      }

      listeners.get(event)!.add(callback)

      // Return unsubscribe function
      return () => {
        const set = listeners.get(event)
        if (set) {
          set.delete(callback)
          if (set.size === 0) {
            listeners.delete(event)
          }
        }
      }
    },
    [],
  )

  // -------------------------------------------------------------------------
  // leave — manually disconnect from the channel
  // -------------------------------------------------------------------------

  const leave = useCallback(() => {
    const channel = channelRef.current
    if (channel) {
      channel.unsubscribe()
      channelRef.current = null
    }
    setIsConnected(false)
    setPresencePlayers([])
  }, [])

  // -------------------------------------------------------------------------
  // Return
  // -------------------------------------------------------------------------

  return {
    channel: channelRef.current,
    presencePlayers,
    isConnected,
    broadcast,
    onEvent,
    leave,
  }
}
