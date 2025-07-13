<script lang="ts" setup>
import type { Community } from '~/types/utility';

const emit = defineEmits(['join-community'])
const { onlineCounts } = useOnlineCounts();

  defineProps<{
    viewMode: 'grid' | 'list';
    filteredCommunities: Community[];
    sortBy: 'members' | 'growth' | 'activity' | 'newest';
  }>();

  const handleJoinCommunity = (communityId: string) => {
    emit('join-community', communityId)
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

const formatNumber = (num: number) => {
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
}
</script>

<template>
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
        class="hover:shadow-md card border bg-base-100 border-gray-300 dark:border-base-300 shadow"
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
                  <span>{{ formatNumber(community.member_count!) }} members</span>
                </div>
                <div class="flex items-center space-x-1">
                  <div class="h-2 w-2 rounded-full bg-green-500"/>
                  <span>{{ onlineCounts[community.id ?? ''] || 0 }} online</span>
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

    <div v-if="filteredCommunities.length === 0" class="card shadow bg-base-100 border border-gray-300 dark:border-base-300">
      <div class="p-8 text-center">
        <i class="i-lucide-search h-12 w-12 mx-auto text-gray-500 mb-4" />
        <h3 class="text-lg font-semibold mb-2">No communities found</h3>
        <p class="text-gray-500 mb-4">Try adjusting your search terms or filters</p>
        <NuxtLink to="/create-community" class="btn bg-[#297D4E] hover:bg-[#1f5a37]">  
          <i class="i-lucide-plus h-4 w-4 mr-2" />
          Create a Community
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
