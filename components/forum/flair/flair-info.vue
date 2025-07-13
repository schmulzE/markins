<script lang="ts" setup>
import type { FlairInfo } from '~/pages/flair/[name]/index.vue';

const emit = defineEmits(['follow-flair']);

defineProps<{
  flairId: string;
  flairInfo: FlairInfo;
  totalContributors: number;
}>();

const formatDate = (date: string) => {
  return new Date(date).getFullYear() + '-' + (new Date(date).getMonth() + 1) + '-' + new Date(date).getDate()
};

const handleFollowFlair = (flairId: string) => {
  emit('follow-flair', flairId);
}
</script>

<template>
  <div class="border border-gray-300 dark:border-base-300 card bg-base-100 shadow">
    <div class="p-6">
      <div class="text-lg flex items-center font-medium leading-none tracking-tight">
        <i class="i-lucide-tags h-5 w-5 mr-2 text-[#297D4E]" />
        About This Flair
      </div>
    </div>
    <div class="p-6 pt-0 space-y-4">
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span>Total Posts</span>
          <span class="font-medium">{{ flairInfo?.totalPosts?.toLocaleString() }}</span>
        </div>
        <div class="flex justify-between">
          <span>Contributors</span>
          <span class="font-medium">{{ totalContributors.toLocaleString() }}</span>
        </div>
        <div class="flex justify-between">
          <span>Created</span>
            <span class="font-medium">
            {{ formatDate(flairInfo?.createdDate) }}
            </span>
        </div>
        <div class="flex justify-between">
          <span>Weekly Growth</span>
          <span class="font-medium text-green-600">{{ flairInfo.weeklyGrowth }}</span>
        </div>
      </div>

      <button
      class="btn"
        :class="[
          'w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2',
          flairInfo.isFollowing ? 'bg-gray-200 text-gray-700' : 'bg-[#297D4E] hover:bg-[#1f5a37] text-white'
        ]"
        @click="() => handleFollowFlair(flairId)"
      >
        <i class="i-lucide-star" :class="`h-4 w-4 mr-2 ${flairInfo.isFollowing ? 'fill-current' : ''}`" />
        {{ flairInfo.isFollowing ? 'Following' : 'Follow Flair' }}
      </button>
    </div>
  </div>
</template>
