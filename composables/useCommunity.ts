import type { Post } from '~/types/utility';
import { ref, onMounted, onUnmounted } from 'vue';
import { useSupabaseClient, useSupabaseUser } from '#imports';

export const useCommunity = (communityId: string) => {
  const user = useSupabaseUser();
  const supabase = useSupabaseClient();

  // STATE
  const isJoined = ref(false);
  const memberCount = ref(0);
  const onlineCount = ref(0);
  const posts = ref<Post[]>([]);
  const isLoadingPosts = ref(false);
  const pingInterval = ref<NodeJS.Timeout>();

  // Check Membership
  const checkMembership = async () => {
    if (!user.value) return
    const { data } = await supabase
      .from('community_members')
      .select('id')
      .eq('user_id', user.value.id)
      .eq('community_id', communityId)
      .maybeSingle()

    isJoined.value = !!data
  }

  // Join Community
  const joinCommunity = async () => {
    if (!user.value) return
    await supabase.from('community_members').insert({
      user_id: user.value.id,
      community_id: communityId,
      joined_at: new Date().toISOString(),
      is_approved: true
    })
    isJoined.value = true
    fetchMemberCount()
  }

  // Leave Community
  const leaveCommunity = async () => {
    if (!user.value) return
    await supabase
      .from('community_members')
      .delete()
      .eq('user_id', user.value.id)
      .eq('community_id', communityId)

    isJoined.value = false
    fetchMemberCount()
  }

  // Fetch Recent Posts
  const fetchPosts = async () => {
    isLoadingPosts.value = true
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('community_id', communityId)
      .order('created_at', { ascending: false })
      .limit(20)

    posts.value = data || []
    isLoadingPosts.value = false
  }

  // Fetch Total Member Count
  const fetchMemberCount = async () => {
    const { count } = await supabase
      .from('community_members')
      .select('*', { count: 'exact', head: true })
      .eq('community_id', communityId)

    memberCount.value = count || 0
  }

  // Fetch Online Count (initial and realtime)
  const fetchOnlineCount = async () => {
    const { count } = await supabase
      .from('online_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('community_id', communityId)
      .gt('last_active', new Date(Date.now() - 5 * 60 * 1000).toISOString())

    onlineCount.value = count || 0
  }

  const channel = supabase
    .channel(`community:${communityId}:online`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'online_sessions',
        filter: `community_id=eq.${communityId}`
      },
      fetchOnlineCount
    )
    .subscribe()

  // Presence: Keep user online
  const updatePresence = async () => {
    if (!user.value) return
    await supabase
      .from('online_sessions')
      .upsert({
        user_id: user.value.id,
        community_id: communityId,
        last_active: new Date().toISOString()
      }, { onConflict: 'user_id,community_id' })
  }

  // Cleanup presence on unmount
  const cleanup = () => {
    clearInterval(pingInterval.value)
    if (user.value?.id) {
      supabase
        .from('online_sessions')
        .delete()
        .eq('user_id', user.value.id)
        .eq('community_id', communityId)
    }
    supabase.removeChannel(channel)
  }

  // Lifecycle
  onMounted(() => {
    checkMembership()
    fetchPosts()
    fetchMemberCount()
    fetchOnlineCount()
    updatePresence()
    pingInterval.value = setInterval(updatePresence, 2 * 60 * 1000)
  })

  onUnmounted(cleanup)

  return {
    isJoined,
    joinCommunity,
    leaveCommunity,
    memberCount,
    onlineCount,
    posts,
    isLoadingPosts,
    fetchPosts
  }
}
