import type { Database } from "~/types/database.types";
import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const profileId = event.context.params!.id;
    
    const user = await serverSupabaseUser(event);
    const client = await serverSupabaseClient<Database>(event);

    if (!user) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    if (!body) {
      throw createError({ statusCode: 400, statusMessage: "Bad Request" });
    }

    // Insert profile with user id
    const { error } = await client.from('profiles')
    .update(body)
    .eq('id', profileId);

    if (error) {
      throw createError({ statusMessage: error.message });
    }

    // Do not return the data
    return { success: true };

  } catch (error) {
    if (error instanceof Error)
      sendError(event, createError({
        ...error,
        statusMessage: error.message,
      }));
  }
});