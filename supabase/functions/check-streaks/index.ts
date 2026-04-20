// Runs at 12pm UTC daily via cron
// Finds all users with streak > 0 who haven't played today
// Sends push notification via Expo Push API

import { createClient } from 'supabase'

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const today = new Date().toISOString().split('T')[0]

  // Get all users with streak > 0 who haven't played today AND have streak alerts enabled
  const { data: usersAtRisk } = await supabase
    .from('profiles')
    .select('id, push_token, streak, username, notify_streak_alert')
    .gt('streak', 0)
    .neq('push_token', null)
    .eq('notify_streak_alert', true)
    .or(`last_game_date.is.null,last_game_date.lt.${today}`)

  if (!usersAtRisk?.length) {
    return new Response(JSON.stringify({ sent: 0 }))
  }

  // Send push notifications via Expo Push API
  const messages = usersAtRisk.map(user => ({
    to: user.push_token,
    title: '🔥 Streak at Risk!',
    body: `Your ${user.streak}-day streak is in danger! You have 12 hours left to play.`,
    sound: 'default',
    badge: 1,
  }))

  // Batch send to Expo Push API (max 100 per request)
  const batches = []
  for (let i = 0; i < messages.length; i += 100) {
    batches.push(messages.slice(i, i + 100))
  }

  let totalSent = 0
  for (const batch of batches) {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batch)
    })
    if (response.ok) totalSent += batch.length
  }

  // Update streak_at_risk flag for these users
  const userIds = usersAtRisk.map(u => u.id)
  await supabase.from('profiles').update({ streak_at_risk: true }).in('id', userIds)

  return new Response(JSON.stringify({ sent: totalSent, usersAtRisk: usersAtRisk.length }))
})
