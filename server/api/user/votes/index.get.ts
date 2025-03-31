import type { Database, Tables } from '~/types/database.types'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const client = await serverSupabaseClient<Database>(event)

  if (!user) {
    return { error: 'User not authenticated' }
  }

  try {
    const { data: votesData, error: votesError } = await client
      .from('votes')
      .select('*')
      .eq('profile_id', user.id)

    if (votesError) {
      throw new Error(`Error fetching user votes: ${votesError.message}`)
    }

    const contentPromises = votesData.map(async (vote: Tables<'votes'>) => {
      // Base object with common vote properties including vote_type
      const baseVote = {
        ...vote,
        vote_type: vote.vote_type // Ensure vote_type is preserved
      }

      if (vote.target_type === 'post') {
        const { data, error } = await client
          .from('posts')
          .select('*, bookmarks(*), comments(*), profiles(*), tags(*)')
          .eq('id', vote.target_id)
          .single()
        
        if (error) {
          throw new Error(`Error fetching post: ${error.message}`)
        }
        
        return { 
          ...baseVote,
          content: data,
          post_id: data.id // Adding post_id for consistency
        }
      } else {
        const { data, error } = await client
          .from('comments')
          .select('*, profiles(*)')
          .eq('id', vote.target_id)
          .single()
        
        if (error) {
          throw new Error(`Error fetching comment: ${error.message}`)
        }
        
        return { 
          ...baseVote,
          content: data,
          post_id: data.post_id, // The post this comment belongs to
          comment_id: data.id    // The comment's own ID
        }
      }
    })

    const resolvedVotes = await Promise.all(contentPromises)
    const votes = resolvedVotes.filter(vote => vote !== null)

    return { 
      votes,
      // Optional: Add summary counts
      counts: {
        upvotes: votes.filter(v => v.vote_type === 1).length,
        downvotes: votes.filter(v => v.vote_type === -1).length
      }
    }
  } catch(error) {
    if(error instanceof Error)
      sendError(event, createError({
        ...error,
        statusMessage: error.message,
      }))
  }
})