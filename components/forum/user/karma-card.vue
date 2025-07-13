<template>
  <div class="card bg-base-100 shadow border border-gray-300 p-4 space-y-4">
    <div class="text-lg flex items-center mb-4">
      <i class="h-5 w-5 mr-2 text-[#297D4E] i-lucide-trophy" />
      Karma
    </div>
    <div class="space-y-3 text-sm">
      <div class="flex justify-between">
        <span>Total Karma</span>
        <span class="font-bold text-[#297D4E]">{{ user?.karma?.toLocaleString() }}</span>
      </div>
      <div class="flex justify-between">
        <span>Post Karma</span>
        <span class="font-medium">{{ user?.post_karma?.toLocaleString() }}</span>
      </div>
      <div class="flex justify-between">
        <span>Comment Karma</span>
        <span class="font-medium">{{ user?.comment_karma?.toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Profile } from '~/types/utility'
defineProps<{ user: Profile }>()
</script>
