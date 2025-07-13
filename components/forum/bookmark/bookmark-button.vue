<template>
  <button 
  class="btn-sm btn-ghost flex items-center cursor-pointer dark:hover:bg-transparent"
  :class="`h-8 px-3 hover:bg-gray-100 ${isBookmarked ? 'text-[#297D4E]' : ''}`"
  @click.stop="handleClick"
  >
    <i :class="`h-4 w-4 mr-2 ${isBookmarked ? 'i-mdi-bookmark' : 'i-mdi-bookmark-outline'}`" />
    <span class="hidden md:block">Save</span>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useBookmark } from '~/composables/useBookmark';

const props = defineProps<{
  postId?: string;
  commentId?: string;
}>();

const { toggleBookmark, checkBookmarkStatus } = useBookmark();
const isBookmarked = ref(false);

// Auto-check status on mount or prop change
const loadBookmark = async () => {
  if (!props.postId && !props.commentId) return;
  isBookmarked.value = await checkBookmarkStatus(props.postId, props.commentId);
};

onMounted(loadBookmark);
watch(() => [props.postId, props.commentId], loadBookmark);

const handleClick = async () => {
  const previous = isBookmarked.value;
  isBookmarked.value = !previous;

  try {
    await toggleBookmark({
      postId: props.postId,
      commentId: props.commentId,
      currentState: previous,
      onRevert: () => (isBookmarked.value = previous),
    });
  } catch (e) {
    console.error(e);
  }
};
</script>