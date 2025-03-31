import { ref } from 'vue';
import type { Database } from '~/types/database.types';
import { useSupabaseClient, useSupabaseUser } from '#imports';

export const usePresence = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  const currentCommunityId = ref<string | null>(null)

  const PRESENCE_INTERVAL = 30000 // 30 seconds
  let presenceInterval: NodeJS.Timeout

  const updateGlobalPresence = async (status: 'online' | 'offline') => {
    if (!user.value) return

    await supabase
      .from('user_presence')
      .upsert({
        profile_id: user.value.id,
        status,
        last_seen: new Date().toISOString(),
        current_community_id: currentCommunityId.value
      },
      {
        onConflict: 'profile_id',  // Specify the column to check for conflicts
        ignoreDuplicates: false    // Update existing record instead of ignoring
      })
  }

  const updateCommunityPresence = async (
    communityId: string,
    status: 'online' | 'offline'
  ) => {
    if (!user.value) return

    // Update presence in previous community if exists
    if (currentCommunityId.value && currentCommunityId.value !== communityId) {
      await supabase
        .from('community_presence')
        .upsert({
          community_id: currentCommunityId.value,
          profile_id: user.value.id,
          status: 'offline',
          last_seen: new Date().toISOString()
        },
        {
          onConflict: 'profile_id, community_id',  // Specify the column to check for conflicts
          ignoreDuplicates: false    // Update existing record instead of ignoring
        })
    }

    // Update presence in new community
    await supabase
      .from('community_presence')
      .upsert({
        community_id: communityId,
        profile_id: user.value.id,
        status,
        last_seen: new Date().toISOString()
      },
      {
        onConflict: 'profile_id, community_id',  // Specify the column to check for conflicts
        ignoreDuplicates: false    // Update existing record instead of ignoring
      })

    currentCommunityId.value = communityId
  }

  const updateOnlineMembersCount = async (communityId: string) => {
    const { count } = await supabase
      .from('community_presence')
      .select('*', { count: 'exact' })
      .eq('community_id', communityId)
      .eq('status', 'online')

    await supabase
      .from('community_members_count')
      .upsert({
        community_id: communityId,
        online_count: count || 0
      },
      {
        onConflict: 'id',
        ignoreDuplicates: false
      })
  }

  const startPresenceTracking = () => {
    updateGlobalPresence('online')
    
    presenceInterval = setInterval(() => {
      updateGlobalPresence('online')
      if (currentCommunityId.value) {
        updateCommunityPresence(currentCommunityId.value, 'online')
        updateOnlineMembersCount(currentCommunityId.value)
      }
    }, PRESENCE_INTERVAL)
  }

  const stopPresenceTracking = async () => {
    clearInterval(presenceInterval)
    await updateGlobalPresence('offline')
    if (currentCommunityId.value) {
      await updateCommunityPresence(currentCommunityId.value, 'offline')
      await updateOnlineMembersCount(currentCommunityId.value)
    }
  }

  // Setup Supabase realtime subscriptions
  const setupRealtimeSubscriptions = () => {
    supabase
      .channel('presence_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence'
        },
        (payload) => {
          // Handle presence changes
          console.log('Presence changed:', payload)
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_presence'
        },
        (payload) => {
          // Handle community presence changes
          console.log('Community presence changed:', payload)
        }
      )
      .subscribe()
  }

  // onMounted(() => {
  //   if (user.value) {
  //     startPresenceTracking()
  //     setupRealtimeSubscriptions()
  //   }
  // })

  // onUnmounted(() => {
  //   stopPresenceTracking()
  // })

  const initialize = () => {
    if (user.value) {
      startPresenceTracking()
      setupRealtimeSubscriptions()
    }
  }

  const cleanup = () => {
    stopPresenceTracking()
  }

  return {
    startPresenceTracking,
    updateCommunityPresence,
    currentCommunityId,
    initialize,
    cleanup
  }
}