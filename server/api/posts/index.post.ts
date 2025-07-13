import type { Database } from "~/types/database.types";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body)
    throw createError({ statusCode: 400, statusMessage: "Bad Request" });

  const client = await serverSupabaseClient<Database>(event);

  const { data, error } = await client.from("posts")
  .insert(body)
  .select(`      
    *, 
    author:profiles!posts_author_id_fkey(*), 
    community:communities(*), 
    comments:comments!comments_post_id_fkey(*),
    votes:post_votes!votes_post_id_fkey(user_id, vote_type),
    bookmarks:bookmarks(*),
    post_flairs(flairs(*))
  `)
  .single();
  
  if(error) {
    throw createError({ statusMessage: error.message })
  }
  return { post: data };
});