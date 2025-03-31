<script lang="ts" setup>
const props = defineProps<{
  avatarUrl: string
}>()

const client = useSupabaseClient();
const image = ref<string | null>(null);

const downloadImage = async () => {
  try {
    if(props.avatarUrl) {
      const { data, error } = await client.storage.from('avatars').download(props.avatarUrl!)
      if (error) throw error
      image.value = URL.createObjectURL(data)
    }
  } catch (error) {
    if(error instanceof Error){
      throw new Error('Failed to download user avatar')
    }
  }
}

onMounted(()=> {
  downloadImage()
})
</script>

<template>
  <div class="avatar">
    <div class="w-8 h-8 rounded-full">
      <img v-if="avatarUrl" :src='image!' alt="user avatar">
      <i v-else class="i-ri-account-circle-fill text-2xl"/>
    </div>
  </div>
</template>
