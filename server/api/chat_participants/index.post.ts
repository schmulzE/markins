import type { Database } from "~/types/database.types";
import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const user = await serverSupabaseUser(event);
    const client = await serverSupabaseClient<Database>(event);

    const { chatIds } = body;
    //Get profiles of users with the same chat IDs, excluding current user
    const { data, error } = await client
    .from('chat_participants')
    .select(`
      chat_id,
      chats (
        id,
        messages (
          content,
          created_at
        )
      ),
      profiles:profile_id (
        id,
        username,
        avatar_url
      )
    `)
    .in('chat_id', chatIds) // Get participants in the same chats
    .neq('profile_id', user?.id ?? '') // Exclude current user's profile

    if(error) throw createError({ statusMessage: error.message });

    return { data };

  } catch (error) {
    if(error instanceof Error)
      sendError(event, createError({
        ...error,
        statusMessage: error.message,
      }))
  }
});