<script lang="ts" setup>
defineProps<{
  bannerPreview: string;
  iconOptions: string[];
  selectedIcon: string;
}>();

const emit = defineEmits<{
  'update:bannerPreview': [value: string];
  'update:selectedIcon': [value: string];
  'banner-image': [value: File];
}>();

const bannerUploadInput = ref<HTMLInputElement>();

const handleBannerUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    emit('banner-image', file)
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      emit('update:bannerPreview', result);
    };
    reader.readAsDataURL(file);
  }
};

const triggerBannerUpload = () => {
  bannerUploadInput.value?.click();
};

const clearBanner = () => {
  emit('update:bannerPreview', '');
  if (bannerUploadInput.value) {
    bannerUploadInput.value.value = '';
  }
};

const selectIcon = (icon: string) => {
  emit('update:selectedIcon', icon);
};
</script>

<template>
  <div class="shadow bg-base-100 border p-4 border-gray-300 dark:border-base-100">          
    <div class="flex items-center font-medium mb-4">
      <i class="i-lucide-palette h-5 w-5 mr-2 text-[#297D4E]" />
      Appearance
    </div> 
    <div class="space-y-4">
      <div class="space-y-2">
        <label class="label">Community Icon</label>
        <div class="grid grid-cols-8 gap-2">
          <button
            v-for="icon in iconOptions"
            :key="icon"
            class="btn p-3 text-2xl rounded-lg border-2 transition-colors"
            :class="
              selectedIcon === icon
                ? 'border-[#297D4E] bg-[#297D4E]/10'
                : 'border-gray-200 hover:border-gray-300'
            "
            @click="selectIcon(icon)"
          >
            {{ icon }}
          </button>
        </div>
      </div>
      <div class="space-y-2">
        <label class="label">Banner Image (optional)</label>
        <div v-if="!bannerPreview" class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <i class="i-lucide-upload h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p class="text-gray-500 mb-4">Upload a banner image (1200x300px recommended)</p>
          <input
            id="banner-upload"
            ref="bannerUploadInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleBannerUpload"
          >
          <button class="btn btn-outline text-gray-500 border-gray-300" @click="triggerBannerUpload">
            Choose File
          </button>
        </div>
        <div v-else class="relative">
          <div class="relative w-full h-32 rounded-lg overflow-hidden">
            <img
              :src="bannerPreview"
              alt="Banner preview"
              class="object-cover w-full h-full"
            >
          </div>
          <button
            class="btn btn-error absolute top-2 right-2"
            @click="clearBanner"
          >
            <i class="i-lucide-x h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>