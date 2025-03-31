<template>
  <form class="form-widget" @submit.prevent="updateProfile">
    <Avatar v-model:path="profile.avatar_url" @upload="updateProfile"/>
    <div>
      <label for="username" class="block">Display name</label>
      <input id="username" v-model="profile.username" class="w-full p-1 border border-gray-300"  type="text" >
    </div>
    <div>
      <label for="email" class="block mt-3">Email</label>
      <input id="email" class="w-full p-1" type="text" :value="user?.email" disabled >
    </div>
    <div>
      <label for="about_me" class="block mt-3">About me</label>
      <Editor id="about_me" :payload="profile.about_me!" @custom-change="updateChange" />
    </div>

    <div class="my-5">
      <input
        type="submit"
        class="bg-[seagreen] text-white py-2 px-4 rounded-lg cursor-pointer block"
        :value="loading ? 'Loading ...' : 'Update'"
        :disabled="loading"
      >
    </div>

  </form>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const router = useRouter()

const loading = ref(true)

type Profile = {
  username: string | null;
  avatar_url: string | null;
  about_me: string | null;
}

const profile = reactive<Profile>({
  username: '',
  avatar_url: '',
  about_me: '',
})

const updateChange = (target: string) => {
  profile.about_me = target
}

onMounted(async() => {
  try {

  loading.value = true

  const response = await $fetch('/api/user');

  const data = response?.data;

  if (data) {
    profile.username = data.username;
    profile.avatar_url = data.avatar_url;
  }

  } catch (error) {
    if(error instanceof Error) {
      throw new Error(error.message)
    }
  }finally{
    loading.value = false
  }
})

async function updateProfile() {
  try {
    loading.value = true

    const updates = {
      id: user.value!.id,
      username: profile.username,
      avatar_url: profile.avatar_url,
      about_me: profile.about_me
    }

    await $fetch('/api/user', { method: 'PATCH', body: { updates }})
  } catch (error) {
    if(error instanceof Error) {
      alert(error.message)
    }
  } finally {
    loading.value = false
    router.back()
  }
}


</script>

