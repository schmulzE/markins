import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "../../../types/database.types";

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event);

    const { data } = await client.from("posts")
    .select(`      
      *, 
      author:profiles!posts_author_id_fkey(*), 
      community:communities(*), 
      comments:comments!comments_post_id_fkey(*),
      votes:post_votes!votes_post_id_fkey(user_id, vote_type),
      bookmarks:bookmarks(*),
      post_flairs(flairs(*))
    `)
    .order('created_at', { ascending: false })

    return { data }

  } catch (error) {
    if(error instanceof Error)
      sendError(event, createError({
        ...error,
        message: error.message,
      }))
  }
});