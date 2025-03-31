<template>
  <button class="flex cursor-pointer" @click="handleBookmark">
    <span v-if="!isBookmarked" class="i-ri-bookmark-line text-xl text-slate-400" />
    <span v-else class="i-ri-bookmark-fill text-xl" />
    <span class="text-sm">Save</span>
  </button>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useBookmark } from '~/composables/useBookmark';

const props = defineProps<{
  postId?: string
  commentId?: string
}>()

const { isBookmarked, toggleBookmark, checkBookmarkStatus } = useBookmark()

// const handleBookmark = () => {
//   toggleBookmark(props.postId || null, props.commentId || null)
// }

const handleBookmark = () => {
  if (props.postId) {
    toggleBookmark(props.postId, '') // Bookmark the post
  } else if (props.commentId) {
    toggleBookmark('', props.commentId) // Bookmark the comment
  }
}

onMounted(async () => {
  await checkBookmarkStatus(props.postId || '', props.commentId || '')
})
</script>

<style scoped>
.bookmarked {
  background-color: #4CAF50;
  color: white;
}
</style>