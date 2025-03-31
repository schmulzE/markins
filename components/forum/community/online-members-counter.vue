<script setup lang="ts">
const props = defineProps<{
  communityId: string
}>()

const onlineMembersCount = ref(0);
const supabase = useSupabaseClient();

// Fetch initial count
const fetchOnlineMembersCount = async () => {
  try {
    const { data, error } = await supabase
      .from('community_presence')
      .select('*', { count: 'exact' })
      .eq('community_id', props.communityId)
      .eq('status', 'online')

    if (error) throw error
    
    onlineMembersCount.value = data?.length || 0
  } catch {
    throw new Error('Error fetching online members')
  }
}

// Subscribe to presence changes
const subscribeToPresenceChanges = () => {
  const channel = supabase
    .channel(`community_presence_${props.communityId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'community_presence',
        filter: `community_id=eq.${props.communityId}`
      },
      async (payload) => {
        console.log('Presence change detected:', payload)
        // Refetch count when presence changes
        await fetchOnlineMembersCount()
      }
    )
    .subscribe((status) => {
      console.log('Subscription status:', status)
    })

  // Cleanup on unmount
  onUnmounted(() => {
    channel.unsubscribe()
  })
}

// Initialize
onMounted(async () => {
  await fetchOnlineMembersCount()
  subscribeToPresenceChanges()
})
</script>

<template>
  <div>
    <div class="flex flex-col">
      <span> {{ onlineMembersCount }} </span>
      <span class="text-xs">online</span>
    </div>
  </div>
</template>