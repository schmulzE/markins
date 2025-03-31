<template>
  <ForumLayout>
    <template #main> 
      <div class="p-8">
        <PostList :posts="searchResults" />
        <div 
        v-if="hasMorePosts"
        ref="sentinel" 
        class="text-center h-20 my-8"
        >
          <span v-if="isSearching" class="text-gray-600 text-2xl loading loading-spinner"/>
        </div>
      
        <div v-if="searchTerm && !isSearching && (!searchResults || searchResults.length === 0)" class="no-results">
          No results found
        </div>
      </div>
    </template>
    <template #aside>
      <RecentPosts />
    </template>
  </ForumLayout>
</template>

<script setup lang="ts">
import ForumLayout from '~/layouts/forum.vue';
import { useSearch } from '~/composables/useSearch';
import PostList from '~/components/forum/post/post-list.vue';
import RecentPosts from '~/components/forum/post/recent-posts.vue';

const {
  page,
  searchTerm,
  searchResults,
  hasMorePosts,
  isSearching,
  searchPosts,
} = useSearch();

const sentinel = ref<HTMLElement | null>(null);
const observer = ref<IntersectionObserver | null>(null);
const route = useRoute();

// Initialize search term from route query
searchTerm.value = route.query.q as string;

// Perform initial search
onMounted(() => {
  searchPosts();

  const options = {
    root: null,
    rootMargin: '100px',
    threshold: 0.1
  };

  observer.value = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isSearching.value && hasMorePosts.value) {
        searchPosts();
      }
    });
  }, options);

  if (sentinel.value) {
    observer.value.observe(sentinel.value);
  }
});

// Cleanup observer
onUnmounted(() => {
  observer.value?.disconnect();
});

// Watch for changes in the route query
watch(() => route.query.q, (newQuery) => {
  searchTerm.value = newQuery as string;
  searchResults.value = [];
  page.value = 1;
  hasMorePosts.value = true;
  searchPosts();
});
</script>