import { serverSupabaseClient } from '#supabase/server';
import type { Database } from "@/types/database.types";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event);
  const { post } = await readBody(event);
  
  const score = post.upvotes - post.downvotes
  const secondsSince = (Date.now() - new Date(post.created_at).getTime()) / 1000
  const order = Math.log10(Math.max(Math.abs(score), 1))
  const sign = score > 0 ? 1 : score < 0 ? -1 : 0
  const hotScore = Number((order + sign * secondsSince / 45000).toFixed(7))

  const { error } = await supabase
    .from('posts')
    .update({ hot_score: hotScore })
    .eq('id', post.id)

  if (error) throw createError({ statusMessage: error.message })
  
  return { success: true }
})