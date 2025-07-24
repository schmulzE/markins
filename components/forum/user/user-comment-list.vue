<script lang="ts" setup>
interface UserComment {
  id: string;
  content: string;
  postTitle: string;
  postId: string;
  community: string;
  timeAgo: string;
  upvotes: number;
}

defineProps<{
  comments: UserComment[];
}>()
</script>

<template>
  <div v-if="!comments.length">
    <div class="card shadow border border-base-300 p-4 bg-base-100">
      <div class="p-8 text-center">
        <i class="h-12 w-12 mx-auto text-gray-500 mb-4 i-lucide-file-text" />
        <h3 class="text-lg font-semibold mb-2">No comments yet</h3>
        <p class="text-gray-500">Comments you created will appear here</p>
      </div>
    </div>
  </div>
  <div 
  v-else 
  class="space-y-4"
  >
    <div 
    v-for="comment in comments"
    :key="comment.id" 
    class="hover:shadow-md shadow border border-gray-300 dark:border-base-100 bg-base-100 "
  >
    <div class="p-4">
      <div class="flex items-center space-x-2 mb-2">
        <i class="h-4 w-4 text-gray-500 i-lucide-message-square" />
        <span class="text-sm text-gray-500 dark:text-base-content">Comment on</span>
        <NuxtLink :to="`/posts/${comment.postId}`" class="text-sm font-medium text-[#297D4E] hover:underline line-clamp-3">
          {{ comment.postTitle }}
        </NuxtLink>
        <span class="text-xs text-gray-500 dark:text-base-content">in m/{{ comment.community }}</span>
        <span class="text-xs text-gray-500 dark:text-base-content">•</span>
        <span class="text-xs text-gray-500 dark:text-base-content">{{ comment.timeAgo }}</span>
      </div>

      <p class="text-sm text-gray-700 dark:text-base-content mb-3">{{ comment.content }}</p>

      <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-base-content">
        <div class="flex items-center space-x-1">
          <i class="i-lucide-chevron-up h-4 w-4" />
          <span>{{ comment.upvotes }}</span>
        </div>
        <button class="btn btn-ghost h-8 px-2">
          Reply
        </button>
      </div>
    </div>
  </div>
</div>
</template>
