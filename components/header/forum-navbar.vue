<template>
  <header class="sticky top-0 z-50 w-full border-b border-gray-300 dark:border-base-100 bg-base-100 backdrop-blur-md">
    <div class="flex h-16 items-center justify-between px-2 md:px-4">
      <NuxtLink to="/posts" class="flex items-center space-x-2">
        <img src="/svg/markins-logo.svg" class="h-8 hidden md:block" >
        <img src="/svg/markins.svg" class="w-8 md:hidden" >
      </NuxtLink>

      <label class="input relative focus:outline-none outline-none focus:ring-0 ring-0 md:w-full max-w-36 mx-2 md:max-w-lg">
        <i class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 i-lucide-search" />
        <input
          v-model="searchQuery"
          placeholder="Search posts, communities..."
          class="pl-4 md:pl-8"
        >
      </label>

      <div class="flex items-center">
        <!-- dynamic contents -->
        <div v-show="auth.isAuthenticated">
          <slot name="dynamic-content" />
        </div>

        <NuxtLink v-if="!auth.isAuthenticated" to="/account/signin" class="btn bt-m p-2 bg-[#297D4E] text-white hover:bg-[#1f5a37]">
          Sign In
        </NuxtLink>
          <div v-else class="dropdown dropdown-bottom dropdown-center">
            <div tabindex="0" role="button" class="btn bg-ghost border-none bg-transparent hover:shadow-none shadow-none hover:bg-transparent md:m-1">
              <div v-if="auth.profile?.avatar_url" class="avatar">
                <div class="w-7 rounded-full">
                  <img :src="auth.profile?.avatar_url" class="rounded-full" alt="User Avatar">
                </div>
              </div>
              <div v-else class="avatar avatar-placeholder">
                <div class="bg-gray-300 text-neutral-content w-7 rounded-full">
                  <span class="text-lg">{{ auth.profile?.display_name?.split(' ').map(n => n[0]).join('') }}</span>
                </div>
              </div>
            </div>
            <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-48 p-2 shadow-sm">
              <li>
                <NuxtLink
                :to="`/user/${profile?.username}`"
                class="flex items-center"
                >
                  <i class="i-lucide-user w-4 h-4" />
                  Profile
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                :to="{
                  path: '/settings/user',
                  query: { username: profile?.username }
                }"
                class="flex items-center"
                >
                  <i class="i-lucide-settings w-4 h-4"/>
                  Settings
                </NuxtLink>
              </li>
              <li>
                <a 
                class="flex items-center"
                @click.prevent="toggleTheme"
                >
                  <i class="w-4 h-4" :class="theme == 'light'? 'i-lucide-moon' : 'i-lucide-sun'"/>
                  {{theme == 'light' ? 'Dark mode' : 'Light mode'}}
                </a>
              </li>
              <li>
                <a class="flex items-center">
                  <i class="i-lucide-log-in w-4 h-4" />
                  Logout
                </a>
              </li>
            </ul>
          </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { Profile } from '~/types/utility';
import { useTheme } from '~/composables/useTheme';

const { theme, toggleTheme, initTheme } = useTheme()

const auth  = useAuthStore();
const user = useSupabaseUser();

const searchQuery = ref('');
const error = ref<unknown | null>(null);
const profile = ref<Profile | null>(null);

onMounted(async () => {
  if(!user.value){
    return;
  }
  
  try {
    const response = await $fetch('/api/user');
    profile.value = response?.data as unknown as Profile ?? null;
  } catch (err) {
    error.value = err;
  }
});


onMounted(() => {
  initTheme()
})
</script>