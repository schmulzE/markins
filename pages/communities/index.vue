<template>
  <BaseLayout>
    <template #header>
      <ForumNavbar>
        <template #dynamic-content>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/create-community">
              <button class="btn bg-[#297D4E] hover:bg-[#1f5a37] text-white">
                <i class="i-lucide-plus h-4 w-4 mr-2" />
                Create Community
              </button>
            </NuxtLink>
          </div>
        </template>
      </ForumNavbar>
    </template>
    <template #main>
      <div class=" px-4 py-6">
        <!-- Page Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold mb-2">Communities</h1>
          <p class="text-gray-500">Discover and join scientific communities that match your interests</p>
        </div>

        <!-- Search and Filters -->
         <ForumCommunitySearchFilter
          :view-mode="viewMode"
          :search-query="searchQuery"
          @view-mode="viewMode = $event"
          @search-query="searchQuery = $event"
         />

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Sidebar -->
          <div class="lg:col-span-1 space-y-4">
            <!-- Categories -->
            <CommunityCategories
              :categories="categories"
              :selected-category="selectedCategory"
              @select-category="selectedCategory =  $event"
            />

            <!-- Sort Options -->
            <CommunitySortDropdown
              :sort-by="sortBy"
              @sort-by="sortBy = $event"
            />
          </div>

          <!-- Communities Grid/List -->
           <CommunityList
            :view-mode="viewMode"
            :filtered-communities="filteredCommunities"
            :sort-by="sortBy"
            @join-community="handleJoinCommunity"
          />
        </div>
      </div>
    </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '~/layouts/base.vue';
import { useToast } from 'vue-toastification';
import type { Community } from '~/types/utility';
import type { Database } from '~/types/database.types';
import ForumNavbar from '~/components/header/forum-navbar.vue';
import CommunityList from '~/components/forum/community/community-list.vue';
import { useCommunityMembership } from '~/composables/useCommunityMembership';
import CommunityCategories from '~/components/forum/community/community-categories.vue';
import CommunitySortDropdown from '~/components/forum/community/community-sort-dropdown.vue';

// const { onlineCounts } = useOnlineCounts();
const { joinCommunity, leaveCommunity } = useCommunityMembership();


const toast = useToast();
const user = useSupabaseUser();

const supabase = useSupabaseClient<Database>();

// State
const searchQuery = ref('');
const selectedCategory = ref('all');
const viewMode = ref<'grid'| 'list'>('grid');
const filteredCommunities = ref<Community[]>([]);
const sortBy = ref<'members' | 'growth' | 'activity' | 'newest'>('members');

const categories = [
  { id: 'all', name: 'All Categories', icon: '🔬' },
  { id: 'physics', name: 'Physics', icon: '⚛️' },
  { id: 'biology', name: 'Biology', icon: '🧬' },
  { id: 'chemistry', name: 'Chemistry', icon: '⚗️' },
  { id: 'astronomy', name: 'Astronomy', icon: '🔭' },
  { id: 'mathematics', name: 'Mathematics', icon: '📐' },
  { id: 'engineering', name: 'Engineering', icon: '⚙️' },
  { id: 'medicine', name: 'Medicine', icon: '🏥' },
  { id: 'environment', name: 'Environment', icon: '🌍' },
]


interface ApiResponse<T> {
  data: T;
  error?: string;
}

const { data: communities } = await useAsyncData(
  'communities', 
  async () => {
    try {
      const response = await $fetch<ApiResponse<Community[]>>(`/api/communities`);
      return response?.data || [];
    } catch {
      toast.error('An error occured while trying to fetch communities');
      return [];
    }
  }
);

// Filter and sort communities
watchEffect(() => {
  let filtered = [...communities.value!]

  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(
      (community) =>
        community.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        community.slug?.replace('-', ' ').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        community.description?.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }

  // Filter by category
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter((community) => community.category === selectedCategory.value)
  }

  // Sort communities
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'members':
        return Number.parseInt(String(b.member_count ?? '').replace(/[^\d]/g, '')) - Number.parseInt(String(a.member_count ?? '').replace(/[^\d]/g, ''))
      case 'growth':
        return (
          Number.parseInt(b.growth_rate!.replace(/[^\d]/g, '')) - Number.parseInt(a.growth_rate!.replace(/[^\d]/g, ''))
        )
      case 'activity':
        return b.posts_today! - a.posts_today!
      case 'newest':
        return new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
      default:
        return 0
    }
  })

  filteredCommunities.value = filtered;
})

const handleJoinCommunity = async (communityId: string) => {
  if (!user.value) {
    toast.error('You need to be logged in to join a community.')
    return
  }

  const community = communities.value?.find(c => c.id === communityId)
  if (!community) return

  try {
    if (community.is_joined) {
      await leaveCommunity(communityId)
      toast.success(`Left ${community.name}`)
    } else {
      await joinCommunity(communityId)
      toast.success(`Joined ${community.name}`)
    }

    community.is_joined = !community.is_joined
  } catch (err) {
    toast.error(`Failed to update membership. Please try again.`)
    console.error(err)
  }
}

async function getCommunityGrowthRate(communityId: string) {
  const { data: stats } = await supabase.rpc('get_community_growth', {
    comm_id: communityId
  });
  return stats || '0%';
}


watch(
  [() => communities.value, () => user.value],
  async () => {
    if (!communities.value) return;

    for (const community of communities.value) {
      community.is_joined = !!community.community_members?.some(
        (member) => member.user_id === user.value?.id
      )

      if (Array.isArray(community.posts_today)) {
        community.posts_today = community.posts_today[0]?.count || 0
      }

      community.growth_rate = await getCommunityGrowthRate(community.id!)
    }

    filteredCommunities.value = [...communities.value]
  },
  { immediate: true }
);
</script>