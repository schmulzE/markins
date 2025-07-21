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
      <div
        v-for="message in messages"
        :key="message.id"
        :class="`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`"
      >
        <div
          :class="`max-w-[80%] rounded-lg p-3 ${
            message.sender === 'user' ? 'bg-[#297D4E] text-white' : 'bg-gray-100 text-gray-800'
          }`"
        >
          <p class="text-sm">{{ message.content }}</p>
          <div
            :class="`flex items-center gap-1 mt-1 text-xs ${
              message.sender === 'user' ? 'text-[#E0F2E9]' : 'text-gray-500'
            }`"
          >
            <i class="i-lucide-clock h-3 w-3" />
            <span>{{ message.timestamp }}</span>
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
import useModalStore from '~/stores/useModalStore';
import type { Database, Tables } from '~/types/database.types';

const store = useModalStore();
const user = useSupabaseUser();
const supabase = useSupabaseClient<Database>();

interface Message {
  id: string
  content: string
  sender: 'user' | 'recipient'
  timestamp: string
  read: boolean
}

interface Recipient {
  id: string
  username: string
  displayName: string
  avatar: string
}

interface Props {
  open: boolean
  recipient: Recipient
}

const props = defineProps<Props>();


const messageText = ref('');

const messages = ref<Message[]>([
  {
    id: '1',
    content: "Hello! I'm interested in your research on quantum error correction.",
    sender: 'user',
    timestamp: '2 days ago',
    read: true,
  },
  {
    id: '2',
    content: 'Thanks for reaching out! I\'d be happy to discuss my work. What specific aspects are you interested in?',
    sender: 'recipient',
    timestamp: '1 day ago',
    read: true,
  },
])

// async function loadMessages() {
//   const { data, error } = await client
//     .from('direct_messages')
//     .select('*')
//     .eq('recipient_id', recipient.id)
//     .eq('sender_id', user.value?.id)
//     .order('created_at', { ascending: true })

//   if (error) {
//     throw new Error('Failed to load messages');
//   }

//   messages.value = data
// }

onMounted(async() => {
  // Initialize messages or fetch from API if needed
  // await loadMessages()
})


const handleSendMessage = () => {
  if (!messageText.value.trim()) return

  // Add the new message to the conversation
  const newMessage: Message = {
    id: Date.now().toString(),
    content: messageText.value,
    sender: 'user',
    timestamp: 'Just now',
    read: false,
  }

  messages.value = [...messages.value, newMessage]
  messageText.value = ''

  // Simulate a reply after a short delay
  setTimeout(() => {
    const reply: Message = {
      id: (Date.now() + 1).toString(),
      content: "Thanks for your message! I'll get back to you soon.",
      sender: 'recipient',
      timestamp: 'Just now',
      read: false,
    }
    messages.value = [...messages.value, reply]
  }, 1500)

  // try {
  //   await $fetch(`/api/direct_messages`, {
  //     method: 'POST',
  //     body: {
  //       profile_id: props.currentUser,
  //       chat_id: props.chatId,
  //       content: newMessage.value,
  //     },
  //   })

  // } catch (error) {
  //   if(error instanceof Error) {
  //     toast.error(error.message);
  //   }
  // } finally {
  //   await loadMessages()
  //   newMessage.value = '';
  // }
}

const subscription =  supabase
  .channel(`direct_messages:recipient_id=eq.${props.recipient.id}&sender_id=eq.${user.value?.id}`)
  .on('postgres_changes',
  {
    event: 'INSERT',
    schema: 'public',
  }, (payload:  { new: Tables<'direct_messages'> }) => {
    const dbMsg = payload.new;
    const mappedMsg: Message = {
      id: dbMsg.id,
      content: dbMsg.content,
      sender: dbMsg.sender_id === user.value?.id ? 'user' : 'recipient',
      timestamp: dbMsg.created_at ? new Date(dbMsg.created_at).toLocaleString() : '',
      read: !!dbMsg.is_read,
    };
    messages.value?.push(mappedMsg);
  })
  .subscribe()

      
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