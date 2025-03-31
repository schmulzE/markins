import type { Database } from "@/types/database.types";
import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const body = await readBody(event)

  const { profile_id, target_id, target_type, vote_type } = body

  const { data, error } = await client
    .from('votes')
    .upsert(
      { profile_id, target_id, target_type, vote_type },
      { onConflict: 'profile_id, target_id, target_type' }
    )

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    })
  }

  return { success: true, data }
})