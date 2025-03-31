import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "../../../types/database.types";

export default defineEventHandler(async (event) => {
  try {
  
    const body = await readBody(event);
    
    if (!body)
    throw createError({ statusCode: 400, statusMessage: "Bad Request" });

    const client = await serverSupabaseClient<Database>(event);

    const { data, error } = await client.from("comments").upsert(body).select()

    if(error) {
      sendError(event, createError({
        ...error,
        statusMessage: error.message,
      }))
    }

    return { data };
  } catch (error) {
    if(error instanceof Error)
      sendError(event, createError({
        ...error,
        statusMessage: error.message,
      }))
  }
});