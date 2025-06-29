import type { Database } from '~/types/database.types';
import { serverSupabaseClient } from '#supabase/server';
import type { Community, Post, Profile } from '~/types/utility';

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event);
  const query = getQuery(event);

  const searchTerm = query.q?.toString() || ''
  const type = query.type?.toString() || 'all' // 'post', 'user', 'community', or 'all'
  const sortBy = query.sort?.toString() || 'relevance' // 'relevance', 'top', 'new'
  const timeFilter = query.time?.toString() || 'all' // 'all', 'day', 'week', 'month', 'year'
  const limit = Math.min(parseInt(query.limit?.toString() || '10'), 20)

  const results: {
    posts: Post[],
    communities: Community[],
    users: Profile[]
  } = {
    posts: [],
    communities: [],
    users: []
  }

  if (!searchTerm.trim()) return results

  const timeConstraint = getTimeConstraint(timeFilter)

  // --- Posts ---
  if (type === 'all' || type === 'post') {
    let queryBuilder = supabase
      .from('posts')
      .select(`
        id,
        title,
        content,
        upvotes,
        created_at,
        author:profiles(id, username, avatar_url),
        community:communities(id, name, icon)
      `)

    // Apply time filter
    if (timeConstraint) {
      queryBuilder = queryBuilder.gte('created_at', timeConstraint)
    }

    // Search
    queryBuilder = queryBuilder.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)

    // Sort
    if (sortBy === 'top') {
      queryBuilder = queryBuilder.order('upvotes', { ascending: false })
    } else if (sortBy === 'new') {
      queryBuilder = queryBuilder.order('created_at', { ascending: false })
    }

    const { data: posts } = await queryBuilder.limit(limit)
    results.posts = (posts as unknown as Post[]) || []
  }

  // --- Communities ---
  if (type === 'all' || type === 'community') {
    const { data: communities } = await supabase
      .from('communities')
      .select(`id, name, display_name, description, icon, member_count`)
      .or(`name.ilike.%${searchTerm}%,display_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .limit(limit)

    results.communities = (communities as Community[]) || []
  }

  // --- Users ---
  if (type === 'all' || type === 'user') {
    const { data: users } = await supabase
      .from('profiles')
      .select(`id, username, display_name, avatar_url`)
      .or(`username.ilike.%${searchTerm}%,display_name.ilike.%${searchTerm}%`)
      .limit(limit)

    results.users = (users as Profile[]) || [] 
  }

  return results
})

// Utility function for time filtering
function getTimeConstraint(range: string): string | null {
  const now = new Date()
  const getPastDate = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString()

  switch (range) {
    case 'day': return getPastDate(1)
    case 'week': return getPastDate(7)
    case 'month': return getPastDate(30)
    case 'year': return getPastDate(365)
    default: return null
  }
}