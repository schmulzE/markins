import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "../../../types/database.types";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const body = await readBody(event)
    const { from, to } = query
  
    
    const client = await serverSupabaseClient<Database>(event);
    
    if(body.communityId) { 
      const { data, count } = await client.from("posts")
      .select(`
        *, 
        author:profiles!posts_author_id_fkey(*), 
        community:communities(*), 
        comments:comments!comments_post_id_fkey(*),
        votes:post_votes!votes_post_id_fkey(user_id, vote_type),
        bookmarks:bookmarks(*), post_flairs(flairs(*))`, { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .eq('community_id', body.communityId)
      .range(from as number, to as number)
      
      return { data, count }
    }
    

    const { data, error } = await client.from("posts")
    .insert(body)
    .select(`      
      *, 
      author:profiles!posts_author_id_fkey(*), 
      community:communities(*), 
      comments:comments!comments_post_id_fkey(*),
      votes(user_id, vote_type),
      bookmarks:bookmarks(*),
      post_flairs(flairs(*))
    `)
    .single();
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