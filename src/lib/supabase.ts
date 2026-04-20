import { Platform, Linking } from 'react-native'
import { createClient } from '@supabase/supabase-js'

// Safe imports for native modules
let SecureStore: any = null;
let WebBrowser: any = null;
try { SecureStore = require('expo-secure-store'); } catch {}
try { WebBrowser = require('expo-web-browser'); } catch {}
try { require('react-native-url-polyfill/auto'); } catch {}

// Build redirect URI using Linking so it works in dev (exp://) and production (ball-knowledge://)
let ExpoLinking: any = null;
try { ExpoLinking = require('expo-linking'); } catch {}

console.log('[Supabase] Initializing...');

const SecureStoreAdapter = SecureStore ? {
  getItem: async (key: string) => {
    try { return await SecureStore.getItemAsync(key); } catch { return null; }
  },
  setItem: async (key: string, value: string) => {
    try { await SecureStore.setItemAsync(key, value); } catch {}
  },
  removeItem: async (key: string) => {
    try { await SecureStore.deleteItemAsync(key); } catch {}
  },
} : undefined;

// Required for expo-web-browser to complete the session
try { WebBrowser?.maybeCompleteAuthSession(); } catch {}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''

console.log('[Supabase] URL present:', !!supabaseUrl, 'Key present:', !!supabaseAnonKey);

let supabase: any;
try {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      ...(Platform.OS !== 'web' && SecureStoreAdapter ? { storage: SecureStoreAdapter } : {}),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: Platform.OS === 'web',
    },
  });
  console.log('[Supabase] Client created successfully');
} catch (e) {
  console.error('[Supabase] Client creation FAILED:', e);
  // Create a minimal stub so the app doesn't crash
  supabase = {
    auth: { getSession: async () => ({ data: { session: null } }), getUser: async () => ({ data: { user: null } }), signInAnonymously: async () => ({ error: new Error('Supabase not initialized') }), signOut: async () => ({}), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }), signInWithIdToken: async () => ({ error: new Error('Supabase not initialized') }), signInWithOAuth: async () => ({ error: new Error('Supabase not initialized') }), signInWithPassword: async () => ({ error: new Error('Supabase not initialized') }), signUp: async () => ({ error: new Error('Supabase not initialized') }), updateUser: async () => ({ error: new Error('Supabase not initialized') }) },
    from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }), maybeSingle: async () => ({ data: null, error: null }), order: () => ({ limit: async () => ({ data: [], error: null }) }) }), in: () => ({ eq: () => ({ order: async () => ({ data: [], error: null }) }) }) }), insert: async () => ({ error: null }), update: async () => ({ error: null }), upsert: async () => ({ error: null, data: null }), delete: async () => ({ error: null }) }),
    rpc: async () => ({ data: null, error: null }),
    channel: () => ({ on: () => ({}), subscribe: () => ({}), unsubscribe: () => ({}), track: () => ({}), send: async () => ({}) }),
  };
}

export { supabase }

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
/**
 * Build the correct redirect URI for OAuth callbacks.
 * - Dev: exp://192.168.x.x:8081/--/auth/callback
 * - Production: ball-knowledge://auth/callback
 * - Web: current origin
 */
export function getRedirectUri(): string {
  if (Platform.OS === 'web') {
    return (typeof window !== 'undefined' ? window.location.origin : process.env.EXPO_PUBLIC_APP_URL) || 'https://ballknowledgeapp.com';
  }
  if (ExpoLinking?.createURL) {
    return ExpoLinking.createURL('auth/callback');
  }
  return 'ball-knowledge://auth/callback';
}

export async function signInWithGoogle() {
  if (Platform.OS === 'web') {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: getRedirectUri() },
    })
  }

  // Native: use expo-web-browser so the OAuth flow stays in-app and can
  // redirect back via the custom URL scheme.
  const redirectTo = getRedirectUri()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  })

  if (error || !data?.url) {
    return { data: null, error: error || new Error('No OAuth URL returned') }
  }

  if (!WebBrowser?.openAuthSessionAsync) {
    return { data: null, error: new Error('WebBrowser not available') }
  }
  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo)

  if (result.type === 'success' && result.url) {
    // Supabase returns tokens in the URL fragment (implicit flow) or query string (PKCE)
    const fragment = result.url.split('#')[1] || ''
    const query = (result.url.split('?')[1] || '').split('#')[0] || ''
    const params = new URLSearchParams(fragment || query)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')

    if (accessToken && refreshToken) {
      return supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
    }
  }

  return { data: null, error: new Error(result.type === 'cancel' ? 'Sign in cancelled' : 'Sign in failed — please try again') }
}
