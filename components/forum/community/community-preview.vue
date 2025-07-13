<script lang="ts" setup>
// Define the props that will be passed from parent
defineProps<{
  category: string;
  description: string;
  displayName: string;
  selectedIcon: string;
  communityName: string;
  bannerPreview: string;
  communityType: 'public' | 'restricted' | 'private';
  categories: Array<{ id: string; name: string; icon: string }>;
}>();
</script>

<template>
  <div class="shadow bg-base-100 border p-4 border-gray-300 dark:border-base-100">     
    <div class="text-lg flex items-center mb-4 font-medium">
      <i class="i-lucide-eye h-5 w-5 mr-2 text-[#297D4E]" />
      Preview
    </div>
    <div>
      <div class="space-y-4">
        <div class="flex items-center space-x-3">
          <div class="text-2xl">{{ selectedIcon || "🔬" }}</div>
          <div>
            <h3 class="font-semibold">{{ communityName ? `m/${communityName}` : "m/yourcommunity" }}</h3>
            <p class="text-sm text-gray-500">{{ displayName || "Your Community" }}</p>
          </div>
        </div>

        <div v-if="bannerPreview" class="relative w-full h-20 rounded-lg overflow-hidden">
          <img
            :src="bannerPreview"
            alt="Banner preview"
            class="object-cover w-full h-full"
          >
        </div>

        <p class="text-sm text-base-content">
          {{ description || "Your community description will appear here" }}
        </p>

        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span>Type</span>
            <div class="badge capitalize">
              {{ communityType }}
            </div>
          </div>
          <div class="flex justify-between">
            <span>Category</span>
            <span class="text-gray-500">
              {{ category ? categories.find((c) => c.id === category)?.name : "Not selected" }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>