<template>
  <div class="space-y-4">
    <PostToolbar
      :posts="posts"
      :sort-by="sortBy"
      @update:sort-by="(val: 'hot' | 'new' | 'top') => {
        sortBy = val
        resetAndFetchPosts()
      }"
    />

    <PostCard 
    :post-data="posts"
    @vote="handleVote"
    @hide-click="handleHidePost"
    />

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
import type { Post } from '~/types/utility';
import PostCard from '~/components/forum/post/post-card.vue';
import PostToolbar from '~/components/forum/post/post-toolbar.vue';

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

const emit = defineEmits(['vote', 'bookmark-click', 'hide-click'])

const page = ref(1);
const loading = ref(false);
const posts = ref<Post[]>([]);
const hasMorePosts = ref(true);
const supabase = useSupabaseClient();
const filterBy = ref<string | null>(null)
const sentinel = ref<HTMLElement | null>(null);
const sortBy = ref<'hot' | 'new' | 'top'>('hot')
const observer = ref<IntersectionObserver | null>(null);

const fetchPosts = async () => {
  if (loading.value) return

  loading.value = true

  try {
    let query = supabase
      .from(props.tableName)
      .select(props.columns.join(','))

    // Sorting logic
    switch (sortBy.value) {
      case 'new':
        query = query.order('created_at', { ascending: false })
        break
      case 'top':
        query = query.order('upvotes', { ascending: false })
        break
      case 'hot':
        query = query.order('hot_score', { ascending: false })
        break
      default:
        query = query.order(props.orderBy.column, { ascending: props.orderBy.ascending })
    }

    // Filtering logic (optional)
    if (filterBy.value) {
      query = query.eq('tag', filterBy.value)
    }

    // Pagination
    query = query.range((page.value - 1) * props.itemsPerPage, page.value * props.itemsPerPage - 1)

    // EqualTo (optional external filter)
    if (props.equalTo?.column && props.equalTo?.value) {
      query = query.eq(props.equalTo.column, props.equalTo.value)
    }

    const { data, error } = await query
    if (error) throw error
    if (!data) throw new Error('No data returned from query')

    if (data.length) {
      posts.value = [...posts.value, ...data]
      page.value++

      if (data.length < props.itemsPerPage) {
        hasMorePosts.value = false
      }
    } else {
      hasMorePosts.value = false
    }
  } catch (error) {
    throw new Error(`Error fetching posts: ${error}`)
  } finally {
    loading.value = false
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

  observer.value = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !loading.value && hasMorePosts.value) {
        fetchPosts()
      }
    })
  }, options)

  // Start observing when component is mounted
  if (sentinel.value) {
    observer.value.observe(sentinel.value)
  }

})
// Cleanup
onUnmounted(() => {
  observer.value?.disconnect()
})

const resetAndFetchPosts = () => {
  page.value = 1
  posts.value = []
  hasMorePosts.value = true
  fetchPosts()
}

const handleVote = (payload: string) => {
  // Implement vote logic here
  emit('vote', payload)
}

const handleHidePost = (postId: string) => {
  // Hide the post by filtering it out from the posts array
  const postIndex = posts.value.findIndex(post => post.id === postId);
  if (postIndex !== -1) {
    posts.value = [
      ...posts.value.slice(0, postIndex),
      ...posts.value.slice(postIndex + 1)
    ];
  }
  // toast.info('Post hidden');
  console.log('Post hidden:', postId);
}

</script>