<script lang="ts" setup>
import type { Posts } from '~/types/utility';
import { useToast } from 'vue-toastification';
import ForumLayout from '~/layouts/forum.vue';
import PostList from '~/components/forum/post/post-list.vue';
import type { Database, Tables } from '~/types/database.types';
import RecentPosts from "~/components/forum/post/recent-posts.vue";

const page = ref(1);
const toast = useToast();
const route = useRoute();
const loading = ref(false);
const itemsPerPage = ref(10);
const posts = ref<Posts[]>([]);
const hasMorePosts = ref(true);
const tag = ref<Tables<'tags'> | null>(null);
const sentinel = ref<HTMLElement | null>(null);
const supabase = useSupabaseClient<Database>();

// Fetch the tag details using the tagname from route params
const fetchTagDetails = async () => {
  const tagName = route.params.tagname as string;

  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('title', tagName)
      .single();

    if (error) throw error;

    if (data) {
      tag.value = data;
    } else {
      throw new Error('Tag not found');
    }
  } catch {
    toast.error('Error fetching tag details');
  }
};

const fetchPosts = async () => {
  if (loading.value || !tag.value) return; // Ensure tag is available

  loading.value = true;

  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles!posts_profile_id_fkey(*),
        comments(id, content, profile_id, post_id),
        post_tags!inner(*),
        tags!inner(*)
      `)
      .eq('post_tags.tag_id', tag.value.id) // Filter posts by tag ID
      .range((page.value - 1) * itemsPerPage.value, page.value * itemsPerPage.value - 1);

    if (error) throw error;

    if (data?.length) {
      posts.value = [...posts.value, ...data] as Posts[];
      page.value++;

      if (data.length < itemsPerPage.value) {
        hasMorePosts.value = false;
      }
    } else {
      hasMorePosts.value = false;
    }
  } catch {
    toast.error('Error fetching posts');
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  // Fetch tag details first
  await fetchTagDetails();

  // Fetch posts only if tag is found
  if (tag.value) {
    await fetchPosts();
  }

  // Set up intersection observer
  const options = {
    root: null,
    rootMargin: '100px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !loading.value && hasMorePosts.value) {
        fetchPosts();
      }
    });
  }, options);

  // Start observing when component is mounted
  if (sentinel.value) {
    observer.observe(sentinel.value);
  }

  // Cleanup
  onUnmounted(() => {
    observer.disconnect();
  });
});
</script>

<template>
  <ForumLayout>
    <template #main>
      <div class="mt-4 p-4 md:p-8">
        <h1 class="text-4xl">{{ tag?.title }}</h1>
        <p class="text">{{ tag?.description }}</p>

        <div v-if="tag" class="w-full h-[1px] bg-base-300 mt-2" />
          <div v-if="posts.length">
            <PostList :posts="posts" />
          </div>

          <div 
          v-if="hasMorePosts"
          ref="sentinel" 
          class="text-center h-20 my-8"
          >
          <span v-if="loading" class="text-gray-600 text-2xl loading loading-spinner"/>
        </div>
        
        <div v-if="!hasMorePosts && !posts.length" class="text-center text-xl mt-4">
          No posts found
        </div>
      </div>
    </template>
    <template #aside>
      <RecentPosts/>
    </template>
  </ForumLayout>
</template>