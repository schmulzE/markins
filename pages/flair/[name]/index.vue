<template>
  <BaseLayout>
    <template #header>
      <ForumNavbar>
        <template #dynamic-content>
          <nav class="flex items-center space-x-2 md:space-x-4">
            <NuxtLink to="/posts" class="hidden md:block text-sm font-medium hover:text-[#297D4E] transition-colors">
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
      <!-- Flair Header -->
      <div class="bg-gradient-to-r from-[#297D4E] to-[#1f5a37] text-white">
        <div class=" px-4 py-8">

          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-3">
                <i class="i-lucide-tag h-8 w-8" />
                <div>
                  <div class="flex items-center space-x-3 mb-2">
                    <span
                      class="badge text-lg px-3 py-1 font-medium rounded-full"
                    >
                      {{ flair?.display_name }}
                      
                    </span>
                  </div>
                  <p class="text-lg opacity-90 max-w-2xl">{{ flair?.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div class="text-center">
              <div class="text-2xl font-bold">{{ flairInfo?.totalPosts?.toLocaleString() }}</div>
              <div class="text-sm opacity-75">Total Posts</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold">{{ stats?.thisWeek }}</div>
              <div class="text-sm opacity-75">This Week</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold">{{ stats?.totalContributors.toLocaleString() }}</div>
              <div class="text-sm opacity-75">Contributors</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-300">{{ flairInfo.weeklyGrowth }}</div>
              <div class="text-sm opacity-75">Growth</div>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 py-6">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Main Content -->
          <div class="lg:col-span-3 space-y-4">

            <PostToolbar
              :posts="posts"
              :sort-by="sortBy"
              @update:sort-by="(val: 'hot' | 'new' | 'top') => {
                sortBy = val
                refreshPosts()
              }"
            />

            <PostCard
              :post-data="posts"
              @vote="handleVote"
              @hide-click="handleHidePost"
            />
            
            <div v-show="posts.length > 10" class="text-center py-8">
              <button
                class="btn"
                :disabled="!hasMore"
                @click="() => loadPosts"
              >
                Load More Posts
              </button>
            </div>
          </div> 

          <!-- Right Sidebar -->
          <div class="lg:col-span-1 space-y-4">
            <!-- Flair Info -->
            <FlairInfo 
            :flair-info 
            :flair-id="flair?.id!" 
            :total-contributors="stats?.totalContributors!" 
            @follow-fair="handleFollowFlair"
            />

            <!-- Top Communities --> 
            <flairTopCommunities :flair-info />

            <!-- Related Flairs -->
            <RelatedFlair :flair-info/>

            <!-- Top Contributors -->
            <FlairContributors :stats="stats!"/>

            <!-- Activity Chart -->
            <ActivityChart :show-stats :stats="stats!"/>

          </div>
        </div>
      </div>
    </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '~/layouts/base.vue';
import { useToast } from 'vue-toastification';
import type { Flair, Post } from '~/types/utility';
import PostCard from '~/components/forum/post/post-card.vue';
import ForumNavbar from '~/components/header/forum-navbar.vue';
import FlairInfo from '~/components/forum/flair/flair-info.vue';
import PostToolbar from '~/components/forum/post/post-toolbar.vue';
import RelatedFlair from '~/components/forum/flair/related-flair.vue';
import ActivityChart from '~/components/forum/flair/activity-chart.vue';
import FlairContributors from '~/components/forum/flair/flair-contributors.vue';
import flairTopCommunities from '~/components/forum/flair/flair-top-communities.vue';

const route = useRoute();
const toast = useToast();
const supabase = useSupabaseClient();

const  { votePost } = useVote();

export interface FlairStats {
  totalPosts: number | null
  totalContributors: number
  thisWeek: number
  lastWeek: number
  weeklyGrowthPercent: number
  topContributors: {
    username: string
    avatar_url: string | null
    count: number
  }[]
  postsByDay: {
    day: string // e.g. 'Mon', 'Tue'
    count: number
  }[]
}

export interface FlairInfo {
  name: string
  displayName: string
  description: string
  backgroundColor: string
  textColor: string
  type: string
  totalPosts: number
  totalUsers: number
  createdDate: string
  isFollowing: boolean
  relatedFlairs: string[]
  topCommunities: { name: string; icon: string; count: number }[]
  weeklyGrowth: string
}

interface ApiResponse<T> {
  data: T;
  totalCount: number;
  error?: string;
}

const flairInfo = ref<FlairInfo>({
  name: '',
  displayName: '',
  description: '',
  backgroundColor: '',
  textColor: '',
  type: '', // "post" | "user"
  totalPosts: 0,
  totalUsers: 0,
  createdDate: '',
  isFollowing: false,
  relatedFlairs: [],
  topCommunities: [
    { name: 'm/QuantumPhysics', icon: '⚛️', count: 234 },
    { name: 'm/Genetics', icon: '🧬', count: 189 },
    { name: 'm/Astronomy', icon: '🔭', count: 156 },
  ],
  weeklyGrowth: '',
})

const page = ref(1);
const pageSize = 10;
const hasMore = ref(true);
const sortBy = ref('hot');
const showStats = ref(true);
const posts = ref([] as Post[]);
const flair = ref<Flair | null>(null);
const stats =  ref<FlairStats | null>(null);


const { data: flairData, error: flairError } = await useAsyncData(
  'flair', 
  async () => {
    const response = await $fetch(`/api/flairs/${route.params.name}`);
    return response?.data;
  }
);

// Transform or cast the fetched data to match the Community type structure
flair.value = flairData.value ?? null;
flairInfo.value.createdDate = flair.value?.created_at ?? '';

if (flairError.value) {
  toast.error('An error occurred while trying to fetch community');
}

const { data, error: flairStatError } = await supabase.rpc('get_flair_stats', {
  flair_name_input: route.params.name as string,
})


const result = data as unknown as FlairStats;


if (result) {
  stats.value = {
    totalPosts: posts.value.length, // this comes from a separate query
    totalContributors: result.totalContributors,
    thisWeek: result.thisWeek,
    lastWeek: result.lastWeek,
    weeklyGrowthPercent: result.weeklyGrowthPercent,
    topContributors: result.topContributors.map((c) => ({
      username: c.username,
      avatar_url: c.avatar_url,
      count: c.count,
    })),
    postsByDay: result.postsByDay,
  }
  flairInfo.value.weeklyGrowth = `${result.weeklyGrowthPercent}%`
}

if (flairStatError) {
  toast.error('Error while fetching flair stats')
}

const relatedFlairs = computed(() => {
  return ['discussion', 'theory', 'experiment', 'review', 'meta', 'research', 'questions'].filter(f => f !== flair.value?.name).splice(0, 3)
})

flairInfo.value.relatedFlairs = relatedFlairs.value;

// Methods
const loadPosts = async (reset = false) => {
  if (reset) {
    posts.value = [];
    page.value = 1;
    hasMore.value = true;
  }

  try {
    const response = await $fetch<ApiResponse<Post[]>>(`/api/posts/flair/${flair.value?.id}`, {
      params: {
        sort: sortBy.value,
        page: page.value,
        pageSize
      }
    });

    const newPosts: Post[] = response?.data ?? [];

    if (reset) {
      posts.value = newPosts;
    } else {
      posts.value.push(...newPosts);
    }

    flairInfo.value.totalPosts = response.totalCount ?? 0

    if (newPosts.length < pageSize) {
      hasMore.value = false;
    } else {
      page.value += 1;
    }
  } catch (err) {
    console.error('Error fetching posts:', err);
    toast.error('An error occurred while trying to fetch posts');
  }
};

const handleVote = (postId: string, voteType: 'up' | 'down') => {
  if(!posts.value) return;
  votePost(posts.value as Post[], postId, voteType);
};

const handleFollowFlair = () => {
  flairInfo.value.isFollowing = !flairInfo.value.isFollowing
}

const handleHidePost = (postId: string) => {
  // Hide the post by filtering it out from the posts array
  const postIndex = posts.value.findIndex(post => post.id === postId);
  if (postIndex !== -1) {
    posts.value = [
      ...posts.value.slice(0, postIndex),
      ...posts.value.slice(postIndex + 1)
    ];
  }
  toast.success('Post hidden');
  console.log('Post hidden:', postId);
}

// Used by sort change
const refreshPosts = () => loadPosts(true);

// Load initial posts
onMounted(() => loadPosts());

</script>