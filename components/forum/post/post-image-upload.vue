<script lang="ts" setup>
defineProps<{
  imagePreview: string | null;
}>();

defineEmits(['upload-image', 'trigger-image', 'remove-image']);
</script>

<template>
  <div class="space-y-2 mb-4">
    <label class="label text-base-neutral">Upload Image</label>
    <div v-if="!imagePreview" class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <i class="i-lucide-upload h-12 w-12 mx-auto text-gray-400 mb-4" />
      <p class="text-muted-foreground mb-4">Drag and drop an image, or click to browse</p>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        class="hidden"
        @change="(event) => $emit('upload-image', event)"
      >
      <button
        class="btn btn-outline"
        @click="$emit('trigger-image')"
      >
        Choose File
      </button>
    </div>
    <div v-else class="relative">
      <div class="relative w-full h-64 rounded-lg overflow-hidden">
        <img
          :src="imagePreview || '/svg/placeholder.svg'"
          alt="Preview"
          class="object-cover w-full h-full"
        >
      </div>
      <button
        class="absolute top-2 right-2 btn btn-sm btn-error"
        @click="$emit('remove-image')"
      >
        <i class="h-4 w-4 i-lucide-x" />
      </button>
    </div>
  </div>
</template>
