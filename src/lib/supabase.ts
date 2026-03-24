import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import * as WebBrowser from 'expo-web-browser'
import 'react-native-url-polyfill/auto'

// Required for expo-web-browser to complete the session on web
WebBrowser.maybeCompleteAuthSession()

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
})

/**
 * Trigger Google OAuth.
 * - Web: standard redirect to the current origin.
 * - Native (iOS/Android): opens an in-app browser via expo-web-browser and redirects
 *   back to the app using the `ball-knowledge://` custom URL scheme.
 *
 * IMPORTANT — Supabase dashboard setup required:
 * In your Supabase project → Authentication → URL Configuration → Redirect URLs,
 * add: ball-knowledge://auth/callback
 */
export async function signInWithGoogle() {
  if (Platform.OS === 'web') {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  // Native: use expo-web-browser so the OAuth flow stays in-app and can
  // redirect back via the custom URL scheme instead of a localhost URL.
  const redirectTo = 'ball-knowledge://auth/callback'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true, // We open the browser manually below
    },
  })

  if (error || !data?.url) {
    return { data: null, error: error ?? new Error('No OAuth URL returned') }
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo)

  if (result.type === 'success' && result.url) {
    // Supabase returns tokens in the URL fragment (implicit flow) or query string (PKCE)
    const fragment = result.url.split('#')[1] ?? ''
    const query = result.url.split('?')[1]?.split('#')[0] ?? ''
    const params = new URLSearchParams(fragment || query)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')

    if (accessToken && refreshToken) {
      return supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
    }
  }

  return { data: null, error: null }
}
