import type { Database } from "~/types/database.types";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {  

    const body = await readBody(event);

    if (!body)
      throw createError({ statusCode: 400, statusMessage: "Bad Request" });

    const client = await serverSupabaseClient<Database>(event);
    
    const { data, error } = await client.from('profiles').upsert(body).select('*')
    
    if (error) {
      throw createError({ statusMessage: error.message });
    }

    return { data };
    
  } catch (error) {
    if(error instanceof Error)
      sendError(event, createError({
        ...error,
        statusMessage: error.message,
      }))
  }
});