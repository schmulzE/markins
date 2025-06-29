import type { Database } from "~/types/database.types";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    const sort = getQuery(event).sort || 'new';

    const client = await serverSupabaseClient<Database>(event);

    // Fetch the posts
    let postsQuery = client
      .from("posts")
      .select(`
        *,
        author:profiles!posts_author_id_fkey(*), 
        community:communities(*), 
        comments:comments!comments_post_id_fkey(*),
        votes(user_id, vote_type),
        bookmarks:bookmarks(*)
      `)
      .eq("community_id", id!);

    if (sort === 'new') {
      postsQuery = postsQuery.order('created_at', { ascending: false });
    } else if (sort === 'top') {
      postsQuery = postsQuery.order('upvotes', { ascending: false }).order('created_at', { ascending: false });
    } else if (sort === 'hot') {
      postsQuery = postsQuery.order('hot_score', { ascending: false }).order('created_at', { ascending: false });
    }

    const { data: posts, error: postsError } = await postsQuery;
    if (postsError) throw createError({ statusMessage: postsError.message });

    return { data: posts };


  } catch (error) {
    if (error instanceof Error)
      sendError(event, createError({
        ...error,
        statusMessage: error.message,
      }))
  }
});