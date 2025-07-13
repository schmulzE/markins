<script lang="ts" setup>
import type { Community } from '~/types/utility';

defineProps<{
  isJoined: boolean;
  community: Community;
  communityName: string;
}>()

defineEmits(['join-community']);

</script>

<template>
  <div class="relative h-48 bg-gradient-to-r from-[#297D4E] to-[#1f5a37]">
    <img
      :src="community?.banner_url || '/svg/placeholder.svg'"
      alt="Community banner"
      class="absolute h-full w-full object-cover opacity-20"
    >
    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
    <div class="absolute bottom-0 left-0 right-0 p-6">
      <div class="">
        <div class="flex items-end space-x-4">
          <div class="text-6xl">{{ community?.icon }}</div>
          <div class="flex-1 text-white">
            <h1 class="text-3xl capitalize font-bold">{{ ($route.params.slug as string).replace('-', ' ') }}</h1>
            <p class="text-lg opacity-90">m/{{ communityName }}</p>
            <p class="text-sm opacity-75 line-clamp-2 md:line-clamp-none">{{ community?.description }}</p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              class="btn"
              :variant="isJoined ? 'secondary' : 'default'"
              :class="isJoined ? '' : 'bg-white text-[#297D4E] hover:bg-gray-100'"
              @click="$emit('join-community')"
            >
              {{ isJoined ? 'Joined' : 'Join' }}
            </button>
            <button
              class="border-white btn btn-outline hidden text-white hover:bg-base-100 dark:border-base-300 hover:text-[#297D4E]"
            >
              <i class="h-4 w-4 i-lucide-edit" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
