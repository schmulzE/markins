<template>
  <div class="card bg-base-100 shadow border border-gray-300 p-4">
    <div class="flex items-center justify-between">
      <div class="text-lg">Comments ({{ comments.filter(c => !c.is_deleted).length }})</div>
        <div class="dropdown dropdown-start">
          <div tabindex="0" role="button" class="btn m-1">
            Sort by: {{ sortBy }}
            <i class="h-4 w-4 ml-2 i-lucide-chevron-down" /> 
          </div>
          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
              <a @click="handleSortChange('best')">
                <i class="h-4 w-4 mr-2 i-lucide-trending-up" />
                Best
              </a>
            </li>
            <li>
              <a @click="handleSortChange('new')">
                <i class="h-4 w-4 mr-2 i-lucide-clock" />
                New
              </a>
            </li>
            <li>
              <a @click="handleSortChange('top')">
                <i class="h-4 w-4 mr-2 i-lucide-chevron-up" />
                Top
              </a>
            </li>
          </ul>
        </div>
      </div>

    <div class="space-y-4">
      <CommentItem
        v-for="comment in comments"
        :key="comment?.id"
        :comment="comment"
        :can-delete-comment="canDeleteComment(comment)"
        :replying-to="replyingTo!"
        :is-moderator="isModerator"
        @vote="handleCommentVote"
        @toggle-collapse="toggleCollapse"
        @set-replying-to="setReplyingTo"
        @submit-reply="handleSubmitReply"
        @delete="handleDeleteComment"
        @report="handleReportComment"
        @moderate="handleModerateComment"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Comment } from '~/types/utility';
import CommentItem from '~/components/forum/comment/comment-item.vue';

defineProps<{
  comments: Comment[],
  sortBy: 'best' | 'new' | 'top' | 'controversial'
  userId?: string,
  isModerator?: boolean,
  canDeleteComment: (comment: Comment) => boolean
}>();

const emit = defineEmits([
  'vote',
  'toggle-collapse',
  'set-replying-to',
  'submit-reply',
  'update:sortBy',
  'delete',
  'report',
  'moderate'
]);

const replyingTo = ref<string | null>(null);

function handleSortChange(newSort: 'best' | 'new' | 'top' | 'controversial') {
  emit('update:sortBy', newSort);
}

function handleCommentVote(commentId: string, vote: 'up' | 'down' | null) {
  emit('vote',commentId, vote); 
};

function toggleCollapse(commentId: string) {
  emit('toggle-collapse', commentId);
};

function setReplyingTo(commentId: string | null) {
  replyingTo.value = commentId;
  emit('set-replying-to', commentId);
}

function handleSubmitReply(payload: { parentId: string; content: string }) {
  emit('submit-reply', payload);
};

function handleDeleteComment(commentId: string) {
  emit('delete', commentId);
};

function handleReportComment(commentId: string) {
  emit('report', commentId);
};

const handleModerateComment = async (commentId: string, action: 'remove' | 'approve' | 'ban_user') => {
  emit('moderate', commentId, action);
};
</script>