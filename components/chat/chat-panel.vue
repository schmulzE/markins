<script lang="ts" setup>
import { useToast } from 'vue-toastification';
import type { NestedResponse } from '~/types/utility';
import useModalStore from '../../stores/useModalStore';
import type { Database, Tables } from '~/types/database.types';

type Message = {
  content: string;
  created_at: string; // or Date if you prefer
};

type Chat = {
  id: string; // or number, depending on your data
  messages: Message[];
};

type Profile = {
  id: string; // or number, depending on your data
  username: string;
  avatar_url: string;
};

type SelectedTable = {
  chat_id: string; // or number, depending on your data
  chats: Chat;
  profiles: Profile;
};

// Define the nested response type for the selected table
type NestedSelectedTable = NestedResponse<SelectedTable, keyof SelectedTable>;

interface Chats {
  id: string;
  username: string;
  avatar_url: string;
  last_message: string;
  time_of_last_message: string;
}

const userId = ref('');
const chatId = ref('');
const toast = useToast();
const loading = ref(false);
const openChat = ref(false);
const createChat = ref(false);
const store = useModalStore();
const chats = ref<Chats[]>([]);
const user = useSupabaseUser();
const searchUsername = ref('');
const client = useSupabaseClient<Database>();
const messages = ref<Tables<'messages'>[]>();
const selectedChat = ref<null | string>(null);

const props = defineProps<{
  userIdProp?: string,
}>()

const openChatMessage = async(Id: string) => {
  openChat.value = true;
  createChat.value = true;
  chatId.value = Id;
}

onMounted(async () => {
  // Fetch chats
  loadChats()
})

async function loadChats() {
  // Step 1: Get chat IDs for the current user
  const response = await $fetch('/api/chat_participants');
  const data = response?.data;

  if (!data) {
    throw new Error('Error fetching chat IDs')
  }

  const chatIds = data.map(item => item.chat_id)

  if (chatIds.length === 0) {
    throw new Error('No chats found for the current user.')
  }

  const participantsData  = await $fetch<NestedSelectedTable[]>('/api/chats_participants', {
    method: 'POST',
    body: { chatIds, userId: user.value?.id }
  });

  if (!participantsData) {
   throw new Error('Error loading chat participants')
  }

  
  chats.value = participantsData.map(item => ({
    id: item.chat_id,
    username: item.profiles?.username ?? '', // Handle missing profiles
    avatar_url: item.profiles?.avatar_url ?? '', // Ensure avatar_url is always a string
    last_message: item.chats?.messages?.[item.chats.messages.length - 1]?.content ?? '', // Handle missing messages
    time_of_last_message: item.chats?.messages?.[item.chats.messages.length - 1]?.created_at ?? '' // Handle missing messages
  }));
}


async function selectChat(chatId: string) {
  selectedChat.value = chatId
  loadMessages(chatId)
}

async function loadMessages(chatId: string) {
  const { data, error } = await client
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error('Failed to load messages');
  }

  messages.value = data
}

async function startChat() {
  try {
    // Check if a chat already exists with this user
    loading.value = true;

      // Check if userIdProp exists
      if (props.userIdProp) {
      userId.value = props.userIdProp;
    } else {
      // If userIdProp doesn't exist, proceed with the original search
      const response = await $fetch('/api/search/user', {
        method: 'POST',
        body: { username: searchUsername.value }
      });

      const data = response?.data;

      if (!data) {
        throw new Error('The username does not exist. Please try again!')
      } 
      userId.value = data.id;
    }

    const { data: existingChat, error: chatError } = await client
      .rpc('get_chat_between_users', {
        user1_id: user.value?.id ?? '',
        user2_id: userId.value
      })

    if (chatError) {
      throw new Error('Error checking existing chat: ' +  chatError)
    }

    let chatId: string;

    if (existingChat.length > 0) {
      // Chat already exists, use the existing chat
      chatId = existingChat[0].chat_id
    } else {

      const response = await $fetch('/api/chats', {
        method: 'POST',
        body: {}
      });

      const newChat = response?.data;

      chatId = newChat?.id ?? (() => { throw new Error('Failed to create a new chat'); })();

      // Add participants to the chat
      const { error: participantError } = await client
        .from('chat_participants')
        .insert([
          { chat_id: chatId, profile_id: user.value?.id ?? '' },
          { chat_id: chatId, profile_id: userId.value }
        ])

      if (participantError) {
        throw new Error('Error adding chat participants: ' + participantError)
      }
    }

    // Select the new or existing chat
    selectChat(chatId);

    // Clear search results
    searchUsername.value = '';

    // Reload chats to include the new chat
    loadChats();
    loading.value = false;

  } catch (error) {
    if(error instanceof Error) {
      toast.error("An error occured, please try again!");
    }
  }finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex w-full max-w-4xl shadow-lg relative h-full rounded-lg ">
    <section class="w-[35%] border-r border-base-300">
      <div class="border-b border-base-300 flex px-1.5 py-2 justify-between items-center">
        <span class="">Chat</span>
        <button @click="createChat = true">
          <i class="i-uil-comment-plus text-xl"/>
        </button>
      </div>
      <ChatList :chats="chats" @open_chat="openChatMessage"/>
    </section>
    <section class="flex flex-col justify-center content-center w-[65%]">
      <div v-if="openChat" class="px-1.5 pb-.5 flex border-b border-base-300 justify-between items-center">
        <span class="text-sm">Emily Johnson</span>
        <button class="text-base-neutral" @click="store.closeModal">
          <i class="ri i-ri-close-line text-xl"/>
        </button>
      </div>
      <div v-if="!createChat" class="my-10 text-center">
        <img src="/svg/sent-message-bro.svg" class="w-40 h-40 mx-auto">
        <h2 class="font-medium">Welcome to chat!</h2>
        <p class="py-4 text-sm">Start a direct or group chat with other users</p>
        <div class="flex justify-center content-center">
          <button 
          class="flex bg-blue-600 text-base-100 p-2 rounded-full text-right gap-x-1"
          @click="createChat = true" 
          >
            <i class="i-uil-comment-plus text-lg"/>
            <span class="text-sm">start new chat</span>
          </button>
        </div>
      </div>
      <div v-else-if="openChat">
        <ChatMessageList
        :current-user="user!.id" 
        :chat-id="chatId"
        />
      </div>
      <div v-else class="flex flex-1 flex-col bg-base-300">
        <div class="flex-1 px-3">
          <input 
          v-model="searchUsername" 
          type="text" 
          class="input ring-2 ring-white w-full rounded-full mt-8 text-sm bg-base-100 p-4" 
          placeholder="Type username"
          >
        </div>
        <div class="bg-base-100 border border-base-300 px-2 py-4 space-x-4 flex justify-end">
         <button class="text-sm bg-base-300 rounded-full p-2" @click="createChat = false">cancel</button>
         <button 
          class="text-sm bg-blue-600 text-white rounded-full p-2 disabled:text-neutral disabled:bg-base-300 disabled:cursor-not-allowed flex" 
          :disabled="!searchUsername" 
          @click="startChat"
         >
          <span v-if="!loading">start chat</span>
          <span v-else class="loading-spinner loading loading-sm inline-block mx-4"/>
        </button>
        </div>
      </div>
    </section>
  </div>
</template>