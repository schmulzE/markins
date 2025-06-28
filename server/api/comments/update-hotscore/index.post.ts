import { serverSupabaseClient } from '#supabase/server';
import type { Database } from "@/types/database.types";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event);
  const { comment } = await readBody(event);
  
  const score = comment.upvotes - comment.downvotes;
  const secondsSince = (Date.now() - new Date(comment.created_at).getTime()) / 1000;
  const order = Math.log10(Math.max(Math.abs(score), 1));
  const sign = score > 0 ? 1 : score < 0 ? -1 : 0;
  const hotScore = Number((order + sign * secondsSince / 45000).toFixed(7));

  const { error } = await supabase
    .from('comments')
    .update({ score: hotScore })
    .eq('id', comment.id)

  if (error) throw createError({ statusMessage: error.message })
  
  return { success: true }
})