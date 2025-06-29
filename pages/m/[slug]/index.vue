<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div class=" flex h-16 items-center justify-between px-4">
        <NuxtLink to="/posts" class="flex items-center space-x-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#297D4E]">
            <i class="h-5 w-5 text-white i-lucide-miscroscope" />
          </div>
          <span class="text-xl font-bold text-[#297D4E]">ScienceForum</span>
        </NuxtLink>

        <div class="flex items-center space-x-4">
          <NuxtLink to="/post/create" class="btn bg-[#297D4E] hover:bg-[#1f5a37] text-white">
            <i class="i-lucide-plus h-4 w-4 mr-2" />
            Create Post
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Community Banner -->
    <div class="relative h-48 bg-gradient-to-r from-[#297D4E] to-[#1f5a37]">
      <img
        :src="community?.banner_url || '/svg/placeholder.svg'"
        alt="Community banner"
        class="absolute h-full w-full object-cover opacity-20"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div class="absolute bottom-0 left-0 right-0 p-6">
        <div class="">
          <div class="flex items-end space-x-4">
            <div class="text-6xl">{{ community?.icon }}</div>
            <div class="flex-1 text-white">
              <h1 class="text-3xl capitalize font-bold">{{ (route.params.slug as string).replace('-', ' ') }}</h1>
              <p class="text-lg opacity-90">m/{{ communityName }}</p>
              <p class="text-sm opacity-75">{{ community?.description }}</p>
            </div>
            <div class="flex items-center space-x-3">
              <button
                class="btn"
                :variant="isJoined ? 'secondary' : 'default'"
                :class="isJoined ? '' : 'bg-white text-[#297D4E] hover:bg-gray-100'"
                @click="handleJoin"
              >
                {{ isJoined ? 'Joined' : 'Join' }}
              </button>
              <button
                class="border-white btn btn-outline text-white hover:bg-white hover:text-[#297D4E]"
              >
                <i class="h-4 w-4 i-lucide-bell" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class=" px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-3 space-y-4">
          <!-- Sort Bar -->
          <div class="shadow card bg-base-100 border border-gray-300">
            <div class="p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <button
                    class="btn"
                    :class="sortBy === 'hot' ? 'bg-[#297D4E] hover:bg-[#1f5a37] text-white' : 'btn-ghost'"
                    @click="setSortBy('hot')"
                  >
                    <i class="i-lucide-flame h-4 w-4 mr-2" />
                    Hot
                  </button>
                  <button
                    class="btn"
                    :class="sortBy === 'new' ? 'bg-[#297D4E] hover:bg-[#1f5a37] text-white' : 'btn-ghost'"
                    @click="setSortBy('new')"
                  >
                    <i class="h-4 w-4 mr-2 i-lucide-clock" />
                    New
                  </button>
                  <button
                    class="btn"
                    :class="sortBy === 'top' ? 'bg-[#297D4E] hover:bg-[#1f5a37] text-white' : 'btn-ghost'"
                    @click="setSortBy('top')"
                  >
                    <i class="h-4 w-4 mr-2 i-lucide-trending-up" />
                    Top
                  </button>
                </div>


                <div class="flex items-center space-x-3">
                  <button
                    v-if="isModerator"
                    class="btn"
                    :class="isSelectMode ? 'bg-[#297D4E] hover:bg-[#1f5a37]' : 'btn-outline border-gray-300'"
                    @click="toggleSelectMode"
                  >
                    <i class="-lucide-check-circle h-4 w-4 mr-2" />
                    {{ isSelectMode ? 'Cancel' : 'Select' }}
                  </button>
                  <div class="badge bg-[#297D4E]/10 text-[#297D4E]">
                    {{ posts.length }} posts 
                  </div>
                </div>
              </div>
            </div>
          </div>
        
          <div v-if="isModerator && isSelectMode" class="shadow card border p-4 border-[#297D4E]/20 bg-[#297D4E]/5">
            <div class="p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      :checked="selectedPosts.length === posts.length && posts.length > 0"
                      class="rounded border-gray-300 text-[#297D4E] focus:ring-[#297D4E]"
                      @change="handleSelectAll"
                    >
                    <span class="text-sm font-medium">
                      {{ selectedPosts.length === posts.length && posts.length > 0 ? 'Deselect All' : 'Select All' }}
                    </span>
                  </div>
                  <div v-if="selectedPosts.length > 0" class="bg-[#297D4E] text-white badge">
                    {{ selectedPosts.length }} selected
                  </div>
                </div>

                <div v-if="selectedPosts.length > 0" class="flex items-center space-x-2">
                  <button
                    class="btn btn-outline text-green-600 hover:bg-green-50"
                    @click="() => handleBulkAction('approve')"
                  >
                    <i class="i-lucide-check-circle h-4 w-4 mr-2" />
                    Approve ({{ selectedPosts.length }})
                  </button>
                  <button
                    class="btn btn-outline text-red-600 hover:bg-red-50"
                    @click="() => handleBulkAction('remove')"
                  >
                    <i class="i-lucide-x-circle h-4 w-4 mr-2" />
                    Remove ({{ selectedPosts.length }})
                  </button>
                </div>
              </div>
            </div>
          </div>

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
          :is-moderator="isModerator"
          :is-select-mode="isSelectMode"
          @vote="handleVote"
          @select-post="handleSelectPost"
          @bookmark-click="handleBookmark"
          @post-action="handlePostAction"
        />
      </div>

        <!-- Right Sidebar -->
        <div class="lg:col-span-1 space-y-4">
          <!-- Community Info -->
          <div class="shadow card bg-base-100 border p-4 border-gray-300">
            <div class="text-lg flex items-center font-medium mb-4">
              <i class="i-lucide-users h-5 w-5 mr-2 text-[#297D4E]" />
              About Community
            </div>
            <div class="space-y-4">
              <p class="text-sm text-gray-500 first-letter:capitalize">{{ community?.long_description }}</p>

              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm">Members</span>
                  <span class="text-sm font-medium">
                    {{ community?.member_count ? formatNumber(community.member_count) : '' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm">Online</span>
                  <span class="text-sm font-medium text-green-600">{{ onlineCount }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm">Created</span>
                  <span class="text-sm font-medium">
                    {{ community?.created_at ? formatDate(community?.created_at) : '' }}
                  </span>
                </div>
              </div>

              <button class="w-full btn text-white bg-[#297D4E] hover:bg-[#1f5a37]" @click="handleJoin">
                {{ isJoined ? 'Joined' : 'Join Community' }}
              </button>

              <template v-if="isModerator">
                <div class="border-t border-gray-300 pt-4 mt-4">
                  <h4 class="font-medium text-[#297D4E] mb-3 flex items-center">
                    <i class="i-lucide-settings h-4 w-4 mr-2" />
                    Quick Settings
                  </h4>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="text-sm">Post Approval</span>
                      <input 
                      type="checkbox" 
                      class="toggle checked:bg-[#297D4E] checked:border-[#297D4E] checked:text-white" 
                      :checked="false" 
                      >
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm">Allow Images</span>
                      <input 
                      type="checkbox" 
                      class="toggle checked:bg-[#297D4E] checked:border-[#297D4E] checked:text-white" 
                      :checked="true" 
                      >
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm">Allow Links</span>
                      <input 
                      type="checkbox" 
                      class="toggle checked:bg-[#297D4E] checked:border-[#297D4E] checked:text-white" 
                      :checked="true" 
                      >
                    </div>
                  </div>
                </div>
                <button class="btn btn-outline border-gray-300 w-full mt-3">
                  <i class="i-lucide-settings h-4 w-4 mr-2" />
                  Full Settings
                </button>
              </template>
            </div>
          </div>

          <!-- Community Rules -->
          <div class="shadow card bg-base-100 border p-4 border-gray-300"> 
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
                  <p class="text-sm text-gray-500">{{ rule }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Moderators -->
          <div class="shadow card bg-base-100 border p-4 border-gray-300">
            <div class="text-lg flex items-center font-medium mb-4">
              <i class="i-lucide-shield h-5 w-5 mr-2 text-[#297D4E]" />
              Moderators
            </div>
            <div>
              <div class="space-y-3">
                <div v-for="(mod, index) in community?.moderators" :key="index" class="flex items-center space-x-3">
                  <div v-if="mod?.avatar_url" class="avatar">
                    <div class="w-7 rounded-full">
                      <img :src="mod?.avatar_url" class="rounded-full" alt="User Avatar">
                    </div>
                  </div>
                  <div v-else class="avatar avatar-placeholder">
                    <div class="bg-gray-300 text-neutral-content w-7 rounded-full">
                      <span class="text-lg">{{ mod?.username?.split(' ').map(n => n[0]).join('') }}</span>
                    </div>
                  </div>
                  <NuxtLink :to="`/user/${mod?.username}`" class="text-sm hover:underline">
                    u/{{ mod?.username }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification';
import type { Post, Community } from '~/types/utility'
import PostCard from '~/components/forum/post/post-card.vue';

// Define props
const toast = useToast();
const route = useRoute();
const user = useSupabaseUser();

const posts = ref<Post[]>([]);
// const isModerator = ref(false);
const isSelectMode = ref(false);
const selectedPosts = ref<string[]>([]);
const community = ref<Community | null>(null);
const sortBy = ref<'hot' | 'new' | 'top'>('hot');

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

// Show online count
const onlineCount = ref(0);

// Track current user's presence
watchEffect(() => {
  if (community.value && community.value.id) {
    useCommunityPresence(community.value.id);

    const { onlineCount: count } = useCommunityOnlineCount(community.value.id);
    onlineCount.value = count.value;
  }
});

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

watch(sortBy,  () => {
  refreshPosts();
}, {immediate: true})


const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatNumber = (num: number) => {
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
}

const communityName = computed(() => (
  community.value?.slug as string)?.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/^([a-z])/, (_, c) => c.toUpperCase())
)

const communityRules = computed<string[]>(() => {
  const rules = community.value?.rules as string[];
  
  if (Array.isArray(rules)) {
    return rules; // TypeScript knows this is string[] from the generic
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

const isJoined = ref(false);

watchEffect(() => {
  isJoined.value = !!community.value?.community_members?.some((member) => member.user_id === user.value?.id);
});

const handleJoin = () => {
  if (community.value) {
    isJoined.value = !isJoined.value;
    // Here you should also update the backend or community.value.community_members accordingly
  }
}


const handleVote = async (postId: string, voteType: 'up' | 'down' | null) => {
  const postIndex = posts.value.findIndex(p => p.id === postId);
  if (postIndex === -1) return;

  const post = posts.value[postIndex];
  
  // Calculate new votes
  let newUpvotes = post.upvotes ?? 0;
  let newDownvotes = post.downvotes ?? 0;
  let newUserVote = voteType;
  let karmaChange = 0; // Track karma difference

  // Remove previous vote if exists
  if (post.user_vote === 'up') {
    newUpvotes -= 1;
    karmaChange -= 1; // Remove previous upvote karma
  } else if (post.user_vote === 'down') {
    newDownvotes -= 1;
    karmaChange += 1; // Remove previous downvote karma
  }

  // Toggle vote if clicking same vote again
  if (post.user_vote === voteType) {
    newUserVote = null;
  } else {
    // Apply new vote
    if (post.user_vote !== voteType) {
      if (voteType === 'up') {
        newUpvotes += 1;
        karmaChange += 1; // Add new upvote karma
      } else if (voteType === 'down') {
        newDownvotes += 1;
        karmaChange -= 1; // Add new downvote karma
      }
    }
  }
  const updatedPost = {
    ...post,
    upvotes: newUpvotes,
    downvotes: newDownvotes,
    user_vote: newUserVote,
  };

  try {
    // Update post hot score
    await $fetch('/api/posts/update-hotscore', {
      method: 'POST',
      body: { post: updatedPost }
    });

    // Update author's karma if vote actually changed
    if (karmaChange !== 0 && post.author_id) {
      await $fetch('/api/users/update-karma', {
        method: 'POST',
        body: { post_karma: karmaChange, karma: karmaChange }
      });
    }
    
    // Update local state
    posts.value = [
      ...posts.value.slice(0, postIndex),
      updatedPost,
      ...posts.value.slice(postIndex + 1)
    ];
  } catch (error) {
    console.error('Failed to update vote:', error);
    // Consider reverting UI state if the API call fails
    // For example, you could re-fetch posts to restore correct state:
    await refreshPosts();
    // Or, if you want to optimistically revert just the affected post:
    posts.value[postIndex] = post; // revert to original post object
    // Optionally, show a toast to inform the user
    toast.error('Failed to update vote. Please try again.');
  }
};

const handleBookmark = () => {
  console.log('bookmarked!...');
}

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

const handleSelectAll = () => {
  const allPostIds = posts.value.map((post) => post.id).filter((id): id is string => typeof id === 'string')
  selectedPosts.value = selectedPosts.value.length === posts.value.length ? [] : allPostIds
}

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

const setSortBy = (sort: 'hot' | 'new' | 'top') => {
  sortBy.value = sort
}
</script>