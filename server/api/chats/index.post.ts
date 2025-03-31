import type { Database } from "~/types/database.types";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    // const body = await readBody(event);
    
    // const user = await serverSupabaseUser(event);
    const client = await serverSupabaseClient<Database>(event);

    // const { userId } = body
    
    // const { data, error } = await client.from("chat_participants")
    // // .insert({chat_id: user?.id ?? "", profile_id: userId})
    // .select(`*, profiles!chat_participation_friend_id_fkey(id, username, avatar_url)`)
    // .order('created_at', { ascending: false });
    
    const { data, error } = await client
    .from('chats')
    .insert({})
    .select()
    .maybeSingle()
    
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