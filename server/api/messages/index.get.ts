import type { Database } from "~/types/database.types";
import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const user = await serverSupabaseUser(event);
    const client = await serverSupabaseClient<Database>(event);

    if (!query.recipientId && !query.senderId) {
      throw createError({ statusCode: 400, statusMessage: "Bad Request" });
    }

    if (!user) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const recipientId = query.recipientId?.toString() ?? ''
    const senderId = query.senderId?.toString() ?? '' 
    
    const { data, error } = await client.from("direct_messages")
      .select(`*`)
      .eq('recipient_id', recipientId)
      .eq('sender_id', senderId)
      .order('created_at', { ascending: true })


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