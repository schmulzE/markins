import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/database.types";

export default defineEventHandler(async (event) => {
  try {
    
    const body = await readBody(event);
    const messageId = event.context.params?.id;
    
    const client = await serverSupabaseClient<Database>(event);
 
    const { content, recipient_id } = body;

    
    const { error } = await client.from("direct_messages").update({ content, recipient_id }).eq('id', messageId!).order('created_at', { ascending: false });
    if(error) throw createError({ statusMessage: error.message }) 

    return { status: 'OK' }
  
  } catch (error) {
    if(error instanceof Error)
      sendError(event, createError({
        ...error,
        statusMessage: error.message,
      }))
  }
});