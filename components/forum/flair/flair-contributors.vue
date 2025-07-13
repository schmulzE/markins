<script lang="ts" setup>
import type { FlairStats } from '~/pages/flair/[name]/index.vue';

const { getImageUrl } = useImageHandler();


defineProps<{
  stats: FlairStats;
}>()
</script>

<template>
  <div v-if="stats" class="border border-gray-300 dark:border-base-300 card bg-base-100 shadow">
    <div class="p-6">
      <div class="text-lg flex items-center font-semibold leading-none tracking-tight">
        <i class="i-lucide-award h-5 w-5 mr-2 text-[#297D4E]" />
        Top Contributors
      </div>
    </div>
    <div class="p-6 pt-0">
      <div class="space-y-3">
        <div
          v-for="(author, index) in stats.topContributors"
          :key="author.username"
          class="flex items-center justify-between"
        >
          <NuxtLink :to="`/user/${author.username}`" class="flex items-center space-x-3 flex-1">
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-500">#{{ index + 1 }}</span>
              <div v-if="author.avatar_url" class="h-6 w-6 avatar">
                <div class="w-6 h-6 relative rounded-full">
                  <img :src="getImageUrl(author.avatar_url, 'post-images') || '/svg/placeholder.svg'" >
                </div>
              </div>

              <div v-else class="avatar avatar-placeholder">
                <div class="bg-neutral text-neutral-content w-6 h-6 rounded-full">
                  <span class="text-xs">{{ author.username?.slice(0, 2).toUpperCase() }}</span>
                </div>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">u/{{ author.username }}</p>
            </div>
          </NuxtLink>
          <span class="rounded-full border badge badge-outline badge-neutral text-xs">
            {{ author.count }} posts
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
