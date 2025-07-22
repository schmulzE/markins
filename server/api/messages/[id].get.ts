import type { Database } from "~/types/database.types";
import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
  
    const recipientId = getRouterParam(event, 'id')
    
    const user = await serverSupabaseUser(event);
    const client = await serverSupabaseClient<Database>(event);

    if(!user) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }
    
    const { data, error } = await client.from("direct_messages")
    .select(`*`)
    .eq('recipient_id', recipientId!)
    .eq('sender_id', user.id)
    .order('created_at', { ascending: false });
    
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