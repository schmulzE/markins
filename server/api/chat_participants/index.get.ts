import type { Database } from "~/types/database.types";
import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    const user = await serverSupabaseUser(event);
    const client = await serverSupabaseClient<Database>(event);

    const { data, error } = await client
    .from('chat_participants')
    .select('chat_id')
    .eq('profile_id', user?.id ?? '') // Get chats where current user is a participant
  
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