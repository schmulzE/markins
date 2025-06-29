import { useSupabaseClient, useSupabaseUser } from '#imports'

export const useCommunityMembership = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const joinCommunity = async (communityId: string) => {
    if (!user.value) throw new Error('Not authenticated')
    await supabase.from('community_members').insert({
      user_id: user.value.id,
      community_id: communityId,
      joined_at: new Date().toISOString(),
      is_approved: true
    })
  }

  const leaveCommunity = async (communityId: string) => {
    if (!user.value) throw new Error('Not authenticated')
    await supabase
      .from('community_members')
      .delete()
      .eq('user_id', user.value.id)
      .eq('community_id', communityId)
  }

  return { joinCommunity, leaveCommunity }
}
