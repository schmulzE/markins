<script setup lang="ts">
import type { Profile } from '~/types/utility';


const searchQuery = ref('');
const error = ref<unknown | null>(null);
const profile = ref<Profile | null>(null);


onMounted(async () => {
  try {
    const response = await $fetch('/api/user');
    profile.value = response?.data as unknown as Profile ?? null;
  } catch (err) {
    error.value = err;
  }
});

</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="sticky top-0 z-50 w-full border-b border-gray-300 bg-white/80 backdrop-blur-md">
      <div class="flex h-16 items-center justify-between px-4">
        <div class="flex items-center space-x-4">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <img src="/svg/markins-logo.svg" class="h-8" >
          </NuxtLink>

          <label class="input relative w-96 max-w-sm">
            <i class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 i-lucide-search" />
            <input
              v-model="searchQuery"
              placeholder="Search posts, communities..."
              class="pl-10"
            >
          </label>
        </div>

        <div class="flex items-center space-x-4">
          <NuxtLink to="/post/create" class="btn bt-m p-2 bg-[#297D4E] text-white hover:bg-[#1f5a37]">
            <i class="h-4 w-4 mr-2 i-lucide-plus" />
            Create Post
          </NuxtLink>
          <NuxtLink :to="`/user/${profile?.username}`" class="h-8 w-8 cursor-pointer">
           <div v-if="profile?.avatar_url" class="avatar">
              <div class="w-7 rounded-full">
                <img :src="profile?.avatar_url" class="rounded-full" alt="User Avatar">
              </div>
            </div>
            <div v-else class="avatar avatar-placeholder">
              <div class="bg-gray-300 text-neutral-content w-7 rounded-full">
                <span class="text-lg">{{ profile?.display_name?.split(' ').map(n => n[0]).join('') }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </header>

    <div class="px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Left Sidebar -->
        <div class="lg:col-span-1 space-y-4">
          <slot name="left-sidebar" />
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-4">
          <slot name="main" />
        </div>

        <!-- Right Sidebar -->
        <div class="lg:col-span-1 space-y-4">
          <slot name="right-sidebar" />
        </div>
      </div>
    </div>
  </div>
</template>