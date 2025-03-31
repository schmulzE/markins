import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "../../../types/database.types";

export default defineEventHandler(async (event) => {
  try {  
    const postId = event.context.params!.id;

    if (!postId) throw createError({ statusCode: 400, statusMessage: "Bad Request" });

    const client = await serverSupabaseClient<Database>(event);

    const { error } = await client.from('post_tags').delete().eq('post_id', postId)

    if(error) {
      return createError({ statusMessage: error.message });
    }

    return {status: 'OK'}
  } catch (error) {
    if(error instanceof Error)
      sendError(event, createError({
        ...error,
        statusMessage: error.message,
      }))
  }
});