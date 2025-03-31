import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "../../../types/database.types";

export default defineEventHandler(async (event) => {

	const id = event.context.params!.id;

  if (!id) throw createError({ statusCode: 400, statusMessage: "Bad Request" });

  const client = await serverSupabaseClient<Database>(event);

  const { data } = await client.from("comments").delete().eq("id", id);

    // const { error: imagesError } = await client
    // .storage
    // .from('images')
    // .remove([`${}`])
    
    // if(imagesError) console.log(imagesError)

  return { post: data };
});