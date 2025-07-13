import type { Database } from "~/types/database.types";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {

	const id = event.context.params!.id;

  if (!id) throw createError({ statusCode: 400, statusMessage: "Bad Request" });

  const client = await serverSupabaseClient<Database>(event);

  const { data } = await client.from("comments").delete().eq("id", id);

  return { post: data };
});