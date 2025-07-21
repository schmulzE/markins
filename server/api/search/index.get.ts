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

  // Parse advanced search syntax
  const parsedSearch = parseAdvancedSearch(searchTerm)
  
  if (!parsedSearch.searchTerm.trim() && !parsedSearch.filters.length) return results

  const timeConstraint = getTimeConstraint(timeFilter)

  // --- Posts ---
  if (type === 'all' || type === 'post' || parsedSearch.filters.includes('type:post')) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let queryBuilder: any

    // Handle bookmarked posts differently
    if (parsedSearch.filters.includes('bookmarked:true')) {
      const user = await supabase.auth.getUser()
      if (user.data.user) {
        queryBuilder = supabase
          .from('posts')
          .select(`
            id,
            title,
            content,
            upvotes,
            created_at,
            author:profiles(id, username, avatar_url),
            community:communities(id, name, icon),
            bookmarks!inner(user_id)
          `)
          .eq('bookmarks.user_id', user.data.user.id)
      }
    } else {
      queryBuilder = supabase
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

      // Apply author filter
      if (parsedSearch.filters.includes('author:me')) {
        const user = await supabase.auth.getUser()
        if (user.data.user) {
          queryBuilder = queryBuilder.eq('author_id', user.data.user.id)
        }
      }

      // Search in title and content if there's a search term
      if (parsedSearch.searchTerm.trim()) {
        queryBuilder = queryBuilder.or(`title.ilike.%${parsedSearch.searchTerm}%,content.ilike.%${parsedSearch.searchTerm}%`)
      }

      // Sort
      const effectiveSortBy = parsedSearch.filters.includes('sort:top') ? 'top' : 
                             parsedSearch.filters.includes('sort:new') ? 'new' : 
                             sortBy
      
      if (effectiveSortBy === 'top') {
        queryBuilder = queryBuilder.order('upvotes', { ascending: false })
      } else if (effectiveSortBy === 'new') {
        queryBuilder = queryBuilder.order('created_at', { ascending: false })
      }
    }

    const { data: posts } = await queryBuilder.limit(limit)
    results.posts = (posts as unknown as Post[]) || []
  }

  // --- Communities ---
  if (type === 'all' || type === 'community' || parsedSearch.filters.includes('type:community')) {
    let queryBuilder = supabase
      .from('communities')
      .select(`id, name, display_name, description, icon, member_count`)

    // Search in name, display_name, and description if there's a search term
    if (parsedSearch.searchTerm.trim()) {
      queryBuilder = queryBuilder.or(`name.ilike.%${parsedSearch.searchTerm}%,display_name.ilike.%${parsedSearch.searchTerm}%,description.ilike.%${parsedSearch.searchTerm}%`)
    }

    const { data: communities } = await queryBuilder.limit(limit)
    results.communities = (communities as unknown as Community[]) || []
  }

  // --- Users ---
  if (type === 'all' || type === 'user' || parsedSearch.filters.includes('type:user')) {
    let queryBuilder = supabase
      .from('profiles')
      .select(`id, username, display_name, avatar_url`)

    // Search in username and display_name if there's a search term
    if (parsedSearch.searchTerm.trim()) {
      queryBuilder = queryBuilder.or(`username.ilike.%${parsedSearch.searchTerm}%,display_name.ilike.%${parsedSearch.searchTerm}%`)
    }

    const { data: users } = await queryBuilder.limit(limit)
    results.users = (users as Profile[]) || [] 
  }

  return results
})

// Parse advanced search syntax
function parseAdvancedSearch(searchTerm: string): { searchTerm: string, filters: string[] } {
  const filters: string[] = []
  let cleanSearchTerm = searchTerm

  // Extract filters from search term
  const filterPatterns = [
    /type:(post|user|community)/g,
    /sort:(top|new|relevance)/g,
    /author:me/g,
    /bookmarked:true/g
  ]

  filterPatterns.forEach(pattern => {
    const matches = searchTerm.match(pattern)
    if (matches) {
      filters.push(...matches)
      // Remove filters from search term
      cleanSearchTerm = cleanSearchTerm.replace(pattern, '').trim()
    }
  })

  return {
    searchTerm: cleanSearchTerm,
    filters
  }
}

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