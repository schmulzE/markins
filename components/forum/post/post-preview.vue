<script lang="ts" setup>
import type { Community } from '~/types/utility';
import type { PostData } from '~/pages/post/create.vue';

defineProps<{
  isPreview: boolean;
  imagePreview: string;
  postData: PostData
  selectedCommunityData: Community;
}>()
</script>

<template>
  <div v-if="isPreview" class="card border bg-base-100 border-gray-200 dark:border-base-300 p-4">
    <div>
      <div class="text-lg">Preview</div>
    </div>
    <div>
      <div class="space-y-4">
        <div class="flex items-center space-x-2">
          <template v-if="selectedCommunityData">
            <span>{{ selectedCommunityData.icon }}</span>
            <span class="text-sm font-medium text-[#297D4E]">{{ selectedCommunityData.name }}</span>
            <span class="text-xs text-muted-foreground">• Posted by u/you • now</span>
          </template>
        </div>

        <div v-if="postData.selectedFlairs.length > 0" class="flex flex-wrap gap-1">
          <div
            v-for="flair in postData.selectedFlairs"
            :key="flair.id"
            class="bg-[#297D4E]/10 text-[#297D4E] badge"
          >
            {{ flair.name }}
          </div>
        </div>

        <h3 class="text-lg font-semibold">{{ postData.title || "Your post title will appear here" }}</h3>

        <div v-if="postData.postType === 'image' && imagePreview" class="relative w-full h-64 rounded-lg overflow-hidden">
          <img :src="imagePreview || '/svg/placeholder.svg'" alt="Preview" class="object-cover w-full h-full" >
        </div>

        <div v-if="postData.postType === 'link' && postData.linkUrl" class="border border-gray-300 rounded-lg p-3 bg-gray-50">
          <div class="flex items-center space-x-2 text-sm text-[#297D4E]">
            <i class="h-4 w-4 i-lucide-link" />
            <span class="truncate">{{ postData.linkUrl }}</span>
          </div>
        </div>

        <p v-if="postData.content" class="text-sm text-gray-700 whitespace-pre-wrap">{{ postData.content }}</p>
      </div>
    </div>
  </div>
</template>
