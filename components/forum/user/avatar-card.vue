<template>
  <div class="card bg-base-100 shadow border border-gray-300 dark:border-base-100 p-4">
    <div class="text-center space-y-4 p-4">
      <div class="mx-auto">
      <div v-if="profile?.avatar_url" class="avatar">
        <div class="w-24 rounded-full">
          <img :src="getImageUrl(profile?.avatar_url, 'avatars')  || '/svg/placeholder.svg'" class="rounded-full" alt="User Avatar">
        </div>
      </div>
      <div v-else class="avatar avatar-placeholder">
        <div class="bg-gray-300 text-base-content w-24 rounded-full">
          <span class="text-3xl">{{ profile?.display_name?.split(' ').map(n => n[0]).join('') }}</span>
        </div>
      </div>
    </div>

    <div>
      <div class="flex items-center justify-center space-x-2 mb-2">
        <h1 class="text-2xl font-bold">{{ profile?.display_name }}</h1>
        <i v-if="profile?.is_verified" class="inline i-lucide-verified w-4 h-4 bg-[#297D4E]" />
      </div>
      <p class="text-gray-500">u/{{ profile?.username }}</p>
    </div>

    <div class="flex justify-center space-x-2">
      <NuxtLink
        v-show="profile.id === user?.id"
        :to="{ path: '/settings/user', query: { username: profile?.username } }"
        class="btn btn-outline border-base-100"
      >
        <i class="i-lucide-edit w-4 h-4" />
      </NuxtLink>
      <button v-show="profile.id !== user?.id" class="btn bg-[#297D4E] hover:bg-[#1f5a37] text-white" @click="$emit('open-chat-modal')">
        <i class="h-4 w-4 mr-2 i-lucide-mail" /> Message
      </button>
    </div>
    
    <div v-if="profile?.badges?.length" class="space-y-2">
      <div v-for="(badge, index) in profile?.badges" :key="index" class="bg-[#297D4E]/10 text-[#297D4E] badge">
        <i class="h-3 w-3 mr-1 i-lucide-award" />
        {{ badge }}
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts" setup>
import type { Profile } from '~/types/utility';

const { getImageUrl } = useImageHandler();

defineProps<{ profile: Profile }>();
defineEmits(['open-chat-modal']);

const user = useSupabaseUser();
</script>
