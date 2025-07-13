import type { Database } from "~/types/database.types";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = event.context.params!.id;
  const client = await serverSupabaseClient<Database>(event);

  try {
    if (!body)
    throw createError({ statusCode: 400, statusMessage: "Bad Request" });
  
    if (!id)
      throw createError({ statusCode: 400, statusMessage: "Post ID is required" });

    const { data, error } = await client.from("posts").update(body).eq("id", id).select()

    if (error) {
      throw createError({ statusMessage: error.message })
    }
    
    return { post : data };

  } catch (error) {
    if(error instanceof Error)
      sendError(event, createError({
        ...error,
        statusMessage: error.message,
      }))
  }
});