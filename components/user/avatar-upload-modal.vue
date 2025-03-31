<template>
  <form @submit.prevent="handleSave">
    <AvatarUploader
      :src="src"
      :uploading="uploading"
      @upload="handleFileSelect"
    />
    <div class="flex gap-x-2 mt-8 text-sm justify-end">
      <button 
      class="bg-base-300 p-2 rounded-full capitalize cursor-pointer"
      type="button" 
      @click.prevent="store.closeModal" 
      >
        cancel
      </button>
      <button 
      :disabled="uploading" 
      type="submit" 
      class="bg-blue-600 p-2 diabled:bg-base-300 flex gap-x-2 items-center rounded-full capitalize text-white cursor-pointer"
      >
        <i v-show="uploading" class="loading loading-spinner"/>
        save
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, toRefs } from 'vue';
import AvatarUploader from './avatar-uploader.vue';
import useModalStore from '../../stores/useModalStore';

const props = defineProps<{ path: string }>()
const { path } = toRefs(props)

defineEmits<{
  (e: 'update:path', path: string): void
  (e: 'upload'): void
}>()

const store = useModalStore()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const src = ref('');
 
const handleFileSelect = (file: File) => {
  selectedFile.value = file;
  src.value = URL.createObjectURL(selectedFile.value);
}

const downloadImage = async () => {
  try {
    const { data, error } = await supabase.storage.from('avatars').download(path.value)
    if (error) throw error
    src.value = URL.createObjectURL(data)
  } catch (error) {
    if(error instanceof Error) {
      throw new Error('Error downloading image ' + error.message)
    }
  }
}

const uploadAvatar = async () => {
  if (!selectedFile.value) {
    throw new Error('You must select an image to upload.')
  }

  const file = selectedFile.value;
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  if (!fileExt || !['jpg', 'jpeg', 'png', 'gif'].includes(fileExt)) {
    throw new Error('Unsupported file type. Please upload a valid image.');
  }

  const fileName = `${user.value?.id}/${Date.now()}-${file.name}`
  const filePath = `${fileName}`

  const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

  if (uploadError) throw new Error(uploadError.message)

  return filePath
}

const saveFileMetadata = async(filePath: string) => {
  const { error } = await $fetch<{ error?: { message: string } }>('/api/user',  { method: 'PATCH', body: { avatar_url: filePath } })
  if (error) throw new Error(error.message)
}

const handleSave = async () => {
  try {
    uploading.value = true
    const filePath = await uploadAvatar();
    await saveFileMetadata(filePath);

    store.closeModal();

  } catch (error) {
    store.closeModal();
    if(error instanceof Error) {
      throw new Error(error.message)
    }
  } finally {
    uploading.value = false
  }

}

watch(path, downloadImage, { immediate: true })
</script>