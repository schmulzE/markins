import type { Database } from "~/types/database.types";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {

    const tagName = getRouterParam(event, 'tagname')
    const query = getQuery(event);

    const { page = 1, itemsPerPage = 10 } = query;


    if (!tagName)
      throw createError({ statusCode: 400, statusMessage: "Bad Request"});

    const client = await serverSupabaseClient<Database>(event);

    const { data, error } = await client
    .from("tags")
    .select(`posts(*, profiles!posts_profile_id_fkey(*))`)
    .range((Number(page) - 1) * Number(itemsPerPage), Number(page) * Number(itemsPerPage) - 1)
    .order('created_at', { ascending: true})
    .eq("title", tagName)

    if(error) {
      throw createError({ statusMessage: error.message });
    }
      
    return data;

  } catch (error) {
    if(error instanceof Error)
      sendError(event, createError({
        ...error,
        statusMessage: error.message,
      }))
  }
  });