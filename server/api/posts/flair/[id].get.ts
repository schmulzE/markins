import type { H3Event } from 'h3';
import type { Database } from '~/types/database.types';
import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event: H3Event) => {
  const flairId = event.context.params?.id;
  const sort = getQuery(event).sort as string | undefined;
  const client = await serverSupabaseClient<Database>(event);

  if (!flairId) {
    return { error: 'Missing flairId' };
  }

  // Step 1: Get all post IDs for this flair from the join table
  const { data: postFlairs, error: pfError } = await client
    .from('post_flairs')
    .select('post_id')
    .eq('flair_id', flairId);

  if (pfError) {
    return { error: pfError.message };
  }

  const postIds = (postFlairs ?? []).map((pf: { post_id: string }) => pf.post_id);
  if (!postIds.length) {
    return { data: [] };
  }

  // Step 2: Query posts with those IDs
  let query = client
    .from('posts')
    .select('*')
    .in('id', postIds);

  // Sorting logic
  switch (sort) {
    case 'new':
      query = query.order('created_at', { ascending: false });
      break;
    case 'top':
      query = query.order('upvotes', { ascending: false });
      break;
    case 'comments':
      query = query.order('comments_count', { ascending: false });
      break;
    case 'hot':
    default:
      query = query.order('hot_score', { ascending: false });
      break;
  }

  const { data, error } = await query;

  if (error) {
    return { error: error.message };
  }

  return { data };
});