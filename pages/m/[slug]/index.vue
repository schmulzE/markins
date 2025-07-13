<template>
  <BaseLayout>
    <template #header>
      <ForumNavbar>
        <template #dynamic-content>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/post/create" class="btn bg-[#297D4E] hover:bg-[#1f5a37] text-white">
              <i class="i-lucide-plus h-4 w-4 md:mr-2" />
              <span class="hidden md:inline">Create Post</span>
            </NuxtLink>
          </div>
        </template>
      </ForumNavbar>
    </template>
    <template #main>
      <!-- Community Banner -->
       <CommunityBanner
        :is-joined="isJoined"
        :community="community!"
        :community-name="communityName"
        @join-community="handleJoin"
       />

      <div class=" px-4 py-6">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Main Content -->
          <div class="lg:col-span-3 space-y-4">
            <!-- Sort Bar -->
             <CommunityFeedToolbar
              v-model:is-select-mode="isSelectMode"
              v-model:sort-by="sortBy"
              :total-posts="posts.length"
              @toggle-selected="toggleSelectMode"
             />
          
            <PostBulkActionsBar 
              v-model:is-select-mode="isSelectMode"
              v-model:selected-posts="selectedPosts"
              :posts="posts"
              :is-moderator="isModerator"
              @bulk-action="handleBulkAction"
            />

            <div v-if="isModerator" class="shadow card border p-4 border-[#297D4E]/20 bg-[#297D4E]/5">
              <div class="p-4">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-semibold text-[#297D4E] flex items-center">
                    <i class="i-lucide-shield h-4 w-4 mr-2" />
                    Moderator Panel
                  </h3>
                  <div class="badge badge-outline bg-[#297D4E]/10 text-[#297D4E]">
                    12 pending
                  </div>
                </div>
                <div class="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div class="text-lg font-bold text-yellow-600">12</div>
                    <div class="text-xs text-muted-foreground">Pending</div>
                  </div>
                  <div>
                    <div class="text-lg font-bold text-red-600">3</div>
                    <div class="text-xs text-muted-foreground">Reports</div>
                  </div>
                  <div>
                    <div class="text-lg font-bold text-green-600">45</div>
                    <div class="text-xs text-muted-foreground">Approved</div>
                  </div>
                  <div>
                    <div class="text-lg font-bold text-blue-600">2.1K</div>
                    <div class="text-xs text-muted-foreground">Active</div>
                  </div>
                </div>
              </div>
            </div>

          <PostCard
            :post-data="posts"
            :is-select-mode="isSelectMode"
            @vote="handleVote"
            @select-post="handleSelectPost"
            @post-action="handlePostAction"
          />
            <!-- :is-moderator="isModerator" -->
        </div>

          <!-- Right Sidebar -->
          <div class="lg:col-span-1 space-y-4">
            <!-- Community Info -->
            <CommunityInfo
            :is-joined="isJoined"
            :community="community!"
            :online-count="onlineCount"
            @join-community="handleJoin"
            />

            <!-- Community Rules -->
            <div class="shadow card bg-base-100 border p-4 border-gray-300 dark:border-base-100"> 
              <div class="text-lg flex items-center font-medium mb-4">
                <i class="i-lucide-shield h-5 w-5 mr-2 text-[#297D4E]" />
                Rules
              </div>
              <div>
                <div class="space-y-3">
                  <div v-for="(rule, index) in communityRules" :key="index" class="flex items-start space-x-3">
                    <div
                      class="flex-shrink-0 w-6 h-6 rounded-full bg-[#297D4E]/10 text-[#297D4E] text-xs font-medium flex items-center justify-center"
                    >
                      {{ index + 1 }}
                    </div>
                    <p class="text-sm text-gray-500 dark:text-base-content">{{ rule }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Moderators -->
            <ModeratorList :moderators="community?.moderators!"/>

          </div>
        </div>
      </div>
    </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '~/layouts/base.vue';
import { useToast } from 'vue-toastification';
import { useVote } from '~/composables/useVotes';
import type { Post, Community } from '~/types/utility';
import { useCommunity } from '~/composables/useCommunity';
import PostCard from '~/components/forum/post/post-card.vue';
import ForumNavbar from '~/components/header/forum-navbar.vue';
import CommunityInfo from '~/components/forum/community/community-info.vue';
import ModeratorList from '~/components/forum/community/moderator-list.vue';
import CommunityBanner from '~/components/forum/community/community-banner.vue';
import PostBulkActionsBar from '~/components/forum/post/post-bulk-actions-bar.vue';
import CommunityFeedToolbar from '~/components/forum/community/community-feed-toolbar.vue';

// Define props
const toast = useToast();
const route = useRoute();
const user = useSupabaseUser();

const posts = ref<Post[]>([]);
const isSelectMode = ref(false);
const selectedPosts = ref<string[]>([]);
const community = ref<Community | null>(null);
const sortBy = ref<'hot' | 'new' | 'top'>('hot');
const communityComposable = ref<ReturnType<typeof useCommunity> | null>(null);

const { votePost } = useVote();

const { data: communityData, error: communityError } = await useAsyncData(
  'community', 
  async () => {
    const response = await $fetch(`/api/communities/${route.params.slug}`);
    return response?.data;
  }
);

// Transform or cast the fetched data to match the Community type structure
community.value = communityData.value ? (communityData.value as Community) : null;

if (communityError.value) {
  toast.error('An error occurred while trying to fetch community');
}

const isModerator = computed(() => community.value!.community_members?.some(member =>  member.user_id === user.value?.id))

const { data: postsData, refresh: refreshPosts, error: postsError } = await useAsyncData(
  'posts', 
  async () => {
    const response = await $fetch(`/api/communities/posts/${community.value?.id}?sort=${sortBy.value}`);
    // Sort posts so that pinned posts appear first
    return response?.data.sort((a, b) => (Number(b.is_pinned === true) - Number(a.is_pinned === true)));
  }
);

posts.value = (postsData.value as unknown as Post[]) ?? [];

if (postsError.value) {
  console.log('error:', postsError.value)
  toast.error('An error occurred while trying to fetch posts');
}

const communityName = computed(() => (
  community.value?.slug as string)?.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/^([a-z])/, (_, c) => c.toUpperCase())
)

const communityRules = computed<string[]>(() => {
  const rules = community.value?.rules as string[];
  
  if (Array.isArray(rules)) {
    return rules;
  }

  if (typeof rules === 'string') {
    try {
      const parsed = JSON.parse(rules);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
});


watchEffect(() => {
  if (community.value?.id && !communityComposable.value) {
    communityComposable.value = useCommunity(community.value.id)
  }
})

const onlineCount = computed(() => communityComposable.value?.onlineCount ?? 0)
const isJoined = computed(() => communityComposable.value?.isJoined ?? false)

const handleJoin = async () => {
  if (!user.value) {
    toast.error('You must be signed in to join this community.')
    return
  }

  if (!communityComposable.value) return
  if (isJoined.value) {
    await communityComposable.value.leaveCommunity()
    toast.success('You left the community.')
  } else {
    await communityComposable.value.joinCommunity()
    toast.success('You joined the community.')
  }
}

const handleVote = (postId: string, voteType: 'up' | 'down') => {
  if(!posts.value) return;
  votePost(posts.value as Post[], postId, voteType);
};

const handlePostAction = (postId: string, action: string) => {
  posts.value = posts.value.map((post) => {
    if (post.id === postId) {
      switch (action) {
        case 'approve':
          return { ...post, status: 'approved' }
        case 'remove':
          return { ...post, status: 'removed' }
        case 'pin':
          return { ...post, isPinned: !post.is_pinned }
        case 'lock':
          return { ...post, isLocked: !post.is_locked }
        default:
          return post
      }
    }
    return post
  })
}

const handleSelectPost = (postId: string) => {
  selectedPosts.value = selectedPosts.value.includes(postId)
    ? selectedPosts.value.filter((id) => id !== postId)
    : [...selectedPosts.value, postId]
}

// const handleSelectAll = () => {
//   const allPostIds = posts.value.map((post) => post.id).filter((id): id is string => typeof id === 'string')
//   selectedPosts.value = selectedPosts.value.length === posts.value.length ? [] : allPostIds
// }

const handleBulkAction = (action: 'approve' | 'remove') => {
  posts.value = posts.value.map((post) => {
    if (selectedPosts.value.includes(post.id!)) {
      switch (action) {
        case 'approve':
          return { ...post, status: 'approved' }
        case 'remove':
          return { ...post, status: 'removed' }
        default:
          return post
      }
    }
    return post
  })
  selectedPosts.value = []
  isSelectMode.value = false
}

const toggleSelectMode = () => {
  isSelectMode.value = !isSelectMode.value
  selectedPosts.value = []
}

watch(sortBy,  () => {
  refreshPosts();
}, {immediate: true})
</script>