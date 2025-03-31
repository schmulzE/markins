import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "../../../types/database.types";

export default defineEventHandler(async (event) => {
  try {
   
    const body = await readBody(event);

    if (!body)
    throw createError({ statusCode: 400, statusMessage: "Bad Request" });

    const client = await serverSupabaseClient<Database>(event);

    const { error } = await client.from("post_tags").insert(body);

    if(error) {
      return createError({ statusMessage: error.message });
    }
    
    return { status: "OK" };

  } catch (error) {
    if(error instanceof Error)
      sendError(event, createError({
        ...error,
        statusMessage: error.message,
      }))
  }
});