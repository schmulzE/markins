<template>
  <div class="space-y-4 card bg-base-100 shadow border border-gray-300 dark:border-base-100 p-4">
    <div class="text-lg">About</div>
    <p class="text-sm text-gray-500 dark:text-base-content">{{ user?.bio }}</p>

    <div class="space-y-2 text-sm">
      <div class="flex items-center space-x-2">
        <i class="h-4 w-4 text-gray-500 i-lucide-calendar" />
        <span>Joined {{ joinDate }}</span>
      </div>

      <div v-if="user?.location" class="flex items-center space-x-2">
        <i class="h-4 w-4 text-gray-500 i-lucide-map-pin" />
        <span>{{ user.location }}</span>
      </div>

      <div v-if="user?.website" class="flex items-center space-x-2">
        <i class="h-4 w-4 text-gray-500 i-lucide-globe" />
        <a :href="user.website" class="text-[#297D4E] hover:underline" target="_blank">
          {{ user.website }}
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Profile } from '~/types/utility';
const props = defineProps<{ user: Profile }>();

const joinDate = computed(() => {
  return props.user?.created_at
    ? new Date(props.user.created_at).toLocaleString('en-US', { month: 'long', year: 'numeric' })
    : ''
});
</script>
