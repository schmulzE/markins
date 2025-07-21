import type { Database } from "~/types/database.types";
import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    const communityId = event.context.params!.id;
    const user = await serverSupabaseUser(event);
    const client = await serverSupabaseClient<Database>(event);

    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
    }

    const { data } = await client
    .from('community_members')
    .select('*')
    .eq('user_id', user?.id ?? '')
    .eq('community_id', communityId!)
    .single();

    return { data }

  } catch (error) {
    if(error instanceof Error)
      sendError(event, createError({
        ...error,
        message: error.message,
      }))
  }
});