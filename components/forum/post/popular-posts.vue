<template>
  <div class="card shadow bg-base-100 border border-gray-300 dark:border-base-100 p-4">
    <div class="pb-3">
      <div class="text-lg flex items-center">
        <i class="h-5 w-5 mr-2 text-orange-500 i-lucide-flame" />
        Popular Today
      </div>
    </div>
    <div class="space-y-3">
      <div
        v-for="(post, index) in popularPosts"
        :key="index"
        class="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer dark:hover:bg-base-200"
      >
        <div class="text-sm font-medium text-gray-500">#{{ index + 1 }}</div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">{{ post.title }}</p>
          <div class="flex items-center space-x-2 text-xs text-gray-500">
            <span>{{ post.community }}</span>
            <span>•</span>
            <span>{{ post.votes }} upvotes</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

interface PopularPosts {
  title: string;
  votes: string;
  community: string;
}

defineProps<{
  popularPosts: PopularPosts[];
}>();


</script>