<template>
  <div class="lg:col-span-1 space-y-4">
    <AvatarCard :user="user" @open-chat-modal="$emit('open-chat-modal')" />
    <AboutCard :user="user" />
    <KarmaCard :user="user" />
  </div>
</template>

<script lang="ts" setup>
import AboutCard from './about-card.vue';
import KarmaCard from './karma-card.vue';
import AvatarCard from './avatar-card.vue';
import type { Profile } from '~/types/utility';


defineProps<{ user: Profile }>();
defineEmits(['open-chat-modal']);
</script>
