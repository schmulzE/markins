import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "../../../../types/database.types";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const client = await serverSupabaseClient<Database>(event);

    const { username } =  body;
    
    const { data, error } = await client.from('profiles')
    .select('*')
    .eq('username', username)
    .single()

    if (error) {
      throw createError({ message: error.message})
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