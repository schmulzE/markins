import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "../../../types/database.types";

export default defineEventHandler(async (event) => {
  try {
    const postId = event.context.params!.id;
    const body: never = await readBody(event);

    if (!body)
      throw createError({ statusCode: 400, statusMessage: "Bad Request" });

    const client = await serverSupabaseClient<Database>(event);

    const { error } = await client.from("post_tags").upsert(body).eq('post_id', postId);

    if(error) {
      return createError({ statusMessage: error.message });
    }
    return { statusMessage: 'OK' };

  } catch (error) {
     if(error instanceof Error)
      sendError(event, createError({
        ...error,
        statusMessage: error.message,
      }))
  }
});