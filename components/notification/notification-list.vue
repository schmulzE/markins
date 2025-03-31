<script lang="ts" setup>
import dayjs from 'dayjs';
import type { Tables } from 'types/database.types';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

defineProps<{
  notifications: Tables<'notifications'>[]
}>()
</script>

<template>
  <div>
    <div v-if="notifications.length === 0" class="text-center text-md py-4">
      <span class="text-gray-600 text-2xl loading loading-spinner"/>
    </div>
    <ul>
      <li 
      v-for="notification in notifications" 
      :key="notification.id"
    class="last-of-type:border-none rounded-sm flex justify-between border-b" 
    >
      <span class="text-sm">{{ notification.message }}</span>
      <span class="text-[10px] w-20 font-medium">{{ dayjs(notification.created_at).fromNow() }}</span>
    </li>
  </ul>
</div>
</template>
