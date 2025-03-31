import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "../../../types/database.types";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    // const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { from, to } = query
  
    
    const client = await serverSupabaseClient<Database>(event);
    
    if(body.communityId) { 
      const { data, count } = await client.from("posts")
      .select(`*, profiles!posts_profile_id_fkey(*), votes(*), bookmarks(*), comments(id, content, profile_id, post_id), post_tags(*), tags(*)`, { count: 'exact' })
      .order('created_at', { ascending: false })
      .eq('community_id', body.communityId)
      .range(from as number, to as number)
      
      return { data, count }
    }
    

    const { data, error } = await client.from("posts")
    .insert(body)
    .select(`*, profiles!posts_profile_id_fkey(*), votes(*), bookmarks(*), comments(id, content, profile_id, post_id), tags(*)`)
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