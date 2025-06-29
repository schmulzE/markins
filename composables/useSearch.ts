import { ref } from 'vue';
import type { Post, Community, Profile } from "~/types/utility";
import { watchDebounced } from '@vueuse/core';

export function useSearch() {
  const query = ref('')
  const type = ref<'all' | 'post' | 'user' | 'community'>('all')
  const sort = ref<'relevance' | 'new' | 'top'>('relevance')
  const time = ref<'all' | 'day' | 'week' | 'month' | 'year'>('all')
  const isLoading = ref(false)
  const results = ref<{
    posts: Post[],
    communities: Community[],
    users: Profile[]
  }>({ posts: [], communities: [], users: [] })

  const fetchResults = async () => {
    if (!query.value.trim()) return

    isLoading.value = true
    const { data } = await useFetch('/api/search', {
      query: {
        q: query.value,
        type: type.value,
        sort: sort.value,
        time: time.value
      }
    })

    results.value = (data.value as { posts: Post[], communities: Community[], users: Profile[] }) || { posts: [], communities: [], users: [] }
    isLoading.value = false
  }

  watchDebounced(query, fetchResults, { debounce: 300 })

  return {
    query, type, sort, time, results, isLoading, fetchResults
  }
}