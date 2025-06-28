import type { Database } from "~/types/database.types";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {

    const client = await serverSupabaseClient<Database>(event);

    // Fetch the community
    const { data, error } = await client
      .from("communities")
      .select(`
        *,
        community_members(user_id),
        posts_today:posts!inner(
          count
        )
      `)
        .order('created_at', { ascending: false })

    if (error) throw createError({ statusMessage: error.message });
  

    return { data };

  } catch (error) {
    if (error instanceof Error)
      sendError(event, createError({
        ...error,
        statusMessage: error.message,
      }))
  }
});