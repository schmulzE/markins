import type { Database } from "~/types/database.types";
import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {  

    const body = await readBody(event);

    if (!body)
      throw createError({ statusCode: 400, statusMessage: "Bad Request" });

    const client = await serverSupabaseClient<Database>(event);
    const user = await serverSupabaseUser(event);
    
    const { data, error } = await client.from('profiles').update(body).eq('id', user!.id).select('*').single()
    
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