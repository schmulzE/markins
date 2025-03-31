import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "../../../types/database.types";

export default defineEventHandler(async (event) => {
  try {  
    const id = event.context.params!.id;
    const body = await readBody(event);

    if (!id) throw createError({ statusCode: 400, statusMessage: "Bad Request" });

    const client = await serverSupabaseClient<Database>(event);

    const { error } = await client.from('posts').delete().eq('id', id)

    if(error) {
      return createError({ statusMessage: error.message });
    }

    const { imagePath } = body

    const { error: imagesError } = await client.storage.from('images').remove([`${imagePath}`])

    if(imagesError) {
      return createError({ statusMessage: imagesError.message });
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