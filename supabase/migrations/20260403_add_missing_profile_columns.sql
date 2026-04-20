-- Add columns referenced in app code but missing from schema
-- push_token: stores the user's Expo push notification token (src/lib/notifications.ts line 45)
-- last_play_hour: tracks the hour of last play for notification scheduling (src/lib/notifications.ts line 77)

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS push_token text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_play_hour integer;
