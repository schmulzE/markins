import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "../../../types/database.types";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body)
    throw createError({ statusCode: 400, statusMessage: "Bad Request" });

  const client = await serverSupabaseClient<Database>(event);

  const { data, error } = await client.from("posts")
  .insert(body)
  .select(`*, profiles!posts_profile_id_fkey(*), comments(id, content, profile_id, post_id), tags(*)`)
  .single();
  
  if(error) {
    throw createError({ statusMessage: error.message })
  }
  return { post: data };
});