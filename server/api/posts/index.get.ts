import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "../../../types/database.types";

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event);

    const { data } = await client.from("posts")
    .select(`*, profiles!posts_profile_id_fkey(*), comments(id, content, profile_id, post_id), post_tags(*), tags(*)`)
    .order('created_at', { ascending: false })

    return data

  } catch (error) {
    if(error instanceof Error)
      sendError(event, createError({
        ...error,
        message: error.message,
      }))
  }
});