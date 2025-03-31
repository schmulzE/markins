import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "../../../types/database.types";

export default defineEventHandler(async (event) => {
  try {
  
    const chatId = getRouterParam(event, 'id')
    
    const client = await serverSupabaseClient<Database>(event);
    
    const { data, error } = await client.from("messages").select(`*`).eq('chat_id', chatId!).order('created_at', { ascending: false })
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