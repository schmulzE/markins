import type { Database } from "../../../types/database.types";
import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    
    const user = await serverSupabaseUser(event);
    const client = await serverSupabaseClient<Database>(event);

    
    const { data, error } = await client.from("messages").select(`*`).eq('sender_id', user?.id ?? '')
    if(error) throw createError({ statusMessage: error.message }) 

    return { data }
  
  } catch (error) {
    if(error instanceof Error)
      sendError(event, createError({
        ...error,
        statusMessage: error.message,
      }))
  }
});