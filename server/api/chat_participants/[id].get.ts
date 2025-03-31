import type { Database } from "../../../types/database.types";
import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    
    const client = await serverSupabaseClient<Database>(event);
    const user = await serverSupabaseUser(event)

    
    const { data, error } = await client.from("chat_participants")
    .select(`*, profiles!chat_participant_friend_id_fkey(id, username, avatar_url)`)
    .eq('profile_id', user?.id ?? '')
    .order('created_at', { ascending: false })
    
    if(error) throw createError({ statusMessage: error.message });
    
    return { data }

  } catch (error) {
    if(error instanceof Error)
      sendError(event, createError({
        ...error,
        statusMessage: error.message,
      }))
  }
});