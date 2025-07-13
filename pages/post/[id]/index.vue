<template>
  <BaseLayout>
    <template #header>
      <ForumNavbar>
        <template #dynamic-content>
          <nav class="flex items-center space-x-4">
          <NuxtLink to="/posts" class="text-sm font-medium hover:text-[#297D4E] transition-colors">
            Posts
          </NuxtLink>
          <NuxtLink to="/communities" class="text-sm font-medium hover:text-[#297D4E] transition-colors">
            Communities
          </NuxtLink>
        </nav>
        </template>
      </ForumNavbar>
    </template>
    <template #main>
      <div class="px-4 py-6">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Main Content -->
          <div class="lg:col-span-3 space-y-6">
            <!-- Post -->

            <PostCard
              :post-data='post!'
              @vote="handlePostVote"
            /> 

            <!-- Comment Form -->
            <div class="card bg-base-100 shadow border border-gray-300 dark:border-base-300 p-4">
              <div class="mb-4">
                <div class="text-lg font-medium">Add a comment</div>
              </div>
              <div class="space-y-4">
                <RichTextEditor @submit-comment="onSubmitNewComment"/>
              </div>
            </div>

            <!-- Comments Section -->
            <CommentsSection
              :comments="comments"
              :sort-by="sortBy"
              :user-id="user?.id"
              :is-moderator="isUserModerator"
              :can-delete-comment="canDeleteComment"
              @update:sort-by="handleSortByUpdate"
              @vote="handleCommentVote"
              @toggle-collapse="toggleCollapse"
              @set-replying-to="setReplyingTo"
              @submit-reply="onSubmitReply"
              @delete="deleteCommentModal"
              @report="handleReport"
              @moderate="handleModerate"
            />
          </div>

          <!-- Right Sidebar -->
          <div 
            v-if="post"
            class="lg:col-span-1 space-y-4" 
          >
            <!-- Community Info -->
            <div class="card bg-base-100 shadow border border-gray-300 dark:border-base-300 p-4">
              <div class="text-lg flex items-center mb-4">
                <span class="mr-2">{{ post.community?.icon }}</span>
                {{ post.community?.name }}
              </div>
              <div class="space-y-4">
                <p class="text-sm text-gray-500 dark:text-base-content">
                  {{ post.community?.description }}
                </p>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span>Members</span>
                    <span class="font-medium">{{ Number(String(post.community?.member_count).replace(/[90]/g, '')) }}K</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Online</span>
                    <!-- <span class="font-medium text-green-600">2.1K</span> -->
                    <span class="font-medium text-green-600">{{ onlineCount }}</span>
                  </div>
                </div>
                <button 
                class="w-full font-normal btn"
                :class="isJoined ? 'bg-base-100 btn-outline border-[#297D4E] text-[#297D4E]' : 'text-white bg-[#297D4E] hover:bg-[#1f5a37]'"
                @click="handleJoinCommunity(post.community?.id!)"
                >
                  {{isJoined ? 'Joined' : 'Join Community'}}
                </button>
              </div>
            </div>

            <!-- Related Posts -->
            <div class="card bg-base-100 shadow border border-gray-300 dark:border-base-300 p-4">
              <div>
                <div class="text-lg">Related Posts</div>
              </div>
              <div class="space-y-3">
                  <div v-if="isLoadingPosts" class="text-center text-gray-400 py-4">
                  Loading related posts...
                  </div>
                  <template v-else>
                  <template v-if="relatedPosts && relatedPosts.length">
                    <div
                      v-for="(item, index) in relatedPosts"
                      :key="index"
                      class="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-base-200 transition-colors cursor-pointer"
                    >
                      <h4 class="text-sm font-medium mb-1">{{ item.title }}</h4>
                      <div class="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{{ item.upvotes! - item.downvotes! }} upvotes</span>
                        <span>{{ item.comment_count }} comments</span>
                      </div>
                    </div>
                  </template>
                  <div v-else class="text-center text-gray-400 py-4">
                    No related posts found.
                  </div>
                  </template>
              </div>
            </div>

            <!-- Community Rules -->
            <div class="card bg-base-100 shadow border border-gray-300 dark:border-base-300 p-4">
              <div class="text-lg flex items-center mb-4">
                <i class="h-5 w-5 mr-2 text-[#297D4E] i-lucide-shield" />
                Rules
              </div>
              <div class="space-y-4 text-sm">
                <p>1. Be respectful and constructive</p>
                <p>2. No pseudoscience or misinformation</p>
                <p>3. Cite your sources</p>
                <p>4. Follow academic integrity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseLayout from '~/layouts/base.vue';
import { useToast } from 'vue-toastification';
import { useVote } from '~/composables/useVotes';
import useModalStore from '~/stores/useModalStore';
import { useCommunity } from '~/composables/useCommunity';
import RichTextEditor from '~/components/editor/editor.vue';
import PostCard from '~/components/forum/post/post-card.vue';
import ForumNavbar from '~/components/header/forum-navbar.vue';
import { useCommentSystem } from '~/composables/useCommentSystem';
import type { Post, Comment, Community }  from '~/types/utility.ts';
import CommentsSection from '~/components/forum/comment/comments-section.vue';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

interface Pagination {
  page: number;
  pageSize: number;
  hasMore: boolean;
}

const route = useRoute();
const toast = useToast();
const store = useModalStore();
const user = useSupabaseUser();

// State
const comments = ref<Comment[]>([]);
const post = ref<Post | null>(null);
const userId = user.value?.id || null;
const postId = route.params.id as string;
const replyingTo = ref<string | null>(null);
const commentsById = new Map<string, Comment>();
const sortBy = ref<'best' | 'new' | 'top' | 'controversial'>('best');
const pagination = ref<Pagination>({
  page: 1,
  pageSize: 10,
  hasMore: true
});


const { 
  handleSubmitComment, 
  deleteComment,
  reportComment,
  moderateComment 
} = useCommentSystem({
  postId,
  comments,
  commentsById,
  pagination,
  onNewComment: (comment) => {
    console.log('New comment added:', comment);
  },
  onCommentError: (error) => {
    console.error('Comment error:', error);
  }
});

const { votePost, voteComment } = useVote();
const { joinCommunity, leaveCommunity } = useCommunityMembership();

const isJoined  = computed(() => {
  return post.value?.community?.community_members?.some(member => member.user_id === userId) ?? false;
})

//fetch post
const { data: payload, error: payloadError } = await useAsyncData(
  'post', 
  async () => {
    const response = await $fetch<ApiResponse<Post>>(`/api/posts/${postId}`);
      return response.data;
    }
  );
  
  if (payloadError.value) {
    toast.error('An error occurred while trying to fetch post');
  }
const communityId = computed(() => payload.value?.community?.id || '');
  
const { onlineCount, relatedPosts, isLoadingPosts } = useCommunity(communityId.value);

const {
  isUserModerator,
  canDeleteComment,
} = usePermissions(userId, (post.value?.community as Community) || null);

//fetch comments
const { data, refresh: refreshComments } = await useAsyncData(
  'comments', 
  async () => {
    try {
      const response = await $fetch<ApiResponse<Comment[]>>(`/api/comments/${postId}?sort=${sortBy.value}`);
      return response?.data || [];
    } catch {
      toast.error('An error occured while trying to fetch comments');
      return [];
    }
  }
);

const setReplyingTo = (commentId: string | null) => {
  replyingTo.value = commentId
}

function handleSortByUpdate(newSort: typeof sortBy.value) {
  sortBy.value = newSort
}

const onSubmitNewComment  = (content: string) => {
  if (!content.trim()) return;
  handleSubmitComment(content); // top-level comment
};

const onSubmitReply = (payload: { parentId: string; content: string }) => {
  if (!payload.content.trim()) return;
  handleSubmitComment(payload.content, payload.parentId); // reply
};


const toggleCollapse = (commentId: string) => {
  const updateComment = (comments: Comment[]): Comment[] => {
    return comments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, is_collapsed: !comment.is_collapsed }
      }

      if (comment.replies!.length > 0) {
        return {
          ...comment,
          replies: updateComment(comment.replies!),
        }
      }

      return comment
    })
  }

  comments.value = updateComment(comments.value)
}

// For a single post
const handlePostVote = (voteType: 'up' | 'down') => {
  if (!post.value) return;
  votePost(post as Ref<Post>, post.value.id as string, voteType);
};


// For comments
const handleCommentVote = (commentId: string, voteType: 'up' | 'down') => {
  voteComment(comments as Ref<Comment[]>, commentId, voteType);
};


const handleDelete = async (commentId: string) => {
  await deleteComment(commentId);
};

const handleReport = async (commentId: string) => {
  const reason = prompt('Please enter the reason for reporting this comment:');
  if (reason) {
    await reportComment(commentId, reason);
  }
};

const handleModerate = async (commentId: string, action: 'remove' | 'approve' | 'ban_user') => {
  await moderateComment(commentId, action);
};

const handleJoinCommunity = async (communityId: string) => {
  if (!user.value) {
    toast.error('You need to be logged in to join a community.')
    return
  }


  try {
    if (isJoined.value) {
      await leaveCommunity(communityId);
      toast.success(`Left ${post.value?.community?.name}`);
    } else {
      await joinCommunity(communityId);
      toast.success(`Joined ${post.value?.community?.name}`);
    }
  } catch (err) {
    toast.error(`Failed to update membership. Please try again.`);
    console.error(err);
  }
}

function deleteCommentModal(commentId: string) {
  store.openModal({ 
    component: markRaw(defineAsyncComponent(() => import('~/components/forum/comment/delete-confirmation-modal.vue'))), 
    props: {
      classes: "fixed w-1/2 sm:max-w-md top-[50%] left-[50%] p-6 h-auto transform translate-x-[-50%] translate-y-[-50%]", 
      overlayClass: 'bg-gray-900/90',
    },
    events: {
      onDeleteComment: () => {
        handleDelete(commentId);
        store.closeModal();
      },
    }
  });
}

watch([payload, user], () => {
  if (!payload.value) {
    post.value = null
    return
  }

  post.value = {
    ...payload.value,
    user_vote: (() => {
      const found = (payload.value.votes as Array<{ user_id: string; vote_type: string }>)
        .find((v) => v.user_id === user.value?.id)?.vote_type;
      return found === 'up' || found === 'down' ? found : null;
    })(),
    is_bookmarked: (payload.value.bookmarks as unknown as Array<{ user_id: string }>)
      .some((b) => b.user_id === user.value?.id),
  }

}, { immediate: true })


watch(sortBy, () => {
  refreshComments()
}, { immediate: true })

// Create maps for quick lookups
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const commentMap = new Map<string, any>();

watch([data, user], () => {
  if (!data.value) {
    comments.value = [];
    return;
  }
  
  // Clear maps for new processing
  commentMap.clear()
  commentsById.clear()

  
  // First pass: organize comments and prepare structure
  data.value.forEach(comment => {
    const processed = {
      ...comment,
      user_vote: (comment.comment_votes as Array<{ user_id: string; vote_type: string }>)
        .find(v => v.user_id === user.value?.id)?.vote_type ?? null,
      replies: [],
      depth: 0 // Initialize depth, will be set correctly in tree building
    };
    
    commentsById.set(comment.id, processed as Comment);
    
    const parentId = comment.parent_comment_id;
    if (parentId) {
      if (!commentMap.has(parentId)) {
        commentMap.set(parentId, []);
      }
      commentMap.get(parentId)?.push(processed);
    }
  });
  
  // Recursive function to build comment tree with proper depths
  const buildCommentTree = (comment: Comment, currentDepth: number = 1) => {
    const replies = commentMap.get(comment.id!) || [];
    return {
      ...comment,
      depth: currentDepth, // Set the current depth
      replies: replies.map((reply: Comment) => buildCommentTree(reply, currentDepth + 1))
    };
  };
  
  // Start with root comments (depth = 0)
  comments.value = data.value
    .filter(comment => !comment.parent_comment_id)
    .map(comment => buildCommentTree(commentsById.get(comment.id)!));

}, { immediate: true });
</script>