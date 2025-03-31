import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "../../../types/database.types";

export default defineEventHandler(async (event) => {
  try {  
    const client = await serverSupabaseClient<Database>(event);
    const username = event.context.params!.username;
    
    const { data, error } = await client.from('profiles')
    .select(`*, posts!posts_profile_id_fkey(*, tags(*), comments(id, content, profile_id, post_id), bookmarks(*), post_tags(*)), comments!comments_profile_id_fkey(*, profiles(*))`)
    .eq('username', username)
    .maybeSingle()

    if (error) {
      throw createError({ message: error.message})
    }
    return data ;

  } catch (error) {
    if(error instanceof Error)
      sendError(event, createError({
        ...error,
        statusMessage: error.message,
      }))
  }
});