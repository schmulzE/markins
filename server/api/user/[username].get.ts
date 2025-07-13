import type { Database } from "~/types/database.types";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {  
    const client = await serverSupabaseClient<Database>(event);
    const username = event.context.params?.username || event.req.url?.split('/').pop();
    
    const { data, error } = await client.from('profiles')
      .select(`
        *,
        posts!posts_author_id_fkey(*, community:communities(name, icon)),
        comments!comments_author_id_fkey(
          *,
          post:post_id(title, community:communities(name))
        ),
        bookmarks!bookmarks_profile_id_fkey(
          *,
          post:post_id(*, community:communities(name, icon))
        )
      `)
      .eq('username', username!)
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