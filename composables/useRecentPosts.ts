import type { Database } from "~/types/database.types"

export const getRecentPostsFromCommunities = async (communityIds: string[], limit: number = 5) => {
  const supabase = useSupabaseClient<Database>()

  try {

    const { data: recentPosts, error } = await supabase
      .rpc('get_recent_posts_per_community', { 
        community_ids: communityIds,
        posts_limit: limit 
      })

    if (error) throw error

    return { recentPosts, error: null }
  } catch (error) {
    return { recentPosts: null, error }
  }
}