<template>
  <ForumLayout>
    <template #main>
      <div class="mt-8">
        <PostList :posts="posts" />
        <div 
        v-if="hasMorePosts"
        ref="sentinel" 
        class="text-center h-20 my-8"
        >
          <span v-if="loading" class="text-gray-600 text-2xl loading loading-spinner"/>
        </div>
      </div>
    </template>
    <template #aside>
      <RecentPosts />
    </template>
  </ForumLayout>
</template>

<script setup lang="ts">
import type { Posts } from '~/types/utility';
import ForumLayout from '~/layouts/forum.vue';
import { useToast } from 'vue-toastification';
import type { Database } from '~/types/database.types';
import PostList from '~/components/forum/post/post-list.vue';
import RecentPosts from '~/components/forum/post/recent-posts.vue';
 
const page = ref(1);
const toast = useToast();
const loading = ref(false);
const itemsPerPage = ref(10);
const hasMorePosts = ref(true);
const posts = ref<Posts[]>([]);
const supabase = useSupabaseClient<Database>();
const sentinel = ref<HTMLElement | null>(null);
const observer = ref<IntersectionObserver | null>(null);


const fetchPosts = async () => {
  if (loading.value) return
  try{
    loading.value = true
    const { data, error } = await supabase
      .from('posts')
      .select('*, comments(*), profiles!posts_profile_id_fkey(*)')
      .range((page.value - 1) * itemsPerPage.value, page.value * itemsPerPage.value - 1)
      .order('created_at', {ascending: true})


    if (error) {
      throw new Error(error.message)
    }

    if (data) {
      const transformedData = data.map(post => ({
        ...post,
        commentCount: post.comments?.length || 0
      }))

      // Sort the transformed data
      const sortedData = transformedData.sort((a, b) => {
        if (a.commentCount === b.commentCount) {
          // If comment counts are equal, use the secondary sort
            return a['created_at']! < b['created_at']! ? 1 : -1
        }
        
        // Sort by comment count in descending order
        return b.commentCount - a.commentCount
      }) as unknown as Posts[]

      posts.value.push(...sortedData)

      page.value++

      hasMorePosts.value = data.length === itemsPerPage.value
    } else {
      hasMorePosts.value = false
    }
  }catch {
    toast.error('Unexpected error during fetching posts')
  } finally {
    loading.value = false
  }

}

onMounted(() => {
  fetchPosts();

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

</script>

<style scoped>

</style>