<script lang="ts" setup>
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

defineProps<{
  chats: { id: string; avatar_url: string; username: string; time_of_last_message: string; last_message: string }[]
}>();

const emit = defineEmits(["open_chat"]);

dayjs.extend(relativeTime);

const dateTime = (value: string) => {
  return dayjs(value).fromNow();
}

const onOpenChat = (chatId: string) => {
  emit("open_chat", chatId);
}

</script>

<template>
  <div>
    <div v-if="chats.length == 0" class="text-center text-sm py-2">
      loading...
    </div>
    <ul v-else>
      <li v-for="chat in chats" :key="chat.id">
        <a 
        class="flex gap-x-1 p-2 items-center cursor-pointer hover:bg-base-200"
        @click="onOpenChat(chat.id)" 
        >
        <UserAvatar :avatar-url="chat.avatar_url"/>
          <div class="w-full">
            <div class="flex justify-between">
              <span class="text-xs font-medium">{{ chat.username }}</span>
              <span class="text-[10px] text-neutral">{{ dateTime(chat.time_of_last_message) }}</span>
            </div>
            <p class="text-sm">{{ chat.last_message }}</p>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>
