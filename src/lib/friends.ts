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

  // Check if already friends (query both directions)
  const [{ data: existsA }, { data: existsB }] = await Promise.all([
    supabase.from('friendships').select('user_a').eq('user_a', user.id).eq('user_b', inviter.id).maybeSingle(),
    supabase.from('friendships').select('user_a').eq('user_a', inviter.id).eq('user_b', user.id).maybeSingle(),
  ]);
  if (existsA || existsB) return { success: false, error: 'Already friends!' };

  // Insert a single directed row; queries check both directions
  const { error } = await supabase
    .from('friendships')
    .insert({ user_a: user.id, user_b: inviter.id });

  if (error) {
    if (error.code === '23505') return { success: false, error: 'Already friends!' };
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

/**
 * Send a push notification to all friends with the current user's game result.
 * Silently no-ops if the user has no friends or none have push tokens.
 * Returns the number of friends notified.
 */
export async function notifyFriendsOfResult(
  gameLabel: string,
  league: string,
  resultSummary: string,
): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  // Get sender's display name
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user.id)
    .single();
  const senderName: string = (profile as any)?.display_name ?? 'A friend';

  // Collect friend IDs from both sides of the friendship
  const [{ data: asA }, { data: asB }] = await Promise.all([
    supabase.from('friendships').select('user_b').eq('user_a', user.id),
    supabase.from('friendships').select('user_a').eq('user_b', user.id),
  ]);

  const friendIds = [
    ...((asA ?? []).map((r: any) => r.user_b as string)),
    ...((asB ?? []).map((r: any) => r.user_a as string)),
  ];
  if (friendIds.length === 0) return 0;

  // Fetch push tokens for friends who have them
  const { data: friendProfiles } = await supabase
    .from('profiles')
    .select('push_token')
    .in('id', friendIds)
    .not('push_token', 'is', null);

  const tokens = (friendProfiles ?? [])
    .map((p: any) => p.push_token as string)
    .filter(Boolean);

  if (tokens.length === 0) return 0;

  // Send via Expo Push API (fire-and-forget — non-critical)
  const messages = tokens.map(token => ({
    to: token,
    title: `${senderName} just played ${gameLabel}`,
    body: `${league} · ${resultSummary}`,
    sound: 'default',
    data: { type: 'friend_result', gameLabel, league },
  }));

  try {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(messages),
    });
  } catch {
    // Push send failed — non-critical, swallow silently
  }

  return tokens.length;
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
