<script lang="ts" setup>
import type { FlairStats } from '~/pages/flair/[name]/index.vue';

  defineProps<{
    showStats: boolean;
    stats: FlairStats;
  }>()
</script>

<template>
  <div v-if="showStats" class="border border-gray-300 dark:border-base-300 card bg-base-100 shadow">
    <div class="p-6">
      <div class="text-lg flex items-center font-semibold leading-none tracking-tight">
      <i class="i-lucide-bar-chart-3 h-5 w-5 mr-2 text-[#297D4E]" />
      Weekly Activity
      </div>
    </div>
    <div class="p-6 pt-0">
      <div v-if="stats && stats.postsByDay && stats.postsByDay.length" class="space-y-2">
        <div
          v-for="day in stats.postsByDay"
          :key="day.day"
          class="flex items-center justify-between"
        >
        <span class="text-sm">{{ day.day }}</span>
        <div class="flex items-center space-x-2 flex-1 mx-3">
          <div class="flex-1 bg-gray-200 rounded-full h-2">
          <div
          class="bg-[#297D4E] h-2 rounded-full"
          :style="{
            width: `${(day.count / Math.max(...stats.postsByDay.map((d) => d.count))) * 100}%`,
          }"
          />
        </div>
      </div>
      <span class="text-sm font-medium">{{ day.count }}</span>
      </div>
      </div>
      <div v-else class="text-center text-sm text-gray-500 py-4">
        No activity data available for this flair.
      </div>
    </div>
  </div>
</template>
