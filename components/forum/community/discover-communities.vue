<template>
  <div class="card shadow bg-base-100 border border-gray-300 dark:border-base-100 p-4">
    <div class="pb-3">
      <div class="text-lg flex items-center">
        <i class="h-5 w-5 mr-2 text-[#297D4E] i-lucide-telescope" />
        Discover Communities
      </div>
    </div>
    <div class="space-y-3">
      <div v-for="community in unjoinedCommunities.slice(0, 3)" :key="community.id" class="space-y-2">
        <div class="flex items-center justify-between">
          <NuxtLink :to="`/m/${community.slug}`" class="flex items-center space-x-3 flex-1">
            <div class="text-lg">{{ community.icon }}</div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ community.name }}</p>
              <p class="text-xs text-gray-500">{{ formatNumber(community.member_count!) }} members</p>
            </div>
          </NuxtLink>
        </div>
        <button
          class="w-full text-xs p-2 btn-sm btn-outline border cursor-pointer border-gray-300 dark:border-base-100 dark:bg-base-200"
          @click="() => handleJoinCommunity(community.id!)"
        >
          Join
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Community } from '~/types/utility';


defineProps<{
  unjoinedCommunities: Community[]
}>();

const emit = defineEmits(['join-community']);

const handleJoinCommunity =(communityId: string) => {
  emit('join-community', communityId)
}

const formatNumber = (num: number) => {
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
}
</script>
