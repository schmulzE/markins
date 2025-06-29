// composables/usePermissions.ts
import { computed } from 'vue';
import type { Community, Comment } from '~/types/utility';

export function usePermissions(userId: string | null, community: Community | null) {
  const isUserModerator = computed(() => {
    if (!userId || !community) return false;
    return community.community_members?.some(
      (member) => member.user_id === userId && member.is_moderator
    );
  });

  const isCommentAuthor = (comment: Comment): boolean => {
    return comment.author.id === userId;
  };

  const canDeleteComment = (comment: Comment): boolean => {
    return isCommentAuthor(comment) || !!isUserModerator.value;
  };

  const canModerate = computed(() => isUserModerator.value);

  return {
    canModerate,
    isUserModerator,
    isCommentAuthor,
    canDeleteComment
  };
}
