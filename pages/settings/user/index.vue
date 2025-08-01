<script setup lang="ts">
import { ref } from 'vue';
import BaseLayout from '~/layouts/base.vue';
import { useToast } from 'vue-toastification';
import type { Profile } from '~/types/utility';
import { useSupabaseClient, useSupabaseUser } from '#imports';
import ForumNavbar from '~/components/header/forum-navbar.vue';
import { useImageHandler } from '~/composables/useImageHandler';

const route = useRoute();
const toast = useToast();
const router = useRouter();
const user = useSupabaseUser();
const supabase = useSupabaseClient();

const avatarUrl = ref("");
const isLoading = ref(false);
const avatarFile = ref<File | null>(null);
const username = route.query?.username || '';
const saveStatus = ref<"idle" | "saving" | "saved" | "error">("idle");

const { getImageUrl, uploadImage, deleteImage } = useImageHandler();

const { data: profile, error } = await useAsyncData(
  'profile', 
  async () => {
    const response = await $fetch<{data : Profile}>(`/api/user/${username}`);
    return response?.data;
  }
);

if (error.value) {
  toast.error('An error occurred while trying to fetch this user');
}

const triggerAvatarUpload = () => {
  const el = document.getElementById('avatar-upload') as HTMLInputElement | null
  el?.click()
}

const onFileChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file || !user.value?.id) return

  const oldAvatarPath = avatarUrl.value ?? ''

  try {
    const path = await uploadImage(file, 'avatars', user.value.id)
    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: path })
      .eq('id', user.value.id)

    if (error) throw error
    avatarUrl.value = path

    // Optional: cleanup old avatar if from Supabase
    if (!oldAvatarPath.startsWith('http')) {
      await deleteImage('avatars', oldAvatarPath)
    }
  } catch (err) {
    console.error(err)
  }
}

// Send profile data to backend server
const handleSave = async () => {
  if (!profile.value) return;

  isLoading.value = true;
  saveStatus.value = "saving";

  try {
    // Send updated profile to backend (adjust endpoint as needed)
    await $fetch(`/api/user/update/${profile.value.id}`, {
      method: 'PATCH',
      body: {
        display_name: profile.value.display_name,
        bio: profile.value.bio,
        location: profile.value.location,
        website: profile.value.website,
        avatar_url: avatarUrl.value || profile.value.avatar_url,
      },
    });
    // Update local profile state
    saveStatus.value = "saved";
    toast.success('Profile updated successfully');
    router.push(`/user/${profile.value.username}`);

  } catch(error) {
    saveStatus.value = "error";
    isLoading.value = false;
    console.error('Failed to update profile:', error);
    toast.error('Failed to update profile');
  }
  isLoading.value = false;
};
</script>

<template>
  <BaseLayout>
    <template #header>
      <ForumNavbar>
        <template  #dynamic-content>
          <nav class="flex items-center space-x-2 md:space-x-4">
            <NuxtLink :to="`/user/${profile?.username}`">
            <button class="btn btn-outline dark:border-base-300">
              <i class="i-lucide-eye h-4 w-4 md:mr-2" />
              <span class="hidden md:block">View Profile</span>
            </button>
          </NuxtLink>
          <button 
            class="bg-[#297D4E] btn text-base-100 hover:bg-[#1f5a37]" 
            :disabled="isLoading"
            @click="handleSave"
          >
            <span v-if="saveStatus === 'saving'" class="animate-spin rounded-full h-4 w-4 border-b-2 border-base-100 md:mr-2" />
            <i v-else-if="saveStatus === 'saved'" class="h-4 w-4 md:mr-2 i-lucide-check-circle" />
            <i v-else-if="saveStatus === 'idle'" class="h-4 w-4 md:mr-2 i-lucide-save" />
            <span class="hidden md:block">{{ saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes' }}</span>
          </button>
          </nav>
        </template>
      </ForumNavbar>
    </template>
    <template #main>
      <div class=" px-4 py-6">
      <div class="max-w-4xl mx-auto space-y-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold mb-2">Account Settings</h1>
          <p class="text-gray-500">Manage your profile, privacy, and account preferences</p>
        </div>        
          <!-- Profile Settings -->
           <div class="shadow card bg-base-100 border p-4 border-gray-300 dark:border-base-100 space-y-4">
              <div class="text-2xl font-medium">Profile Pictures</div>    
              <div class="space-y-6">
                <!-- Avatar -->
                <div class="space-y-4">
                  <label class="label label-sm">Profile Picture</label>
                  <div class="flex items-center space-x-4">
                    <div class="">
                      <div v-if="profile?.avatar_url" class="avatar">
                        <div class="w-24 rounded-full">
                          <img :src="getImageUrl(avatarUrl, 'avatars') || profile?.avatar_url" class="rounded-full" alt="User Avatar">
                        </div>
                      </div>
                      <div v-else class="avatar avatar-placeholder">
                        <div class="bg-gray-300 text-neutral-content w-24 rounded-full">
                          <span class="text-3xl">{{ profile?.display_name?.split(' ').map(n => n[0]).join('') }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="space-y-2">
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="onFileChange"
                      >
                      <button
                        class="btn btn-outline border-gray-300 text-gray-500"
                        @click="triggerAvatarUpload"
                      >
                        <i class="i-lucide-camera h-4 w-4 mr-2" />
                        Change Avatar
                      </button>
                      <button
                        v-if="avatarUrl"
                        class="btn btn-ghost"
                        @click="() => {
                          avatarFile = null
                          avatarUrl = ''
                        }"
                      >
                        <i class="i-lucide-x h-4 w-4 mr-2" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="shadow card bg-base-100 border p-4 border-gray-300 dark:border-base-100 space-y-4">
              <div class="text-2xl font-medium">Basic Information</div>
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="label">Username</label>
                    <input class="input w-full block" :value="profile?.username" disabled >
                    <p class="text-xs text-gray-500">Username cannot be changed</p>
                  </div>
                  <div class="space-y-2">
                    <label class="label">Display Name</label>
                    <input
                      v-model="profile!.display_name"
                      class="input w-full block"
                      :disabled="!profile"
                    >
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="label">Email</label>
                  <input
                    type="email"
                    class="input w-full block"
                    :value="user?.email"
                    disabled
                  >
                  <p class="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div class="space-y-2">
                  <label class="label">Bio</label>
                  <textarea
                    v-model="profile!.bio"
                    rows="4"
                    class="textarea block w-full"
                    placeholder="Tell us about yourself..."
                  />
                  <p class="text-xs text-gray-500">{{ profile?.bio?.length || 0 }}/500 characters</p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                    <label class="label">Location</label>
                    <label class="relative input block">
                      <i class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 i-lucide-map-pin" />
                      <input
                        v-model="profile!.location"
                        placeholder="City, Country"
                        class="pl-8"
                      >
                    </label>
         
                  </div>
                  <div class="space-y-2">
                    <label class="label">Website</label>
                    <label class="relative input block">
                      <i class="i-lucide-globe absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <input
                      v-model="profile!.website"
                      class="pl-8"
                      placeholder="https://yourwebsite.com"
                      >
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="shadow card bg-base-100 border p-4 border-gray-300 dark:border-base-100 space-y-4">
              <div class="font-medium text-2xl">Account Stats</div>
              <div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-[#297D4E]">{{ profile?.karma!.toLocaleString() }}</div>
                    <div class="text-sm text-gray-500">Total Karma</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold">{{ profile?.post_karma!.toLocaleString() }}</div>
                    <div class="text-sm text-gray-500">Post Karma</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold">{{ profile?.comment_karma!.toLocaleString() }}</div>
                    <div class="text-sm text-gray-500">Comment Karma</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold">{{ profile?.badges!.length }}</div>
                    <div class="text-sm text-gray-500">Badges</div>
                  </div>
                </div>

                <div class="mt-4 space-y-4">
                  <label class="mb-2 block">Badges</label>
                  <div class="flex flex-wrap gap-2">
                    <div v-for="(badge, index) in profile?.badges" :key="index" class="badge bg-[#297D4E]/10 text-[#297D4E]">
                      <i class="i-lucide-award h-3 w-3 mr-1" />
                      {{ badge }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
      </div>
    </div>
    </template>
  </BaseLayout>
</template>