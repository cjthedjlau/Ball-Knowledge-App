import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'

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

/** Trigger Google OAuth — on web, redirects back to the current origin. */
export async function signInWithGoogle() {
  const redirectTo =
    Platform.OS === 'web' ? window.location.origin : undefined

  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  })
}
