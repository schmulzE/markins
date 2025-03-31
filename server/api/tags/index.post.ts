import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "../../../types/database.types";

export default defineEventHandler(async (event) => {
  try {
    
    const query = getQuery(event);
    const body = await readBody(event);
    const client = await serverSupabaseClient<Database>(event);

    const { from, to } = body
    const { sortBy } = query;
    

    let tagsQuery = client.from("tags")
    .select(`*, posts(*, profiles!posts_profile_id_fkey(*))`, { count: 'exact' })
    .range(from as number, to as number)

     // Sorting logic
     if (sortBy === 'popular') {
      tagsQuery = tagsQuery.order('title', { ascending: false });
    } else if (sortBy === 'name') {
      tagsQuery = tagsQuery.order('title', { ascending: true });
    }else {
      tagsQuery = tagsQuery.order('created_at', { ascending: false });
    }

    const { data, count, error } = await tagsQuery;
    if (error) sendError(event, createError({
      ...error,
      statusMessage: error.message,
    }));

    return { data, count };

  } catch (error) {
    if(error instanceof Error)
      sendError(event, createError({
        ...error,
        message: error.message,
      }))
  }
});
