import { useSupabaseClient } from '#imports'

export const useOnlineCounts = () => {
  const supabase = useSupabaseClient()
  const onlineCounts = ref<Record<string, number>>({})

  const fetchOnlineCounts = async () => {
    const { data, error } = await supabase.rpc('get_community_online_counts')
    if (error) {
      console.error('Failed to fetch online counts:', error)
      return
    }

    const counts: Record<string, number> = {}
    for (const row of data) {
      counts[row.community_id] = row.online_count
    }

    onlineCounts.value = counts
  }

  onMounted(fetchOnlineCounts)

  // Optionally, refresh every 2 minutes
  setInterval(fetchOnlineCounts, 2 * 60 * 1000)

  return { onlineCounts, fetchOnlineCounts }
}
