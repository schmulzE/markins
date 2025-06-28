import { serverSupabaseClient } from '#supabase/server';
import type { Database } from "@/types/database.types";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event);
  const { postId, userId, voteType } = await readBody(event);
  
  // Check if user already voted
  const { data: existingVote } = await supabase
    .from('post_votes')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  let voteValue = voteType;
  
  if (existingVote) {
    // If same vote type, remove vote (toggle)
    if (existingVote.vote_type === voteType) {
      if (existingVote.id !== null) {
        await supabase
          .from('post_votes')
          .delete()
          .eq('id', existingVote.id);
      }
      voteValue = null;
    } else {
      // Update to opposite vote
      if (existingVote.id === null) {
        throw createError({ statusMessage: "Vote ID is null" });
      }
      await supabase
        .from('post_votes')
        .update({ vote_type: voteType })
        .eq('id', existingVote.id);
    }
  } else {
    // Create new vote
    await supabase
      .from('post_votes')
      .insert({
        post_id: postId,
        user_id: userId,
        vote_type: voteType
      });
  }

  // Recalculate vote counts
  const { data: upvotes } = await supabase
    .from('post_votes')
    .select('id', { count: 'exact' })
    .eq('post_id', postId)
    .eq('vote_type', 'up');

  const { data: downvotes } = await supabase
    .from('post_votes')
    .select('id', { count: 'exact' })
    .eq('post_id', postId)
    .eq('vote_type', 'down');

  // Update post with new counts
  const { error } = await supabase
    .from('posts')
    .update({
      upvotes: upvotes?.length || 0,
      downvotes: downvotes?.length || 0
    })
    .eq('id', postId);

  if (error) throw createError({ statusMessage: error.message });

  return { 
    success: true,
    user_vote: voteValue,
    upvotes: upvotes?.length || 0,
    downvotes: downvotes?.length || 0
  };
});