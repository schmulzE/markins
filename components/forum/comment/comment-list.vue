<!-- eslint-disable vue/no-v-html -->
<template>
  <ul role="list" class="my-8 mx-8">
    <li 
      v-for="comment in comments" 
      :key="comment.id" 
      class="flex justify-between gap-x-6 py-4 border-t border-base-300 group"
    >
      <div class="flex gap-x-2">
        <NuxtLink :to="`/profile/${comment.profiles?.username}`" class="">
          <UserAvatar :avatar-url="comment.profiles?.avatar_url || ''"/>
        </NuxtLink>
        <div class="min-w-0 flex-auto">
          <div class="flex">
            <NuxtLink 
              :to="`/profile/${comment.profiles?.username}`" 
              class="text-sm font-semibold leading-6"
            >
              {{ comment.profiles?.username }}
            </NuxtLink>
            <p class="mt-1 text-xs font-semibold ml-1 text-gray-500">
              added a comment <time>{{ dateTime(comment.created_at!) }}</time>
            </p>
            <a 
              v-if="user && user?.id === comment.profile_id" 
              class="text-[red] cursor-pointer italic text-xs mt-1 ml-2 hidden group-hover:block"
              @click="openWarningModal(comment.id)" 
            >
              Delete
            </a>
          </div>
          <!-- <p class="mt-2 mb-2 text-md font-medium leading-5">{{ comment.content }}</p> -->
          <div v-html="sanitizeHtml(comment.content!)"/>
          <div class="flex items-center gap-4 mt-2">
            <VoteButton :target-id="comment.id" target-type="comment" class="flex gap-1 items-center text-sm"/>
            <BookmarkButton :comment-id="comment.id"/>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import DOMPurify from 'dompurify';
import type { Comments } from '~/types/utility';
import VoteButton from '../vote/vote-button.vue';
import useModalStore from '~/stores/useModalStore';
import relativeTime from 'dayjs/plugin/relativeTime';
import UserAvatar from '~/components/user/user-avatar.vue';
import BookmarkButton from '../bookmark/bookmark-button.vue';


const props = defineProps<{
  comments: Comments[], // List of comments to iterate over
  postId?: string,
  loading?: boolean
}>();

const user = useSupabaseUser();
const store = useModalStore();
const emit = defineEmits(['vote-update', 'delete-comment']);

dayjs.extend(relativeTime);

const dateTime = (value: string) => {
  return dayjs(value).fromNow();
}

const sanitizeHtml = (html: string) => {
  if (import.meta.client) {
    // DOMPurify is already imported at the top of the file
    return DOMPurify.sanitize(html);
  }
  return html;
};

function openWarningModal(commentId: string) {
  store.openModal({ 
    component: markRaw(defineAsyncComponent(() => import('~/components/forum/comment/delete-confirmation-modal.vue'))), 
    props: {
      classes: "fixed w-1/2 top-[50%] left-[50%] p-6 h-auto transform translate-x-[-50%] translate-y-[-50%]", 
      overlayClass: 'bg-black bg-opacity-70', 
      loading: props.loading,
    },
    events: {
      deleteComment: () => {
        emit('delete-comment', commentId);
      },
    }
  });
}
</script>