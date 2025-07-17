<template>
  <div class="space-y-4">
    <PostToolbar
      :posts="posts"
      :sort-by="sortBy"
      @update:sort-by="onSortBy"
      @update:filter-by="onFilterBy!"
    />

    <PostCard 
      :post-data="posts"
      :filter-by="filterBy!"
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
import type { Flair, Post } from '~/types/utility';
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
    // Only allow tableName to be a valid table (fix type error)
    const allowedTables = [
      "posts", "bookmarks", "comment_reports", "comment_votes", "comments",
      "communities", "community_members", "community_moderators", "community_rules",
      "direct_messages", "post_flairs", "post_votes", "profiles"
    ] as const;
    type AllowedTable = typeof allowedTables[number];

    if (!allowedTables.includes(props.tableName as AllowedTable)) {
      throw new Error(`Invalid table name: ${props.tableName}`);
    }

    // Type assertion for supabase.from to satisfy TS
    let query = (supabase.from as (table: AllowedTable) => any)(
      props.tableName as AllowedTable
    ).select(props.columns.join(','))

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

    // Pagination
    query = query.range((page.value - 1) * props.itemsPerPage, page.value * props.itemsPerPage - 1)

    // EqualTo (optional external filter)
    if (props.equalTo?.column && props.equalTo?.value) {
      query = query.eq(props.equalTo.column, props.equalTo.value)
    }

    const { data, error } = await query
    if (error) throw error
    if (!data) throw new Error('No data returned from query')

    let filteredData = data
    if (filterBy.value) {
      filteredData = data.filter((post: Post) => {
        if (!post.post_flairs || !Array.isArray(post.post_flairs)) return false;
        // post_flairs is an array of objects with a flairs property (array)
        return post.post_flairs.some((pf: { flairs: { name: string | null; }; }) => pf.flairs && pf.flairs.name === filterBy.value)
      })
    }

    if (filteredData.length) {
      posts.value = [...posts.value, ...filteredData]
      page.value++

      if (filteredData.length < props.itemsPerPage) {
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

function onFilterBy(flair: Flair) {
  filterBy.value = flair && flair.name ? flair.name : null
  resetAndFetchPosts()
}

function onSortBy(val: 'hot' | 'new' | 'top') {
  sortBy.value = val
  filterBy.value = null // Clear flair filter when sorting
  resetAndFetchPosts()
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