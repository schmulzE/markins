<template>
  <div class="flex flex-1 flex-col">
    <div class="h-96 overflow-y-auto">
      <ChatMessages 
      v-for="message in messages"
      :key="message.id"
      :message="message"
      />
    </div>
    <div class=" h-full flex justify-between items-center gap-x-2 px-2 pb-2">
      <input 
      v-model="newMessage" 
      class="input input-md ring-2 ring-white w-full rounded-full mt-2 bg-base-300 " 
      placeholder="Type messages here..."
      type="text" 
      @keyup.enter="sendMessage" 
      >
      <button 
      :disabled="!newMessage" 
      class="text-blue-600 disabled:text-gray-500 mt-2"
      @click="sendMessage" 
      >
        <i class="i-ic-send text-2xl"/>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useToast } from 'vue-toastification';
// import type { RealtimeChannel } from '@supabase/supabase-js';
import type { Database, Tables } from '~/types/database.types';

const supabase = useSupabaseClient<Database>();

const props = defineProps<{
  currentUser: string;
  chatId: string;
}>();

const toast = useToast();
const newMessage = ref('');
const messages = ref<Tables<'messages'>[]>();


const loadMessages = async() => {
  try {
    const response = await $fetch(`/api/messages/${props.chatId}`, { method: 'GET' })
    const data = response?.data;

    messages.value = data;
  } catch (error) {
    if(error instanceof Error) {
      toast.error(error.message);
    }
  }
};

const sendMessage = async() => {
  try {
    await $fetch(`/api/messages`, {
      method: 'POST',
      body: {
        profile_id: props.currentUser,
        chat_id: props.chatId,
        content: newMessage.value,
      },
    })

  } catch (error) {
    if(error instanceof Error) {
      toast.error(error.message);
    }
  } finally {
    await loadMessages()
    newMessage.value = '';
  }
}

onMounted(async() => {
  await loadMessages();
})

const subscription =  supabase
  .channel(`messages:chat_id_id=eq.${props.chatId}`)
  .on('postgres_changes',
  {
    event: 'INSERT',
    schema: 'public',
  }, (payload:  { new: Tables<'messages'> }) => {
    messages.value?.push(payload.new)
  })
  .subscribe()

      
onBeforeUnmount(() => {
  supabase.removeChannel(subscription);
})
</script>

<style scoped lang="css">
/* custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background-color: black;
}

::-webkit-scrollbar-thumb {
  background-color: #2A323C;
  border-radius: 20px;
  border: 6px solid #2A323C;
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #2A323A;
}
</style>