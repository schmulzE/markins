<script lang="ts" setup>
import type { Community } from '~/types/utility';

defineEmits(['join-community']);

defineProps<{
  isJoined: boolean;
  onlineCount: number;
  community: Community;
}>();

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatNumber = (num: number) => {
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
}
</script>

<template>
  <div class="shadow card bg-base-100 border p-4 border-gray-300 dark:border-base-100">
    <div class="text-lg flex items-center font-medium mb-4">
      <i class="i-lucide-users h-5 w-5 mr-2 text-[#297D4E]" />
      About Community
    </div>
    <div class="space-y-4">
      <p class="text-sm text-gray-500 dark:text-base-content first-letter:capitalize">{{ community?.long_description }}</p>

      <div class="space-y-2">
        <div class="flex justify-between">
          <span class="text-sm">Members</span>
          <span class="text-sm font-medium">
            {{ community?.member_count ? formatNumber(community.member_count) : '' }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm">Online</span>
          <span class="text-sm font-medium text-green-600">{{ onlineCount }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm">Created</span>
          <span class="text-sm font-medium">
            {{ community?.created_at ? formatDate(community?.created_at) : '' }}
          </span>
        </div>
      </div>

      <button class="w-full btn text-white bg-[#297D4E] hover:bg-[#1f5a37]" @click="$emit('join-community')">
        {{ isJoined ? 'Joined' : 'Join Community' }}
      </button>

      <template v-if="false">
        <div class="border-t border-gray-300 dark:border-base-100 pt-4 mt-4">
          <h4 class="font-medium text-[#297D4E] mb-3 flex items-center">
            <i class="i-lucide-settings h-4 w-4 mr-2" />
            Quick Settings
          </h4>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm">Post Approval</span>
              <input 
              type="checkbox" 
              class="toggle checked:bg-[#297D4E] checked:border-[#297D4E] checked:text-white" 
              :checked="false" 
              >
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">Allow Images</span>
              <input 
              type="checkbox" 
              class="toggle checked:bg-[#297D4E] checked:border-[#297D4E] checked:text-white" 
              :checked="true" 
              >
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">Allow Links</span>
              <input 
              type="checkbox" 
              class="toggle checked:bg-[#297D4E] checked:border-[#297D4E] checked:text-white" 
              :checked="true" 
              >
            </div>
          </div>
        </div>
        <button class="btn btn-outline border-gray-300 w-full mt-3">
          <i class="i-lucide-settings h-4 w-4 mr-2" />
          Full Settings
        </button>
      </template>
    </div>
  </div>
</template>
