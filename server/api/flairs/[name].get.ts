import type { Database } from "~/types/database.types";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    const flairName = getRouterParam(event, 'name');
    const client = await serverSupabaseClient<Database>(event);

    const { data } = await client.from("flairs")
    .select('*')
    .eq('name', flairName!)
    .order('created_at', { ascending: false })
    .single()
    return { data }

  } catch (error) {
    if(error instanceof Error)
      sendError(event, createError({
        ...error,
        message: error.message,
      }))
  }
});