<script lang="ts" setup>
import type { FlairInfo } from '~/pages/flair/[name]/index.vue';

defineProps<{
  flairInfo: FlairInfo;
}>();
</script>

<template>
  <div class="border border-gray-300 dark:border-base-300 card bg-base-100 shadow">
    <div class="p-6">
      <div class="text-lg flex items-center font-semibold leading-none tracking-tight">
        <i class="i-lucide-users h-5 w-5 mr-2 text-[#297D4E]" />
        Top Communities
      </div>
    </div>
    <div class="p-6 pt-0">
      <div class="space-y-3">
        <div
          v-for="(community, index) in flairInfo.topCommunities"
          :key="community.name"
          class="flex items-center justify-between"
        >
          <NuxtLink
            :to="`/m/${community.name.slice(2)}`"
            class="flex items-center space-x-3 flex-1"
          >
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-500">#{{ index + 1 }}</span>
              <span class="text-lg">{{ community.icon }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ community.name }}</p>
            </div>
          </NuxtLink>
          <span class="badge badge-outline rounded-full">
            {{ community.count }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
