<template>
  <div class="card shadow bg-base-100 border border-gray-300 p-4">
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
      class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
      <NuxtLink :to="`/m/${community.name?.slice(2)}`" class="flex items-center space-x-3 flex-1">
        <div class="text-lg">{{ community.icon }}</div>
        <div class="flex-1 min-w-0">
        <p class="text-sm font-medium truncate">{{ community.name }}</p>
        <p class="text-xs text-gray-500">{{ community.member_count }} members</p>
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

</script>