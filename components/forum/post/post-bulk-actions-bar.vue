<script lang="ts" setup>
import type { Post } from '~/types/utility';

const props = defineProps<{
  posts: Post[];
  isModerator: boolean;
  isSelectMode: boolean;
  selectedPosts: string[];
}>();

const emit = defineEmits<{
  'update:isSelectMode': [value: boolean];
  'update:selectedPosts': [value: string[]];
  'bulk-action': [action: 'approve' | 'remove'];
}>();

const handleSelectAll = () => {
  const isAllSelected = props.selectedPosts.length === props.posts.length && props.posts.length > 0;
  
  if (isAllSelected) {
    // Deselect all
    emit('update:selectedPosts', []);
  } else {
    // Select all - extract IDs from posts
    const allPostIds = props.posts
      .map(post => post.id)
      .filter((id): id is string => id !== undefined && id !== null);
    emit('update:selectedPosts', allPostIds!);
  }
};

const handleBulkAction = (action: 'approve' | 'remove') => {
  emit('bulk-action', action);
  // Optionally clear selection after action
  emit('update:selectedPosts', []);
};
</script>

<template>
  <div v-if="isModerator && isSelectMode" class="shadow card border p-4 border-[#297D4E]/20 bg-[#297D4E]/5">
    <div class="p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              :checked="selectedPosts.length === posts.length && posts.length > 0"
              class="rounded border-gray-300 text-[#297D4E] focus:ring-[#297D4E]"
              @change="handleSelectAll"
            >
            <span class="text-sm font-medium">
              {{ selectedPosts.length === posts.length && posts.length > 0 ? 'Deselect All' : 'Select All' }}
            </span>
          </div>
          <div v-if="selectedPosts.length > 0" class="bg-[#297D4E] text-white badge">
            {{ selectedPosts.length }} selected
          </div>
        </div>

        <div v-if="selectedPosts.length > 0" class="flex items-center space-x-2">
          <button
            class="btn btn-outline text-green-600 hover:bg-green-50"
            @click="() => handleBulkAction('approve')"
          >
            <i class="i-lucide-check-circle h-4 w-4 mr-2" />
            Approve ({{ selectedPosts.length }})
          </button>
          <button
            class="btn btn-outline text-red-600 hover:bg-red-50"
            @click="() => handleBulkAction('remove')"
          >
            <i class="i-lucide-x-circle h-4 w-4 mr-2" />
            Remove ({{ selectedPosts.length }})
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
