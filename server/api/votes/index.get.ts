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
      if (vote.target_type === 'post') {
        const { data, error } = await client
          .from('posts')
          .select('*, bookmarks(*), comments(*), profiles(*)')
          .eq('id', vote.target_id)
          .single()
        
        if (error) {
          throw new Error(`Error fetching post: ${error.message}`)
        }
        
        return { ...data }
      } else {
        const { data, error } = await client
          .from('comments')
          .select('id, content, post_id')
          .eq('id', vote.target_id)
          .single()
        
        if (error) {
          throw new Error(`Error fetching comment: ${error.message}`)
        }
        
        return { ...vote, content: data.content, postId: data.post_id, commentId: data.id }
      }
    })

    const resolvedVotes = await Promise.all(contentPromises)
    const votes = resolvedVotes.filter(vote => vote !== null)

    return { votes }
  } catch(error) {
    if(error instanceof Error)
      sendError(event, createError({
        ...error,
        statusMessage: error.message,
      }))
  }
})