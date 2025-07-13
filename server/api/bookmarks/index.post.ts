import type { Database } from "~/types/database.types";
import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    
    const client = await serverSupabaseClient<Database>(event);
    const user = await serverSupabaseUser(event)

    
    const { data, error } = await client
    .from('bookmarks')
    .select(`
      id,
      post:posts (
        id,
        title,
        content
      ),
      comment:comments (
        id,
        content,
        post:posts (
          id,
          title
        )
      )
    `)
    .eq('profile_id', user?.id ?? '')
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