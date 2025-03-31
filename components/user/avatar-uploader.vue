<template>
  <div class="text-center border border-dashed border-base-300 relative">
    <div class="avatar py-2">
      <div v-if="src" class="w-24 rounded-full">
        <img :src="src" alt="profile image">
      </div>
      <div v-else class="w-24 rounded bg-base-100 relative">
        <span class="i-ic-sharp-account-circle text-8xl bg-gray-300"/>
        <label class="absolute bottom-1 right-1 cursor-pointer" for="avatar-upload">
          <span class="i-ph-camera text-2xl"/>
        </label>
        <input
        id="avatar-upload"
        type="file"
        class="hidden cursor-pointer"
        :disabled="uploading"
        accept="image/*"
        @change="handleFileChange"
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  src: string
  uploading: boolean
}>()

const emit = defineEmits<{
  (e: 'upload', file: File): void
}>();

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    const fileExt = file.name.split('.').pop()?.toLowerCase();

    if (!fileExt || !['jpg', 'jpeg', 'png', 'gif'].includes(fileExt)) {
      alert('Unsupported file type. Please upload an image.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert('File size exceeds 5MB limit. Please choose a smaller file.');
      return;
    }

    emit('upload', file);
  }
};


// const handleFileChange = (event: Event) => {
//   const target = event.target as HTMLInputElement
//   if (target.files && target.files.length > 0) {
//     emit('upload', target.files[0])
//   }
// }
</script>