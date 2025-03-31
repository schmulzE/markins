import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "../../../types/database.types";

export default defineEventHandler(async (event) => {
  try {

    const id = event.context.params!.id;
    
    if (!id)
      throw createError({ statusCode: 400, statusMessage: "Bad Request"});

    const client = await serverSupabaseClient<Database>(event);

    const { data, error } = await client.from("tags").select(`*, posts(*, profiles!posts_profile_id_fkey(*), post_votes(*), post_bookmarks(*), comments(id, message, profile_id, post_id), post_tags(*), tags(*))`).eq("id", id);

    if(error) {
      throw createError({ statusMessage: error.message });
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