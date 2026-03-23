import { Share, Platform } from 'react-native';
import { supabase } from './supabase';

const APP_URL = 'https://ball-knowledge-app-olive.vercel.app';

/**
 * Get or create the current user's invite code.
 * Stored on the profile as `invite_code`.
 */
export async function getOrCreateInviteCode(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Check if user already has an invite code
  const { data: profile } = await supabase
    .from('profiles')
    .select('invite_code')
    .eq('id', user.id)
    .single();

  if ((profile as any)?.invite_code) {
    return (profile as any).invite_code;
  }

  // Generate a new 8-character code
  const code = generateCode();

  await supabase
    .from('profiles')
    .update({ invite_code: code })
    .eq('id', user.id);

  return code;
}

/**
 * Share an invite link with the user's unique code.
 */
export async function shareInviteLink() {
  const code = await getOrCreateInviteCode();
  if (!code) return;

  const link = `${APP_URL}?invite=${code}`;
  const message = [
    `Join me on Ball Knowledge and let's compete!`,
    ``,
    `Use my invite link to connect as friends:`,
    link,
    ``,
    `Or enter my code: ${code}`,
  ].join('\n');

  await Share.share({ message });
}

/**
 * Check the current page URL for an invite code query parameter.
 * Returns the code if found, null otherwise. Web-only.
 */
export function getInviteCodeFromURL(): string | null {
  if (Platform.OS !== 'web') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('invite');
    if (code) {
      // Clean the URL so it doesn't re-trigger on refresh
      const url = new URL(window.location.href);
      url.searchParams.delete('invite');
      window.history.replaceState({}, '', url.pathname + url.search);
      return code.trim().toUpperCase();
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Accept a friend invite by code. Adds both users as friends (bidirectional).
 */
export async function acceptInvite(code: string): Promise<{ success: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Sign in to add friends' };

  // Find the user who owns this invite code
  const { data: inviter } = await supabase
    .from('profiles')
    .select('id, display_name')
    .eq('invite_code', code)
    .single();

  if (!inviter) return { success: false, error: 'Invalid invite code' };
  if (inviter.id === user.id) return { success: false, error: "You can't add yourself" };

  // Add friend bidirectionally using the RPC function
  const { error } = await supabase.rpc('add_friend', {
    user_a: user.id,
    user_b: inviter.id,
  });

  if (error) {
    if (error.message.includes('already friends')) {
      return { success: false, error: 'Already friends!' };
    }
    return { success: false, error: 'Could not add friend' };
  }

  return { success: true };
}

/**
 * Enter a friend code manually (same as accepting an invite).
 */
export async function addFriendByCode(code: string) {
  return acceptInvite(code.trim().toUpperCase());
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1 to avoid confusion
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
