import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "../../../types/database.types";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = event.context.params!.id;

  try {
    if (!body)
    throw createError({ statusCode: 400, statusMessage: "Bad Request" });
  
    const client = await serverSupabaseClient<Database>(event);

    const { title, content, image_url } = body;

    const { data, error } = await client.from("posts").update({ title, content, image_url }).eq("id", id).select()

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