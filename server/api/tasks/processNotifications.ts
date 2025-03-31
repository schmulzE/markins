import type { Database } from '~/types/database.types';
import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)

  while (true) {
    // Process notifications in batches
    const { data: notifications, error } = await client
      .from('notification_queue')
      .select('*')
      .limit(100)

    if (error) {
      console.error('Error fetching notifications:', error)
      continue
    }

    if (notifications.length === 0) {
      // No more notifications to process
      break
    }

    // Process notifications
    for (const notification of notifications) {
      await client.from('notifications').insert({
        profile_id: notification.profile_id,
        community_id: notification.community_id,
        post_id: notification.post_id,
        type: notification.type,
        message: notification.message
      })

      // Delete processed notification from queue
      await client
        .from('notification_queue')
        .delete()
        .match({ id: notification.id })
    }

    // Optional: add a small delay to prevent overloading the database
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  return { success: true }
})