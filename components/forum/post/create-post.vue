<script lang="ts" setup>
import type { Tables } from '~/types/database.types';

const router = useRouter()
const avatar_url = ref('')
const config = useRuntimeConfig()
const props = defineProps<({
 profile: Tables<'profiles'>
})>()

avatar_url.value = config.public.apiUrl + '/storage/v1/object/public/avatars/' + props.profile?.avatar_url;

//  const downloadImage = async () => {
//   try {
//     const { data, error } = await client.storage.from('avatars').download(props.profile.avatar_url)
//     if(data){
//       avatar_url.value = URL.createObjectURL(data)
//     }
//     if (error) console.log(error)
//   } catch (error) {
//     if(error instanceof Error){
//       console.error('Error downloading image: ', error.message)
//     }
//   }
// }

// onMounted(() => {
//   downloadImage()
// });
</script>

<template>
  <div v-if="profile" class="flex justify-center content-center bg-base-100 border border-slate-300">
    <NuxtLink :to="`/profile/${profile.id}`" class="mt-2">  
      <div v-if="profile.avatar_url">
        <img class="h-12 w-12 rounded-full flex-none bg-gray-50 ml-2 object-cover" :src="avatar_url" alt="user's avatar" >
      </div>
      <div v-else>
        <span class="i-ri-account-circle-fill w-12 h-12 bg-gray-300" />
      </div>
    </NuxtLink>
    <div class="flex-1 p-2">
      <input
      placeholder="Create Post" 
      class="align-center w-full hover:border-blue-300 focus:outline-none bg-base-200 border border-gray-200 input-md py-4 flex"
      @click="router.push('/post/create')" 
      >
    </div>
    <NuxtLink  to="/post/create" class="btn-ghost btn p-2 rounded-none mt-2">
      <span class="i-ph-image-square-light text-2xl bg-slate-400"/>
    </NuxtLink>
    <NuxtLink  to="/post/create" class="btn-ghost btn p-2 rounded-none mt-2 mx-2">
      <span class="i-ph-link-light text-2xl bg-gray-400"/>
    </NuxtLink>
  </div>
  
  <div v-else class="flex justify-center content-center bg-base-100 border border-slate-300">
    <NuxtLink to="/account/signin" class="mt-2">  
      <div>
        <span class="i-ri-account-circle-fill w-12 h-12 bg-gray-300"/>
      </div>
    </NuxtLink>
    <div class="flex-1 p-2">
      <input
      placeholder="Create Post" 
      class="align-center w-full hover:border-blue-300 focus:outline-none bg-base-200 border border-gray-200 input-md py-4 flex"
      @click="router.push('/account/signin')" 
      >
    </div>
    <NuxtLink  to="/post/create" class="btn-ghost btn p-2 rounded-none mt-2">
      <span class="i-ph-image-square-light text-2xl bg-slate-400"/>
    </NuxtLink>
    <NuxtLink  to="/post/create" class="btn-ghost btn p-2 rounded-none mt-2 mx-2">
      <span class="i-ph-link-light text-2xl bg-gray-400"/>
    </NuxtLink>
  </div>

</template>

<style scoped>
body{
  background: red;
}
</style>