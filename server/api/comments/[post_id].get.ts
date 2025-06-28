import type { Database } from "~/types/database.types";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    
    const postId = event.context.params!.id;
    const sort = getQuery(event).sort || 'new';
    
    const client = await serverSupabaseClient<Database>(event);
    
    let query = client.from("comments")
    .select(`
      *,
      author:profiles!comments_author_id_fkey(*),
      comment_votes(user_id, vote_type),
      post:posts(author_id, community_id)
    `)
    .eq('post_id', postId!)

    if (sort === 'new') {
      query = query.order('created_at', { ascending: false });
    } else if (sort === 'top') {
      query = query.order('upvotes', { ascending: false }).order('created_at', { ascending: false });
    } else if (sort === 'best') {
      query = query.order('score', { ascending: false }).order('created_at', { ascending: false });
    }

    const { data: comments, error: commentsError } = await query;

    // 2. Get unique community IDs from the comments
    const communityIds = [...new Set(comments?.map(c => c.post?.community_id))];

    // 3. Fetch all moderators for these communities
    const { data: moderators } = await client
      .from('community_moderators')
      .select('user_id, community_id')
      .in('community_id', communityIds.filter((id): id is string | null => id !== undefined) as (string | null)[]);

    // 4. Enhance comments with moderator status
    const enhancedComments = comments?.map(comment => ({
      ...comment,
      is_moderator: moderators?.some(
        mod =>
          mod.user_id === comment.author_id &&
          String(mod.community_id) === String(comment.post?.community_id)
      ),
      is_op: comment.author_id === comment.post?.author_id,
    }))


    if(commentsError) throw createError({ statusMessage: commentsError.message }) 

    return { data: enhancedComments }
  
  } catch (error) {
    if(error instanceof Error)
      sendError(event, createError({
        ...error,
        statusMessage: error.message,
      }))
  }
});