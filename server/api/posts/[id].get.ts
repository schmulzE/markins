import type { Database } from "@/types/database.types";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    const postId = getRouterParam(event, 'id')

    if (!postId) throw createError({ statusCode: 400, statusMessage: "Bad Request" });

    const client = await serverSupabaseClient<Database>(event);
    
    const { data : post, error } = await client.from("posts")
    .select(`
      *,
      author:profiles!posts_author_id_fkey(*), 
      community:communities(*, community_members(*)),
      comments:comments!comments_post_id_fkey(*),
      votes:post_votes(user_id, vote_type),
      bookmarks:bookmarks(*),
      post_flairs(flairs(*))
    `)
    .eq("id", postId)
    .single()

    if(error) throw createError({ statusMessage: error.message });
    
    return { data : post }
  
  } catch (error) {
    if(error instanceof Error)
      sendError(event, createError({
        ...error,
        statusMessage: error.message,
      }))
  }
});