import { useSupabaseUser } from '#imports';
import { useToast } from 'vue-toastification';
import type { Post, Comment } from '~/types/utility';

export const useVote = () => {
  const user = useSupabaseUser();
  const toast = useToast();

   // Handle post voting with optimistic updates
  const votePost = async (post: Ref<Post> | Post[], postId: string, voteType: 'up' | 'down') => {
    if (!user.value) {
      toast.error('Please login to vote');
      return;
    }

    // Store current state for potential rollback
    let previousState: {
      user_vote: 'up' | 'down' | null;
      upvotes: number;
      downvotes: number;
    } = {
      user_vote: null,
      upvotes: 0,
      downvotes: 0
    };

    let postAuthorId: string | undefined;
    let updatedPost: Post | undefined;

    // Optimistically update the UI
    if (Array.isArray(post)) {
      const index = post.findIndex(p => p.id === postId);
      if (index !== -1) {
        const targetPost = post[index];
        previousState = {
          user_vote: targetPost.user_vote ?? null,
          upvotes: targetPost.upvotes ?? 0,
          downvotes: targetPost.downvotes ?? 0
        };
        
        updatedPost = calculateNewVoteState(post[index], voteType);
        postAuthorId = targetPost.author_id ?? '';
        post[index] = updatedPost;
      }
    } else {
      previousState = {
        user_vote: post.value.user_vote ?? null,
        upvotes: post.value.upvotes ?? 0,
        downvotes: post.value.downvotes ?? 0
      };
      
      updatedPost = calculateNewVoteState(post.value, voteType);
      postAuthorId = post.value.author_id ?? '';
      post.value = updatedPost;

    }

    // Calculate karmaChange
    let karmaChange = 0;
    if (previousState.user_vote === 'up') karmaChange -= 1;
    else if (previousState.user_vote === 'down') karmaChange += 1;

    if (previousState.user_vote !== voteType) {
      if (voteType === 'up') karmaChange += 1;
      else if (voteType === 'down') karmaChange -= 1;
    }

    try {
      const { user_vote, upvotes, downvotes } = await $fetch<Post>('/api/posts/vote', {
        method: 'POST',
        body: {
          postId,
          userId: user.value.id,
          voteType
        }
      });

      // Verify the server response matches our optimistic update
      // If not, update to server state
      if (Array.isArray(post)) {
        const index = post.findIndex(p => p.id === postId);
        if (index !== -1 && (
          post[index].user_vote !== user_vote ||
          post[index].upvotes !== upvotes ||
          post[index].downvotes !== downvotes
        )) {
          post[index] = {
            ...post[index],
            user_vote,
            upvotes,
            downvotes
          };
        }
      } else if (
        post.value.user_vote !== user_vote ||
        post.value.upvotes !== upvotes ||
        post.value.downvotes !== downvotes
      ) {
        post.value = {
          ...post.value,
          user_vote,
          upvotes,
          downvotes
        };
      }

      // Update hot score
      await $fetch('/api/posts/update-hotscore', {
        method: 'POST',
        body: { post: Array.isArray(post) ? post.find(p => p.id === postId) : post.value }
      });

      // Update author's karma if vote actually changed
      if (karmaChange !== 0 && postAuthorId) {
        await $fetch('/api/users/update-karma', {
          method: 'POST',
          body: { post_karma: karmaChange, karma: karmaChange }
        });
      }

    } catch (error) {
      // Revert to previous state on error
      if (Array.isArray(post)) {
        const index = post.findIndex(p => p.id === postId);
        if (index !== -1) {
          post[index] = {
            ...post[index],
            ...previousState
          };
        }
      } else {
        post.value = {
          ...post.value,
          ...previousState
        };
      }

      toast.error({ 
        title: 'Failed to vote', 
        description: 'Your vote could not be processed',  
      });
      console.error('Voting error:', error);
    }
  };

  // Helper function to calculate new vote state
  const calculateNewVoteState = <T extends Post | Comment>(
    item: T,
    voteType: 'up' | 'down'
  ): T => {
    let newUpvotes = item.upvotes ?? 0;
    let newDownvotes = item.downvotes ?? 0;
    let newUserVote: 'up' | 'down' | null = voteType;

    // Remove previous vote if exists
    if (item.user_vote === 'up') {
      newUpvotes -= 1;
    } else if (item.user_vote === 'down') {
      newDownvotes -= 1;
    }

    // Toggle vote if clicking same vote again
    if (item.user_vote === voteType) {
      newUserVote = null;
    } else {
      // Add new vote
      if (voteType === 'up') {
        newUpvotes += 1;
      } else {
        newDownvotes += 1;
      }
    }

    return {
      ...item,
      upvotes: newUpvotes,
      downvotes: newDownvotes,
      user_vote: newUserVote
    };
  };

  // Handle comment voting with optimistic updates
  const voteComment = async (comments: Ref<Comment[]>, commentId: string, voteType: 'up' | 'down') => {
    if (!user.value) {
      toast.error('Please login to vote');
      return;
    }

    // Store current state for potential rollback
    const previousState = new Map<string, {
      user_vote: 'up' | 'down' | null;
      upvotes: number;
      downvotes: number;
    }>();

    let karmaChange = 0;
    let commentAuthorId: string | undefined;

    // Recursively find and update the comment
    const updateCommentsOptimistically = (commentList: Comment[]): Comment[] => {
      return commentList.map(comment => {
        if (comment.id === commentId) {
          const prevVote = comment.user_vote ?? null;
          const prevUp = comment.upvotes ?? 0;
          const prevDown = comment.downvotes ?? 0;

          previousState.set(commentId, {
            user_vote: prevVote,
            upvotes: prevUp,
            downvotes: prevDown
          });

          commentAuthorId = comment.author.id;

          // Calculate karmaChange
          if (prevVote === 'up') karmaChange -= 1;
          else if (prevVote === 'down') karmaChange += 1;

          if (prevVote !== voteType) {
            if (voteType === 'up') karmaChange += 1;
            else if (voteType === 'down') karmaChange -= 1;
          }

          return calculateNewVoteState(comment, voteType);
        }

        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: updateCommentsOptimistically(comment.replies)
          };
        }

        return comment;
      });
    };

    // Apply optimistic update
    comments.value = updateCommentsOptimistically(comments.value);

    try {
      const { user_vote, upvotes, downvotes } = await $fetch<Comment>('/api/comments/vote', {
        method: 'POST',
        body: {
          commentId,
          userId: user.value.id,
          voteType
        }
      });

      // Verify the server response matches our optimistic update
      const previous = previousState.get(commentId);
      if (previous && (
        previous.user_vote !== user_vote ||
        previous.upvotes !== upvotes ||
        previous.downvotes !== downvotes
      )) {
        // Recursively update to server state if different
        const updateCommentsToServerState = (commentList: Comment[]): Comment[] => {
          return commentList.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                user_vote,
                upvotes,
                downvotes
              };
            }

            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateCommentsToServerState(comment.replies)
              };
            }

            return comment;
          });
        };

        comments.value = updateCommentsToServerState(comments.value);
      }

      // Update hot score
      await $fetch('/api/comments/update-hotscore', {
        method: 'POST',
        body: { comment: comments.value.find(c => c.id === commentId) }
      });

      // Update karma if changed
      if (karmaChange !== 0 && commentAuthorId) {
        await $fetch('/api/users/update-karma', {
          method: 'POST',
          body: {
            post_karma: karmaChange,
            karma: karmaChange
          }
        });
      }

    } catch (error) {
      // Revert to previous state on error
      const previous = previousState.get(commentId);
      if (previous) {
        const revertComments = (commentList: Comment[]): Comment[] => {
          return commentList.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                ...previous
              };
            }

            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: revertComments(comment.replies)
              };
            }

            return comment;
          });
        };

        comments.value = revertComments(comments.value);
      }

      toast.error({
        title: 'Failed to vote', 
        description: 'Your vote could not be processed', 
      });
      console.error('Comment voting error:', error);
    }
  };

  return {
    votePost,
    voteComment
  };
};