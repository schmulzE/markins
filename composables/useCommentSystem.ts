import { onMounted, onUnmounted, type Ref } from 'vue';
import { useSupabaseClient, useSupabaseUser } from '#imports';
import { useToast } from 'vue-toastification';

// Enhanced Type Definitions
type UserVote = 'up' | 'down' | null;

interface CommentModeration {
  is_deleted?: boolean;
  deleted_at?: string;
  deleted_by?: string;
  report_count?: number;
  reported_by?: string[];
}

interface CommentAuthor {
  username: string;
  avatar_url?: string;
  display_name?: string;
}

interface CommentVote {
  user_id: string;
  vote_type: UserVote;
}

export interface Comment extends CommentModeration {
  id: string;
  content: string;
  author: CommentAuthor;
  created_at: string;
  upvotes: number;
  downvotes: number;
  user_vote: UserVote;
  replies: Comment[];
  is_collapsed?: boolean;
  depth: number;
  is_op: boolean;
  is_moderator: boolean;
  parent_comment_id?: string;
  post_id?: string;
  comment_votes?: CommentVote[];
  reported_by?: string[];
  report_count: number;
}

interface CommentPayload {
  content: string;
  post_id: string;
  parent_comment_id?: string | null;
}

interface Pagination {
  page: number;
  pageSize: number;
  hasMore: boolean;
}

interface UseCommentSystemOptions {
  postId: string;
  pagination: Ref<Pagination>;
  comments: Ref<Comment[]>;
  commentsById: Map<string, Comment>;
  onNewComment?: (comment: Comment) => void;
  onCommentError?: (error: Error) => void;
  onCommentDeleted?: (commentId: string) => void;
  onCommentReported?: (commentId: string) => void;
}

export const useCommentSystem = ({
  postId,
  comments,
  pagination,
  commentsById,
  onNewComment,
  onCommentError,
  onCommentDeleted,
  onCommentReported
}: UseCommentSystemOptions) => {
  const user = useSupabaseUser();
  const supabase = useSupabaseClient();
  const toast = useToast();

  let commentsChannel: ReturnType<typeof supabase.channel> | null = null;

  const pendingCommentIds = new Set<string>(); // Track in-progress comments

  // Helper to find and replace a comment in the tree
  const replaceCommentInTree = (list: Comment[], oldId: string, newComment: Comment): Comment[] => {
    return list.map(comment => {
      if (comment.id === oldId) {
        return newComment;
      }
      if (comment.replies.length) {
        return {
          ...comment,
          replies: replaceCommentInTree(comment.replies, oldId, newComment)
        };
      }
      return comment;
    });
  };

  // Handle new comment from real-time subscription
  const handleNewComment = async (payload: { new : unknown}) => {
    const newComment = payload.new;
    
    // Skip if we already have this comment or it's one we're handling optimistically
    if (commentsById.has((newComment as Comment).id)) return;
    if (pendingCommentIds.has((newComment as Comment).id)) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *, 
          author:profiles!comments_author_id_fkey(username, display_name, avatar_url), 
          comment_votes(user_id, vote_type),
          post:posts(community_id)`
        )
        .eq('id', (newComment as Comment).id)
        .single();

      if (error || !data) throw error || new Error('Comment not found');

      const processedComment = processDatabaseComment(data);
      
      // Add to our tracking maps
      commentsById.set(processedComment.id, processedComment);
      
      // Only add if it's not already in the tree (not from optimistic update)
      if (!comments.value.some(c => c.id === processedComment.id)) {
        comments.value = addCommentToTree(processedComment, comments.value);
      }

    } catch (error) {
      console.error('Error processing new comment:', error);
    }
  };

  // Handle comment submission with optimistic UI
  const handleSubmitComment = async (
    content: string, 
    parentId: string | null = null
  ) => {
    if (!content.trim()) return;

    const tempId = `temp-${Date.now()}`;
    pendingCommentIds.add(tempId);

    try {
      // Create and add optimistic comment
      const optimisticComment = createOptimisticComment(content, parentId, tempId);
      comments.value = addCommentToTree(optimisticComment, comments.value);
      commentsById.set(tempId, optimisticComment);

      // Submit to database
      const dbComment = await submitComment({
        content,
        post_id: postId,
        parent_comment_id: parentId
      });

      // Process the real comment from database
      const processedComment = processDatabaseComment(dbComment);
      
      // Update tracking
      pendingCommentIds.delete(tempId);
      commentsById.delete(tempId);
      commentsById.set(processedComment.id, processedComment);

      // Replace optimistic comment with real one
      comments.value = replaceCommentInTree(comments.value, tempId, processedComment);

      // Notify parent component if needed
      onNewComment?.(processedComment);

    } catch (error) {
      // Revert optimistic update on error
      pendingCommentIds.delete(tempId);
      comments.value = removeTempComment(tempId, comments.value);
      commentsById.delete(tempId);

      toast.error('Failed to submit comment');
      onCommentError?.(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // Update createOptimisticComment to accept tempId
  const createOptimisticComment = (
    content: string,
    parentId: string | null = null,
    tempId: string
  ): Comment => {
    const depth = parentId ? (commentsById.get(parentId)?.depth ?? 0) + 1 : 0;
    
    return {
      id: tempId,
      content,
      created_at: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      user_vote: null,
      author: {
        username: user.value?.user_metadata?.username ?? 'you',
        display_name: user.value?.user_metadata?.full_name ?? 'You',
        avatar_url: user.value?.user_metadata?.avatar_url ?? '/svg/placeholder.svg',
      },
      replies: [],
      is_collapsed: false,
      depth,
      parent_comment_id: parentId ?? undefined,
      post_id: postId,
      is_op: false,
      is_moderator: false,
      report_count: 0,
    };
  };

  // Helper function to create optimistic comment
  // Add comment to the tree structure
  const addCommentToTree = (comment: Comment, list: Comment[]): Comment[] => {
    if (!comment.parent_comment_id) {
      return [comment, ...list];
    }

    return list.map(c => {
      if (c.id === comment.parent_comment_id) {
        return {
          ...c,
          replies: [...c.replies, comment],
          is_collapsed: false // Ensure parent is expanded
        };
      }
      
      if (c.replies.length) {
        return {
          ...c,
          replies: addCommentToTree(comment, c.replies)
        };
      }
      
      return c;
    });
  };

  // Remove temporary comment from tree
  const removeTempComment = (tempId: string, list: Comment[]): Comment[] => {
    return list
      .filter(c => c.id !== tempId)
      .map(c => ({
        ...c,
        replies: removeTempComment(tempId, c.replies)
      }));
  };

  // Submit comment to Supabase
  const submitComment = async (payload: CommentPayload): Promise<Comment> => {
    if (!user.value) throw new Error('Must be logged in to comment');

    const { data, error } = await supabase
      .from('comments')
      .insert([{
        content: payload.content,
        post_id: payload.post_id,
        parent_comment_id: payload.parent_comment_id,
        author_id: user.value.id
      }])
      .select(`
        *, 
        author:profiles!comments_author_id_fkey(username, display_name, avatar_url), 
        comment_votes(user_id, vote_type),
        post:posts(community_id, author_id)`
      )
      .single();

    if (error) throw error;
    return processDatabaseComment(data);
  };

  // Process and normalize comment from Supabase
  const processDatabaseComment = (data): Comment => {
    return {
      id: data.id,
      content: data.content,
      created_at: data.created_at,
      upvotes: data.upvotes ?? 0,
      downvotes: data.downvotes ?? 0,
      user_vote: data.comment_votes?.find((v: CommentVote) => 
        v.user_id === user.value?.id
      )?.vote_type ?? null,
      author: {
        username: data.author?.username ?? 'unknown',
        display_name: data.author?.display_name ?? 'Unknown',
        avatar_url: data.author?.avatar_url ?? '/svg/placeholder.svg'
      },
      replies: [],
      is_collapsed: false,
      depth: data.parent_comment_id
        ? (commentsById.get(data.parent_comment_id)?.depth !== undefined
            ? commentsById.get(data.parent_comment_id)!.depth + 1
            : 1)
        : 0,
      parent_comment_id: data.parent_comment_id,
      post_id: data.post_id,
      is_op: data.post?.author_id === user.value?.id,
      is_moderator: false, // You'll need to implement moderator check
      comment_votes: data.comment_votes,
      report_count: data.report_count ?? 0,
    };
  };

  // Pagination functions
  const loadMoreComments = async () => {
    if (!pagination.value.hasMore) return;

    try {
      const { page, pageSize } = pagination.value;
      const nextPage = page + 1;

      const { data, error, count } = await supabase
        .from('comments')
        .select(`
          *, 
          author:profiles(username, display_name, avatar_url), 
          comment_votes(user_id, vote_type),
          post:posts(community_id)`,
          { count: 'exact' }
        )
        .eq('post_id', postId)
        .is('parent_comment_id', null) // Only top-level comments for pagination
        .order('created_at', { ascending: false })
        .range((nextPage - 1) * pageSize, nextPage * pageSize - 1);

      if (error) throw error;

      const processed = data.map(processDatabaseComment);
      const hasMore = count ? nextPage * pageSize < count : false;

      // Add to existing comments
      comments.value = [...comments.value, ...processed];
      processed.forEach(c => commentsById.set(c.id, c));

      // Update pagination state
      pagination.value = {
        page: nextPage,
        pageSize,
        hasMore
      };

    } catch (error) {
      toast.error('Failed to load more comments');
      onCommentError?.(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // Comment deletion
  const deleteComment = async (commentId: string) => {
    if (!user.value) throw new Error('Must be logged in to delete comments');

    try {
      // Optimistic update
      comments.value = comments.value.map(c => 
        c.id === commentId 
          ? { ...c, is_deleted: true, content: '[deleted]' } 
          : c
      );

      // Actual deletion (soft delete)
      const { error } = await supabase
        .from('comments')
        .update({ 
          is_deleted: true,
          deleted_at: new Date().toISOString(),
          deleted_by: user.value.id
        })
        .eq('id', commentId);

      if (error) throw error;

      onCommentDeleted?.(commentId);
      toast.success('Comment deleted successfully');

    } catch (error) {
      // Revert optimistic update
      comments.value = comments.value.map(c => 
        c.id === commentId 
          ? { ...c, is_deleted: false } 
          : c
      );

      toast.error('Failed to delete comment');
      onCommentError?.(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // Report comment
  const reportComment = async (commentId: string, reason: string) => {
    if (!user.value) throw new Error('Must be logged in to report comments');

    try {
      // Optimistic update
      comments.value = comments.value.map(c => 
        c.id === commentId 
          ? { 
              ...c, 
              report_count: (c.report_count || 0) + 1,
              reported_by: [...(c.reported_by || []), user.value!.id]
            } 
          : c
      );

      // Add report to database
      const { error } = await supabase
        .from('comment_reports')
        .insert({
          comment_id: commentId,
          reporter_id: user.value.id,
          reason,
          post_id: postId
        });

      if (error) throw error;

      // Update comment's report count
      await supabase.rpc('increment_comment_report_count', {
        comment_id: commentId
      });

      onCommentReported?.(commentId);
      toast.success('Comment reported successfully');

    } catch (error) {
      // Revert optimistic update
      comments.value = comments.value.map(c => 
        c.id === commentId 
          ? { 
              ...c, 
              report_count: (c.report_count || 0) - 1,
              reported_by: (c.reported_by || []).filter(id => id !== user.value!.id)
            } 
          : c
      );

      toast.error('Failed to report comment');
      onCommentError?.(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // Moderation functions
  const moderateComment = async (commentId: string, action: 'remove' | 'approve' | 'ban_user') => {
    if (!user.value) throw new Error('Must be logged in to moderate');

    try {
      switch (action) {
        case 'remove':
          await deleteComment(commentId);
          break;
        
        case 'approve': {
          // Remove reports and flags
          const { error: clearError } = await supabase
            .from('comment_reports')
            .delete()
            .eq('comment_id', commentId);

          if (clearError) throw clearError;

          await supabase
            .from('comments')
            .update({ 
              report_count: 0,
              reported_by: []
            })
            .eq('id', commentId);

          // Update local state
          comments.value = comments.value.map(c => 
            c.id === commentId 
              ? { ...c, report_count: 0, reported_by: [] } 
              : c
          );
          break;
        }

        case 'ban_user': { 
          const comment = commentsById.get(commentId);
          if (!comment) throw new Error('Comment not found');

          await supabase
            .from('profiles')
            .update({ banned_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() })
            .eq('username', comment.author.username);

          toast.success('User banned for 30 days');
          break; 
        }
      }

    } catch (error) {
      toast.error(`Failed to moderate comment: ${error instanceof Error ? error.message : String(error)}`);
      onCommentError?.(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // Update real-time handler to include moderation events
  onMounted(() => {
    commentsChannel = supabase
      .channel(`comments-${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              handleNewComment(payload);
              break;
            case 'UPDATE':
              handleUpdatedComment(payload);
              break;
            case 'DELETE':
              handleDeletedComment(payload);
              break;
          }
        }
      )
      .subscribe();
  });

  // Handle comment updates (for moderation changes)
  const handleUpdatedComment = (payload: { new: unknown }) => {
    const updatedCommentRaw = payload.new;
    if (!updatedCommentRaw || !(updatedCommentRaw as Comment).id) return;

    const processed = processDatabaseComment(updatedCommentRaw);
    const existingComment = commentsById.get(processed.id);

    if (!existingComment) return;

    commentsById.set(processed.id, processed);
    comments.value = replaceCommentInTree(comments.value, processed.id, processed);
  };

  // Handle comment deletions
  const handleDeletedComment = (payload: { old?: { id?: string } }) => {
    const deletedId = payload.old?.id;
    if (!deletedId) return;
    comments.value = removeCommentFromTree(comments.value, deletedId);
    commentsById.delete(deletedId);
    onCommentDeleted?.(deletedId);
  };

  // Helper to completely remove a comment from the tree
  const removeCommentFromTree = (list: Comment[], commentId: string): Comment[] => {
    return list
      .filter(c => c.id !== commentId)
      .map(c => ({
        ...c,
        replies: removeCommentFromTree(c.replies, commentId)
      }));
  };

  // Cleanup
  onUnmounted(() => {
    if (commentsChannel) supabase.removeChannel(commentsChannel);
  });

  return {
    handleSubmitComment,
    processDatabaseComment,
    loadMoreComments,
    deleteComment,
    reportComment,
    moderateComment,
  };
};