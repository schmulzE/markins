import { serverSupabaseClient } from '#supabase/server';
import type { Database } from "@/types/database.types";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event);
  const { commentId, userId, voteType } = await readBody(event);
  
  // Check if user already voted
  const { data: existingVote } = await supabase
    .from('comment_votes')
    .select('*')
    .eq('comment_id', commentId)
    .eq('user_id', userId)
    .single();

  let voteValue = voteType;
  
  if (existingVote) {
    // If same vote type, remove vote (toggle)
    if (existingVote.vote_type === voteType) {
      await supabase
        .from('comment_votes')
        .delete()
        .eq('id', existingVote.id);
      voteValue = null;
    } else {
      // Update to opposite vote
      await supabase
        .from('comment_votes')
        .update({ vote_type: voteType })
        .eq('id', existingVote.id);
    }
  } else {
    // Create new vote
    await supabase
      .from('comment_votes')
      .insert({
        comment_id: commentId,
        user_id: userId,
        vote_type: voteType
      });
  }

  // Recalculate vote counts
  const { data: upvotes } = await supabase
    .from('comment_votes')
    .select('id', { count: 'exact' })
    .eq('comment_id', commentId)
    .eq('vote_type', 'up');

  const { data: downvotes } = await supabase
    .from('comment_votes')
    .select('id', { count: 'exact' })
    .eq('comment_id', commentId)
    .eq('vote_type', 'down');

  // Update comment with new counts
  const { error } = await supabase
    .from('comments')
    .update({
      upvotes: upvotes?.length || 0,
      downvotes: downvotes?.length || 0
    })
    .eq('id', commentId);

  if (error) throw createError({ statusMessage: error.message });

  return { 
    success: true,
    user_vote: voteValue,
    upvotes: upvotes?.length || 0,
    downvotes: downvotes?.length || 0
  };
});