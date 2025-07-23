<template>
  <div>
    <div class="mb-8 relative">
      <div class="flex items-center gap-2">
        <div v-if="recipient.avatar" class="avatar">
          <div class="w-8 rounded-full">
            <img :src="recipient.avatar" class="rounded-full" alt="User Avatar">
          </div>
        </div>
        <div v-else class="avatar avatar-placeholder">
          <div class="bg-gray-300 text-neutral-content w-8 rounded-full">
            <span class="text-sm">{{ recipient?.displayName?.split(' ').map(n => n[0]).join('') }}</span>
          </div>
        </div>
        <span class="text-xl font-medium">Message {{ recipient.displayName }}</span>
      </div>
      <div class="text-gray-500">Direct message with u/{{ recipient.username }}</div>
      <button class="btn btn-ghost absolute top-0 right-0" @click="store.closeModal">
        <i class="ri i-ri-close-line text-2xl"/>
      </button>
    </div>

    <div class="max-h-[60vh] overflow-y-auto py-4 space-y-4">
      <div v-if="isLoading" class="flex justify-center items-center h-full">
        <span class="loading loading-spinner loading-lg" />
      </div>
      <div
        v-for="message in allMessages"
        v-else
        :key="message.id"
        :class="`flex ${message.sender_id !== recipient.id ? 'justify-end' : 'justify-start'}`"
      >
        <div
          :class="`max-w-[80%] rounded-lg p-3 ${
            message.sender_id !==  recipient.id ? 'bg-[#297D4E] text-white' : 'bg-gray-100 text-gray-800'
          }`"
        >
          <p class="text-sm">{{ message.content }}</p>
          <div
            :class="`flex items-center gap-1 mt-1 text-xs ${
              message.sender_id !== recipient.id ? 'text-[#E0F2E9]' : 'text-gray-500'
            }`"
          >
            <i class="i-lucide-clock h-3 w-3" />
            <span>{{ dateTime(message.created_at!) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-end gap-2 mt-8">
      <textarea
        v-model="messageText"
        placeholder="Type your message..."
        class="min-h-[80px] textarea"
        @keydown="handleKeyDown"
      />
      <button
        class="btn text-white bg-[#297D4E] hover:bg-[#1f5a37]"
        :disabled="!messageText.trim()"
        @click="handleSendMessage"
      >
        <i class="i-lucide-send" />
      </button>
    </div>

    <div class="sm:justify-start mt-4">
      <div class="text-xs text-gray-500">
        Messages are subject to community guidelines. Be respectful and on-topic.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { useToast } from 'vue-toastification';
import useModalStore from '~/stores/useModalStore';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { DirectMessages } from '~/types/utility';
import type { Database, Tables } from '~/types/database.types';

dayjs.extend(relativeTime);

interface Recipient {
  id: string
  username: string
  displayName: string
  avatar: string
}

interface Props {
  open: boolean
  recipient: Recipient
  messages: DirectMessages[];
  isLoading: boolean;
}

const props = defineProps<Props>();

const toast = useToast();
const store = useModalStore();
const user = useSupabaseUser();
const supabase = useSupabaseClient<Database>();

const messageText = ref('');
const newMessages = ref<DirectMessages[]>([]);

const dateTime = (value: string) => {
  return dayjs(value).fromNow();
}

const handleSendMessage = async () => {
  if (!messageText.value.trim()) return;

  try {
    await $fetch('/api/direct-messages', {
      method: 'POST',
      body: JSON.stringify({
        content: messageText.value,
        recipient_id: props.recipient.id,
        sender_id: user.value!.id,
      }),
    });
    messageText.value = '';
  } catch (error) {
    console.error('Error sending message:', error);
    toast.error('Failed to send message. Please try again later.');
  }
};

const allMessages = computed(() => [...props.messages, ...newMessages.value]);

const subscription = supabase
  .channel(`direct_messages:recipient_id=eq.${props.recipient.id}&sender_id=eq.${user.value?.id}`)
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'direct_messages',
    },
    (payload: { new: Tables<'direct_messages'> }) => {
      newMessages.value?.push(payload.new);
    },
  )
  .subscribe();

      
onBeforeUnmount(() => {
  supabase.removeChannel(subscription);
})

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSendMessage()
  }
}
</script>