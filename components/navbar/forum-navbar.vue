<script lang="ts" setup>
import { useToast } from 'vue-toastification';
import useModalStore from '~/stores/useModalStore';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { Database, Tables } from '~/types/database.types';

const route = useRoute();
const toast = useToast();
const router = useRouter();
const avatar_url = ref('');
const store = useModalStore();
const user =  useSupabaseUser();
const config = useRuntimeConfig();
const hasNotification = ref(false);
const profile = ref<Tables<'profiles'>>();
const channelName = 'notification_channel';
const searchTerm = ref(route.query.q || '');
const client = useSupabaseClient<Database>();
const realTimeChannel: RealtimeChannel = client.channel(channelName);

const isOnline = ref(false)
const isMobile = ref(false)
const emit = defineEmits(['toggle-sidebar']);

const toggleSidebar = () => {
  emit('toggle-sidebar');
}

// Fetch initial online status
const fetchOnlineStatus = async () => {
  if (!user.value) return
  
  const { data } = await client
    .from('user_presence')
    .select('status')
    .eq('profile_id', user.value?.id)
    .single()
    
  isOnline.value = data?.status === 'online'
}

// Subscribe to status changes
const subscribeToStatus = () => {
  if (!user.value) return
  
  client
    .channel('my_status')
    .on('postgres_changes', 
      {
        event: '*',
        schema: 'public',
        table: 'user_presence',
        filter: `profile_id=eq.${user.value?.id}`
      } as any, // Add `as any` to bypass type mismatch
      (payload: { new: Tables<'user_presence'> }) => {
        isOnline.value = payload.new.status === 'online';
      }
    )
    .subscribe()
}

async function signOut() {
  const { error } = await client.auth.signOut()
  throw new Error(error?.message)
}

const { data, error } = await useFetch('/api/user');
if(error.value !== null) throw new Error(error.value.message);

profile.value = <Tables<'profiles'>>data.value?.data!;

const theme = ref<'light' | 'dark'>(
  import.meta.client && localStorage.getItem('theme')
    ? (localStorage.getItem('theme') as 'light' | 'dark')
    : 'light'
)

const isToggled = ref<boolean>(
  import.meta.client && localStorage.getItem('toggleState')
    ? localStorage.getItem('toggleState') === 'true'
    : false
)

const toggleTheme = (e: Event) => {
  const target = e.target as HTMLInputElement
  isToggled.value = target.checked
  theme.value = target.checked ? 'dark' : 'light'
}

watchEffect(() => {
  if (import.meta.client) {
    localStorage.setItem('theme', theme.value)
    localStorage.setItem('toggleState', isToggled.value.toString())
    const htmlElement = document.querySelector('html')
    if (htmlElement) {
      htmlElement.setAttribute('data-theme', theme.value)
    }
  }
})


const downloadImage = async () => {
  try {
    if(profile.value?.avatar_url) {
      const { data, error } = await client.storage.from('avatars').download(profile.value?.avatar_url!)
      if (error) throw error
      avatar_url.value = URL.createObjectURL(data)
    }
  } catch (error) {
    if(error instanceof Error){
      toast.error(error.message)
    }
  }
}

onMounted(()=> {
  downloadImage()
  fetchOnlineStatus()
  subscribeToStatus()
})

function openNotificationModal() {
  store.openModal({ 
    component: markRaw(defineAsyncComponent(() => import('~/components/notification/notification-panel.vue') )), 
    props: {classes: "fixed w-96 top-16 right-60 p-4 h-auto"}
  });
}

function openChatModal() {
  store.openModal({ 
    component: markRaw(defineAsyncComponent(() => import('~/components/chat/chat-panel.vue') )), 
    props: {classes: "fixed w-full max-w-2xl top-36 right-24 rounded-md h-[500px]"}
  });
}

const onInsert = (payload: { new: Tables<'notifications'>; }) => {
  // Process inserted data (e.g., update component, store the data)
  payload.new ? hasNotification.value : null
}

realTimeChannel.on('postgres_changes', {
  event: 'INSERT', // Subscribe to insert events
  schema: 'public', // Specify schema (optional)
  table: 'notification', // Specify table (optional)
}, onInsert)

realTimeChannel.subscribe() // Start subscribing to the channel

onBeforeUnmount(() => {
  realTimeChannel.unsubscribe()
})

const updateQuery = () => {
  router.replace({
    path: '/search',
    query: {
      q: searchTerm.value,
    }
  })
}

const handleSearch = async () => {
  updateQuery()
  await $fetch(`/api/search/`, { query: { q: searchTerm.value } })
}

// Function to check screen size
const checkIsMobile = () => {
  isMobile.value = window.innerWidth < 768; // 768px is typically the breakpoint for mobile
}

// Set up event listener for window resize
onMounted(() => {
  checkIsMobile(); // Check on mount
  window.addEventListener('resize', checkIsMobile); // Update on resize
});

// Clean up event listener
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkIsMobile);
});
</script>

<template>
<div class="navbar items-center max-w-full w-[1350px] bg-base-100 fixed top-0 z-50 border-b border-base-300">
  <div class="navbar-start items-center">
    <div class="dropdown">
      <button class="lg:hidden toggle-sidebar-button" @click="toggleSidebar">
        <i class="text-2xl i-ri-menu-line mt-2"/>
      </button> 
    </div>
    <NuxtLink to="/" class="ml-4">
      <img src="/svg/markins-logo.svg" class="h-8 hidden md:block"/>
      <img src="/svg/markins.svg" class="h-7 md:hidden"/>
    </NuxtLink>
  </div>
  <div class="navbar-center hidden lg:flex w-[600px]">
    <label class="input bg-base-300 border-base-300 input-bordered flex items-center gap-2 w-full max-w-[30rem]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        class="h-5 w-5 opacity-70">
        <path
          fill-rule="evenodd"
          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
          clip-rule="evenodd" 
        />
      </svg>
      <input 
      v-model="searchTerm" 
      type="text" 
      class="grow bg-base-300 outline-none text-md p-1" 
      placeholder="Search posts..." 
      @change="handleSearch" 
      >
    </label>
  </div>
  <div class="navbar-end">
    <div v-if="user" class="flex items-center content-center justify-between gap-x-1">
    <div className="tooltip tooltip-bottom hidden md:block" data-tip="notification">
      <button class="avatar placeholder relative cursor-pointer hidden md:block" @click="openNotificationModal" >
        <span v-show="hasNotification" class="w-2 h-2 bg-red-600 absolute top-1 right-1 z-50 rounded-full" />
        <div class="rounded-full w-8">
          <span class="text-2xl i-ph-bell" />
        </div>
      </button>
    </div>
    <div className="tooltip tooltip-bottom hidden md:block" data-tip="chat">
      <button class="avatar placeholder cursor-pointer hidden md:block" @click="openChatModal" >
        <div class="rounded-full w-8">
          <span class="text-2xl i-ph-chat-circle-dots" />
        </div>
      </button>
    </div>
    <div className="tooltip tooltip-bottom" data-tip="ask question">
      <NuxtLink to="/post/create" class="avatar placeholder flex bg-base-200 rounded-full p-1.5">
        <i class="text-2xl i-ri-add-line" />
        Create
      </NuxtLink>
    </div>
   <ul v-if="!isMobile" class="menu menu-horizontal px-1 z-50">
      <li class="mr-8">
        <details>
          <summary>
            <div class="avatar indicator">
              <div v-if="profile?.avatar_url" class="w-6 h-6">
                <span v-if="isOnline" class="indicator-item status status-success top-5 right-1"></span>
                <span v-else class="indicator-item status status-neutral top-5 right-1"></span>
                <img class="h-6 w-6 flex-none rounded-full bg-gray-50" :src="avatar_url" alt="user's avatar" >
              </div>
              <div v-else>
                <span class="i-ri-account-circle-fill w-6 h-6 bg-gray-300" />
              </div>
            </div>
            <span class="hidden md:block">{{ profile?.username }}</span>
          </summary>
          <ul class="p-2 rounded-sm w-48">
            <li v-show="user"><NuxtLink :to="`/profile/${profile?.username}`">Profile</NuxtLink></li>
            <li class="w-full">
              <a class="w-full flex justify-between">
                Dark mode 
                <label class="swap swap-rotate">
                  <input type="checkbox" @change="toggleTheme">
                  <svg class="swap-on fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
                  </svg>
                  <svg class="swap-off fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
                  </svg>
                </label>
              </a> 
            </li>
            <li>
              <a v-if="user" @click="signOut"><span class="i-mdi-logout text-lg" />Sign out</a>
              <NuxtLink v-else to="/account/signin"><span class="i-mdi-login text-lg"/>Sign in</NuxtLink>
            </li>
          </ul>
        </details>
      </li>
    </ul>
    <NuxtLink v-else class="mt-1 indicator" :to="`/profile/${profile?.username}`" >
      <div class="avatar">
        <div v-if="profile?.avatar_url" class="w-7 h-7">
          <span v-if="isOnline" class="indicator-item status status-success top-5 right-1"></span>
          <span v-else class="indicator-item status status-neutral top-5 right-1"></span>
          <img class="h-8 w-8 rounded-full bg-gray-50" :src="avatar_url" alt="user's avatar" >
        </div>
        <div v-else>
          <span class="i-ri-account-circle-fill w-6 h-6 bg-gray-300" />
        </div>
      </div>
    </NuxtLink>
  </div>
  <div v-else>
    <NuxtLink to="/account/signin" class="btn bg-[seagreen] text-white rounded-3xl hover:bg-[#297d4e]">
      Login
    </NuxtLink>
  </div>
  </div>
</div>
</template>

<style lang="css" scoped>

.input{
  height: 2.5rem;
}

.navbar-start {
  align-items: center;
}
</style>