<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="sticky top-0 z-50 w-full border-b border-gray-300 bg-white/80 backdrop-blur-md">
      <div class=" flex h-16 items-center justify-between px-4">
        <NuxtLink to="/posts" class="ml-4">
          <img src="/svg/markins-logo.svg" class="h-8 hidden md:block" >
          <img src="/svg/markins.svg" class="h-7 md:hidden" >
        </NuxtLink>

        <div class="flex items-center space-x-4">
          <NuxtLink to="/create-community">
            <button class="btn bg-[#297D4E] hover:bg-[#1f5a37] text-white">
              <i class="i-lucide-plus h-4 w-4 mr-2" />
              Create Community
            </button>
          </NuxtLink>
        </div>
      </div>
    </header>

    <div class=" px-4 py-6">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Communities</h1>
        <p class="text-gray-500">Discover and join scientific communities that match your interests</p>
      </div>

      <!-- Search and Filters -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div class="lg:col-span-3">
          <label class="input relative w-full">
            <i class="i-lucide-search absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              placeholder="Search communities..."
              :value="searchQuery"
              class="pl-10"
              @input="(e : Event) => searchQuery = (e.target as HTMLInputElement)?.value"
            >
          </label>
        </div>
        <div class="flex items-center space-x-2">
          <button
            class="btn"
            :class="viewMode === 'grid' ? 'bg-[#297D4E] hover:bg-[#1f5a37] text-white' : ''"
            @click="viewMode = 'grid'"
          >
            <i class="i-lucide-grid-3x3 h-4 w-4" />
          </button>
          <button
            class="btn"
            :class="viewMode === 'list' ? 'bg-[#297D4E] hover:bg-[#1f5a37] text-white' : ''"
            @click="viewMode = 'list'"
          >
            <i class="i-lucide-list h-4 w-4" />
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-4">
          <!-- Categories -->
          <div class="card shadow p-4 border border-gray-300">
            <div class="text-lg mb-4 font-medium">Categories</div>
            <div class="space-y-2">
              <button
                v-for="category in categories"
                :key="category.id"
                class="cursor-pointer"
                :class="`w-full text-left p-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  selectedCategory === category.id ? 'bg-[#297D4E]/10 text-[#297D4E]' : 'hover:bg-gray-50'
                }`"
                @click="selectedCategory = category.id"
              >
                <span>{{ category.icon }}</span>
                <span class="text-sm">{{ category.name }}</span>
              </button>
            </div>
          </div>

          <!-- Sort Options -->
          <div class="card shadow px-4 py-8 border border-gray-300">
            <div class="text-lg flex items-center mb-4 font-medium">
              <i class="i-lucide-filter h-5 w-5 mr-2 text-[#297D4E]" />
              Sort by
            </div>
            <div class="dropdown dropdown-start">
              <div tabindex="0" role="button" class="btn m-1 w-full justify-between">
                <div>
                  <i :class="getSortIcon(sortBy)" />
                  {{ sortBy }}
                </div>
                <i class="h-4 w-4 ml-2 i-lucide-chevron-down" /> 
              </div>
              <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-72 p-2 shadow-sm">
                <li>
                  <a @click="sortBy = 'members'">
                    <i class="h-4 w-4 mr-2 i-lucide-users" />
                    Members
                  </a>
                </li>
                <li>
                  <a @click="sortBy = 'growth'">
                    <i class="h-4 w-4 mr-2 i-lucide-trending-up" />
                    Growth
                  </a>
                </li>
                <li>
                  <a @click="sortBy = 'activity'">
                    <i class="h-4 w-4 mr-2 i-lucide-star" />
                    Activity
                  </a>
                </li>
                <li>
                  <a @click="sortBy = 'newest'">
                    <i class="h-4 w-4 mr-2 i-lucide-clock" />
                    Newest
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Communities Grid/List -->
        <div class="lg:col-span-3">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-2">
              <i :class="getSortIcon(sortBy)" />
              <span class="font-medium">{{ filteredCommunities.length }} communities</span>
            </div>
          </div>

          <div :class="viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'">
            <div
              v-for="community in filteredCommunities"
              :key="community.id"
              class="hover:shadow-md card border border-gray-300 shadow transition-all duration-300"
            >
              <div :class="viewMode === 'grid' ? 'p-6' : 'p-4'">
                <div :class="viewMode === 'grid' ? 'space-y-4' : 'flex items-center justify-between'">
                  <div :class="viewMode === 'grid' ? 'space-y-3' : 'flex items-center space-x-4 flex-1'">
                    <NuxtLink :to="`/m/${community.slug}`">
                      <div :class="viewMode === 'grid' ? 'flex items-center space-x-3' : 'flex items-center space-x-3'">
                        <div class="text-3xl">{{ community.icon }}</div>
                        <div>
                          <div class="flex items-center space-x-2">
                            <h3 class="text-lg font-semibold hover:text-[#297D4E] transition-colors cursor-pointer">
                              {{ community.name }}
                            </h3>
                            <div v-if="community.is_official" class="bg-[#297D4E]/10 text-[#297D4E] badge">Official</div>
                          </div>
                          <p class="text-sm text-gray-500 capitalize">{{ community.slug?.replace('-', ' ') }}</p>
                        </div>
                      </div>
                    </NuxtLink>

                    <p v-if="viewMode === 'grid'" class="text-sm text-gray-700">{{ community.description }}</p>

                    <div
                      :class="
                        viewMode === 'grid'
                          ? 'grid grid-cols-2 gap-4 text-sm'
                          : 'flex items-center space-x-4 text-sm text-gray-500'
                      "
                    >
                      <div class="flex items-center space-x-1">
                        <i class="i-lucide-users h-4 w-4 text-gray-500" />
                        <span>{{ community.member_count }} members</span>
                      </div>
                      <div class="flex items-center space-x-1">
                        <div class="h-2 w-2 rounded-full bg-green-500"/>
                        <span>{{ onlineMembers }} online</span>
                      </div>
                      <template v-if="viewMode === 'grid'">
                        <div class="flex items-center space-x-1">
                          <i class="i-lucide-trending-up h-4 w-4 text-green-600" />
                          <span class="text-green-600">{{ community.growth_rate }}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                          <i class="i-lucide-star h-4 w-4 text-gray-500" />
                          <span>{{ community.posts_today }} posts today</span>
                        </div>
                      </template>
                    </div>
                  </div>

                  <div :class="viewMode === 'grid' ? '' : 'flex-shrink-0'">
                    <button
                      :variant="community.is_joined ? 'secondary' : 'default'"
                      class="btn"
                      :class="community.is_joined ? '' : 'bg-[#297D4E] hover:bg-[#1f5a37] text-white'"
                      @click="handleJoinCommunity(community.id!)"
                    >
                      {{ community.is_joined ? 'Joined' : 'Join' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="filteredCommunities.length === 0" class="card shadow border border-gray-300">
            <div class="p-8 text-center">
              <i class="i-lucide-search h-12 w-12 mx-auto text-gray-500 mb-4" />
              <h3 class="text-lg font-semibold mb-2">No communities found</h3>
              <p class="text-gray-500 mb-4">Try adjusting your search terms or filters</p>
              <NuxtLink to="/create-community">
                <button class="bg-[#297D4E] hover:bg-[#1f5a37]">
                  <i class="i-lucide-plus h-4 w-4 mr-2" />
                  Create a Community
                </button>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification';
import type { Community } from '~/types/utility';
import type { Database } from '~/types/database.types';

const toast = useToast();
const user = useSupabaseUser();

const supabase = useSupabaseClient<Database>();

// State
const searchQuery = ref('')
const viewMode = ref('grid')
const sortBy = ref('members')
const selectedCategory = ref('all')
const filteredCommunities = ref<Community[]>([])

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
      case 'new':
        return new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
      default:
        return 0
    }
  })

  filteredCommunities.value = filtered;
})

const handleJoinCommunity = (communityId: string) => {
  if (communities.value) {
    communities.value = communities.value.map((community) =>
      community.id === communityId ? { ...community, is_joined: !community.is_joined } : community,
    )
  }
}

const getSortIcon = (sort : string) => {
  switch (sort) {
    case 'members':
      return 'i-lucide-users'
    case 'growth':
      return 'i-lucide-trending-up'
    case 'activity':
      return 'i-lucide-star'
    case 'new':
      return 'i-lucide-clock'
    default:
      return 'i-lucide-users'
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
  () => {
    if (!communities.value) return;
    // Add is_joined property to each community
    communities.value.forEach((community) => {
      community.is_joined = !!community.community_members?.some(
        (member) => member.user_id === user.value?.id
      );
      if (Array.isArray(community.posts_today)) {
        community.posts_today = community.posts_today[0]?.count || 0;
      }
      getCommunityGrowthRate(community.id!).then(rate => {
        community.growth_rate = rate;
      });
    });
    filteredCommunities.value = [...communities.value];
  },
  { immediate: true }
)
</script>