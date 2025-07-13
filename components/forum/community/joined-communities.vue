<template>
  <div class="card shadow bg-base-100 border border-gray-300 dark:border-base-100 p-4">
    <div class="pb-3">
      <div class="text-lg flex items-center">
        <i class="h-5 w-5 mr-2 text-[#297D4E] i-lucide-users" />
        Your Communities
      </div>
    </div>
    <div v-if="joinedCommunities.length" class="space-y-2">
      <div
      v-for="community in joinedCommunities"
      :key="community.id"
      class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-base-200 transition-colors"
      >
      <NuxtLink :to="`/m/${community.slug}`" class="flex items-center space-x-3 flex-1 ">
        <div class="text-lg">{{ community.icon }}</div>
        <div class="flex-1 min-w-0">
        <p class="text-sm font-medium truncate">{{ community.name }}</p>
        <p class="text-xs text-gray-500">{{ formatNumber(community.member_count!) }} members</p>
        </div>
      </NuxtLink>
      </div>
    </div>
    <div v-else class="text-gray-500 text-sm text-center py-6">
      You haven't joined any communities yet.
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Community } from '~/types/utility';

defineProps<{
  joinedCommunities: Community[]
}>();

const formatNumber = (num: number) => {
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
}

</script>