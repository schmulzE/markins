import type { Database } from "~/types/database.types";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body)
    throw createError({ statusCode: 400, statusMessage: "Bad Request" });

  const client = await serverSupabaseClient<Database>(event);

  const { error } = await client.from("post_flairs").insert(body);

  if (error) {
    throw createError({ statusMessage: error.message });
  }

  return { success: true };
});
