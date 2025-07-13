<script lang="ts" setup>
import type { FlairInfo } from '~/pages/flair/[name]/index.vue';

defineProps<{
  flairInfo: FlairInfo;
}>();
</script>

<template>
  <div class="border border-gray-300 dark:border-base-300 card bg-base-100 shadow">
    <div class="p-6">
      <div class="text-lg font-semibold leading-none tracking-tight">Related Flairs</div>
    </div>
    <div class="p-6 pt-0">
      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="item in flairInfo.relatedFlairs"
          :key="item"
          :to="`/flair/${item}`"
        >
          <span
            class="inline-flex items-center rounded-full badge badge-outline text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer hover:bg-[#297D4E] hover:text-white"
          >
            {{ item }}
          </span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
