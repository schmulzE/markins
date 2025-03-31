<script lang="ts" setup>
import type { Database, Tables } from 'types/database.types';
import type { RealtimeChannel } from '@supabase/supabase-js';

const client = useSupabaseClient<Database>();
const notifications = ref<Tables<'notifications'>[]>([])
let subscription : RealtimeChannel;

const fetchNotifications = async () => {
  const { data, error } = await client
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    throw new Error(`Error fetching notifications: ${error.message}`)
  } else {
    notifications.value = data
  }
}

onMounted(() => {
  fetchNotifications()

  subscription = client
    .channel('notifications')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload: { new: Tables<'notifications'>; }) => {
      notifications.value.unshift(payload.new)
    })
    .subscribe()
})

onUnmounted(() => {
  if (subscription) client.removeChannel(subscription)
})
</script>

<template>
  <div class="text-content text-accent-color">
    <section class="flex justify-between items-center text-sm mb-4">
      <h3 class="text-accent-color text-md font-sembold">Notifications</h3>
      <i class="i-ic-mail text-xl" />
    </section>
    <section v-if="notifications" class="h-96">
      <NotificationList :notifications="notifications"/>
    </section>
    <div v-else>
      <section class="flex flex-col text-center justify-center content-center my-10 text-accent-color">
        <img src="/svg/empty-amico.svg" class="w-36 h-96 mx-auto" >
        <h3 class="font-bold text-lg">You don’t have any activity yet</h3>
        <p class="px-6">That’s ok, maybe you just need the right inspiration. Try posting in <a href="#" class="text-blue-500"><b>sciences</b></a> , a popular community for discussion.</p>
      </section>
      <section class="flex justify-center content-center">
        <NuxtLink to="/m/GeneralScience" class="bg-blue-500 hover:bg-blue-400 p-2 text-white capitalize rounded-full">visit sciences</NuxtLink>
      </section>
    </div>
  </div>
</template>
