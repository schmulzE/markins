import type { Database } from "~/types/database.types";
import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {  
    const user = await serverSupabaseUser(event);
    const client = await serverSupabaseClient<Database>(event);

    if (!user) {
      throw createError({ message: 'You must be logged in to get your profile' });
    }

    const { data, error } = await client
    .from('profiles')
    .select(`*, community_members(user_id)`)
    .eq('id', user!.id)
    .maybeSingle()

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