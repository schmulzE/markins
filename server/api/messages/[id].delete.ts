import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "../../../types/database.types";

export default defineEventHandler(async (event) => {
  try {
    
    const id = event.context.params!.id;
    
    const client = await serverSupabaseClient<Database>(event);
    
    const { error } = await client.from("messages").delete().eq("id", id);

    if(error) throw createError({ statusMessage: error.message }) 

    return { status : "OK" }
  
  } catch (error) {
    if(error instanceof Error)
      sendError(event, createError({
        ...error,
        statusMessage: error.message,
      }))
  }
});