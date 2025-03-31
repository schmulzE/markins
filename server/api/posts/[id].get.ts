import type { Database } from "@/types/database.types";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) throw createError({ statusCode: 400, statusMessage: "Bad Request" });

    const client = await serverSupabaseClient<Database>(event);
    
    const { data, error } = await client.from("posts")
    .select(`*, profiles!posts_profile_id_fkey(*), comments(id, content, profile_id, post_id), post_tags(*), tags(*)`)
    .eq("id", id)
    .single()

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