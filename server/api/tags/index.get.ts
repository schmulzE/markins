import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "../../../types/database.types";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const client = await serverSupabaseClient<Database>(event);
    
    let tagsQuery = client
      .from("tags")
      .select(`*, posts(*, profiles!posts_profile_id_fkey(*))`, { count: 'exact' });

    // Sorting logic
    if (query?.sortBy === 'popular') {
      tagsQuery = tagsQuery.order('title', { ascending: false });
    } else if (query?.sortBy === 'name') {
      tagsQuery = tagsQuery.order('title', { ascending: true });
    } else {
      tagsQuery = tagsQuery.order('created_at', { ascending: false });
    }

    // Apply range only if query parameters are present
    if (query?.from !== undefined && query?.to !== undefined) {
      tagsQuery = tagsQuery.range(Number(query.from), Number(query.to));
    }

    const { data, count, error } = await tagsQuery;
    
    if (error) {
      throw createError({
        statusCode: 500,
        message: `Database error: ${error.message}`
      });
    }
    
    return { data, count };
  } catch (error) {
    if (error instanceof Error) {
      throw createError({
        statusCode: 500,
        message: error.message
      });
    }
    throw error;
  }
});