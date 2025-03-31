<template>
  <div>
    <PostList :posts="posts"/>
    <div 
      v-if="hasMorePosts"
      ref="sentinel" 
      class="text-center h-20 my-8"
    >
      <span v-if="loading" class="text-gray-600 text-2xl loading loading-spinner"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PostList from './post-list.vue';
import type { Posts } from '~/types/utility';
import type { Database } from '~/types/database.types';

interface Props {
  tableName: string
  columns: string[]
  itemsPerPage?: number
  equalTo?: { column: string; value: string } | null
  orderBy?: { column: string; ascending: boolean }
}

const props = withDefaults(defineProps<Props>(), {
  itemsPerPage: 10,
  orderBy: () => ({ column: 'id', ascending: true }),
  equalTo: null
})

const page = ref(1);
const loading = ref(false);
const hasMorePosts = ref(true);
const posts = ref<Posts[]>([]);
const supabase = useSupabaseClient<Database>();
const sentinel = ref<HTMLElement | null>(null);

const fetchPosts = async () => {
  if (loading.value) return
  
  loading.value = true;

  try {
    let query = supabase
      .from(props.tableName)
      .select(props.columns.join(','))
      .range((page.value - 1) * props.itemsPerPage, page.value * props.itemsPerPage - 1)
      .order(props.orderBy.column, { ascending: props.orderBy.ascending })

    if (props.equalTo?.column && props.equalTo?.value) {
      query = query.eq(props.equalTo.column, props.equalTo.value)
    }

    const { data, error } = await query

    if (error) throw error

    if (data?.length) {
      posts.value = [...posts.value, ...data] as Posts[]
      page.value++
      
      if (data.length < props.itemsPerPage) {
        hasMorePosts.value = false
      }
    } else {
      hasMorePosts.value = false
    }
  } catch (error) {
    throw new Error('Error fetching posts ' + error)
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  // Initial load
  fetchPosts()

  // Set up intersection observer
  const options = {
    root: null,
    rootMargin: '100px',
    threshold: 0.1
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !loading.value && hasMorePosts.value) {
        fetchPosts()
      }
    })
  }, options)

  // Start observing when component is mounted
  if (sentinel.value) {
    observer.observe(sentinel.value)
  }

  // Cleanup
  onUnmounted(() => {
    observer.disconnect()
  })
})
</script>