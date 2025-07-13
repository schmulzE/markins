<script lang="ts" setup>
import type { Tables } from '~/types/database.types';

defineProps<{
  moderators: Tables<'profiles'>[]
}>()
</script>

<template>
  <div class="shadow card bg-base-100 border p-4 border-gray-300 dark:border-base-100">
    <div class="text-lg flex items-center font-medium mb-4">
      <i class="i-lucide-shield h-5 w-5 mr-2 text-[#297D4E]" />
      Moderators
    </div>
    <div>
      <div class="space-y-3">
        <div v-for="(mod, index) in moderators" :key="index" class="flex items-center space-x-3">
          <div v-if="mod?.avatar_url" class="avatar">
            <div class="w-7 rounded-full">
              <img :src="mod?.avatar_url" class="rounded-full" alt="User Avatar">
            </div>
          </div>
          <div v-else class="avatar avatar-placeholder">
            <div class="bg-gray-300 text-neutral-content w-7 rounded-full">
              <span class="text-lg">{{ mod?.username?.split(' ').map(n => n[0]).join('') }}</span>
            </div>
          </div>
          <NuxtLink :to="`/user/${mod?.username}`" class="text-sm hover:underline">
            u/{{ mod?.username }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
