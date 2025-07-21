import type { Database } from "~/types/database.types";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    const client = await serverSupabaseClient<Database>(event);
    
    const { data, error } = await client.from("direct_messages").insert(body).select().single()
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