<script lang="ts" setup>
interface Message {
  id: string;
  chat_id: string;
  content: string | null;
  created_at: string;
  profile_id: string;
}

defineProps<{ message: Message }>();
const user = useSupabaseUser()

</script>

<template>
  <ul class="flex-1 px-1">
    <li
      :key="message.id"
      :class="[message.profile_id == user?.id ? 'chat chat-end' : 'chat chat-start']"
    >
    <div class="chat-bubble min-h-[36px] pb-0 bg-base-300 text-base-content text-sm">{{ message.content }}</div>
  </li>
</ul>
</template>