<template>
  <div v-show="!comment.is_deleted" class="space-y-2" :style="{ marginLeft: `${comment.depth * 20}px` }">
    <div class="card border-l-2 border-l-gray-200 border border-gray-300">
      <div class="p-3">
        <div class="flex items-start space-x-3">
          <!-- Voting -->
          <div class="flex flex-col items-center space-y-1">
            <button
              class="btn btn-ghost btn-sm"
              :class="`p-1 h-6 w-6 ${comment.user_vote === 'up' ? 'text-[#297D4E] bg-[#297D4E]/10' : 'text-gray-400 hover:text-[#297D4E]'}`"
              @click="$emit('vote', comment.id, 'up')"
            >
              <i class="h-4 w-4 i-lucide-chevron-up" />
            </button>
            <span
              :class="`text-xs font-medium ${
                comment.user_vote === 'up'
                  ? 'text-[#297D4E]'
                  : comment.user_vote === 'down'
                    ? 'text-red-500'
                    : 'text-gray-600'
              }`"
            >
              {{ comment.upvotes - comment.downvotes }}
            </span>
            <button
              class="btn btn-ghost btn-sm"
              :class="`p-1 h-6 w-6 ${comment.user_vote === 'down' ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'}`"
              @click="$emit('vote', comment.id, 'down')"
            >
              <i class="h-4 w-4 i-lucide-chevron-down" />
          </button>
          </div>

          <!-- Comment Content -->
          <div class="flex-1 space-y-2">
            <!-- Comment Header -->
            <div class="flex items-center space-x-2 text-sm">
              <div v-if="comment.author.avatar_url" class="h-6 w-6 avatar">
                <div class="w-24 rounded-xl">
                  <img :src="getImageUrl(comment.author.avatar_url, 'post-images') || '/svg/placeholder.svg'" >
                </div>
              </div>

              <div v-else class="avatar avatar-placeholder">
                 <div class="bg-neutral text-neutral-content w-6 h-6 rounded-full">
                   <span class="text-xs">{{ comment.author.display_name?.slice(0, 2).toUpperCase() }}</span>
                </div>
              </div>
              
              <NuxtLink :to="`/user/${comment.author.display_name}`" class="font-medium hover:underline">
                u/{{ comment.author.username }}
              </NuxtLink>
              <div v-if="comment.is_op" class="bg-[#297D4E]/10 text-[#297D4E] text-xs badge">OP</div>
              <div v-if="comment.is_moderator" class="bg-green-100 text-green-800 badge text-xs">
                <i class="h-3 w-3 mr-1 i-lucide-shield" />
                MOD
              </div>
              <span class="text-gray-600">{{ dateTime(comment.created_at) }}</span>
            </div>

            <!-- Comment Body -->
            <template v-if="!comment.is_collapsed">
              <div class="text-sm text-gray-700 whitespace-pre-wrap">{{ comment.content }}</div>

              <!-- Comment Actions -->
              <div class="flex items-center space-x-4 text-xs text-gray-600">
                <button
                  class="h-6 px-2 hover:bg-gray-100 btn-ghost btn btn-sm"
                  @click="$emit('set-replying-to', replyingTo === comment.id ? null : comment.id)"
                >
                  <i class="h-3 w-3 mr-1 i-lucide-reply" />
                  Reply
                </button>

                <button class="h-6 px-2 hover:bg-gray-100 btn-ghost btn btn-sm">
                  <i class="h-3 w-3 mr-1 i-lucide-share-2" />
                  Share
                </button>

                <div class="dropdown dropdown-center">
                  <div tabindex="0" role="button" class="btn btn-ghost btn-sm m-1">
                    <i class="h-4 w-4 i-lucide-more-horizontal" />
                  </div>
                  <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-36 p-2 shadow-sm">
                    <li v-if="!isCommentAuthor(comment) && !comment.reported_by?.includes(userId!)">
                      <a 
                        class="flex items-center w-full" 
                        @click="$emit('report', comment.id)"
                      >
                        <i class="h-4 w-4 mr-2 i-lucide-flag" />
                        Report
                      </a>
                    </li>
                    <li>
                      <BookmarkButton :comment-id="comment.id" />
                    </li>
                    <li v-if="isModerator">
                      <a 
                        class="flex items-center w-full"
                        @click="$emit('moderate', comment.id, 'remove')"
                      >
                        <i class="h-4 w-4 mr-2 i-lucide-delete" />
                        Remove
                      </a>
                    </li>
                    <li  v-if="isModerator && comment.report_count > 0">
                      <a
                        class="flex items-center w-full"
                        @click="$emit('moderate', comment.id, 'approve')"
                      >
                        <i class="h-4 w-4 mr-2 i-lucide-correct" />
                        Approve
                      </a>
                    </li>
                    <li v-if="isModerator">
                      <a 
                        class="flex items-center w-full"
                        @click="$emit('moderate', comment.id, 'ban_user')"
                      >
                        <i class="h-4 w-4 mr-2 i-lucide-ban" />
                        Ban User
                      </a>
                    </li>
                  </ul>
                </div>

                <button
                  v-if="comment.replies.length > 0"
                  class="h-6 px-2 btn btn-ghost hover:bg-gray-100"
                  @click="$emit('toggle-collapse', comment.id)"
                >
                  {{ comment.is_collapsed ? 'Expand' : 'Collapse' }} ({{ comment.replies.length }})
                </button>
                
                <button 
                  v-if="canDeleteComment"
                  class="btn btn-ghost btn-sm hover:bg-red-100 text-red-500"
                  @click="$emit('delete', comment.id)"
                >
                  Delete
                </button>
              </div>

              <!-- Reply Form -->
              <div v-if="replyingTo === comment.id" class="space-y-4 pt-2 border-t border-gray-300">
                <textarea
                  v-model="replyContent"
                  placeholder="What are your thoughts?"
                  rows="3"
                  class="text-sm textarea w-full"
                />
                <div class="flex items-center space-x-2">
                  <button
                    class="bg-[#297D4E] btn btn-sm text-white hover:bg-[#1f5a37]"
                    @click.prevent="handleSubmit"
                  >
                    Reply
                  </button>
                  <button
                    class="btn btn-sm btn-outline"
                    @click="$emit('set-replying-to', null)"
                    >
                    Cancel
                  </button>
                </div>
              </div>
            </template>

            <button
              v-if="comment.is_collapsed"
              class="text-xs btn btn-ghost text-gray-600"
              @click="$emit('toggle-collapse', comment.id)"
            >
              [+] {{ comment.replies.length }} replies collapsed
            </button>

          </div>
        </div>
      </div>
    </div>

    <!-- Render Replies -->
    <template v-if="!comment.is_collapsed">
      <CommentItem
        v-for="reply in comment.replies"
        :key="reply.id"
        :comment="reply"
        :replying-to="replyingTo"
        @report="$emit('report', $event)"
        @delete="$emit('delete', $event)"
        @vote="$emit('vote', $event, $event2)"
        @submit-reply="$emit('submit-reply', $event)"
        @moderate="$emit('moderate', $event, $event2)"
        @toggle-collapse="$emit('toggle-collapse', $event)"
        @set-replying-to="$emit('set-replying-to', $event)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import type { Comment } from '~/types/utility';
import relativeTime from 'dayjs/plugin/relativeTime';
import BookmarkButton from '../bookmark/bookmark-button.vue';

dayjs.extend(relativeTime);


const props = defineProps<{
  comment: Comment,
  replyingTo?: string | null,
  userId?: string | null,
  isModerator?: boolean;
  canDeleteComment?: boolean;
}>();

const emit = defineEmits([
  'vote',
  'toggle-collapse',
  'set-replying-to',
  'submit-reply', 
  'report',
  'moderate',
  'delete'
]);

const { getImageUrl } = useImageHandler();

const dateTime = (value: string) => {
  return dayjs(value).fromNow();
}

const replyContent = ref('');

const isCommentAuthor = (comment: Comment) => {
  return comment.author.id === props.userId;
};

const handleSubmit = () => {
  if (!replyContent.value.trim()) return;
  
  emit('submit-reply', {
    parentId: props.comment.id,
    content: replyContent.value
  });
  
  // Reset the form
  replyContent.value = '';
  emit('set-replying-to', null);
};
</script>