<template>
  <BaseLayout>
    <template #header>
      <ForumNavbar>
        <template  #dynamic-content>
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
      <div class="px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 gap-y-4">
          <div class="shadow card bg-base-100 border p-4 border-gray-300 mb-4">
            <div className="mb-4">
              <div className="text-lg flex items-center">
                <i className="i-lucide-filter h-5 w-5 mr-2 text-[#297D4E]" />
                Filters
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <select 
                v-model="type"
                class="select" 
                >
                  <option value="all" defaultValue>All</option>
                  <option value="posts">Posts</option>
                  <option value="comments">Comments</option>
                  <option value="communities">Communities</option>
                  <option value="users">Users</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sort by</label>
                <select 
                v-model="sort"
                class="select" 
                >
                  <option value="relevance">Relevance</option>
                  <option value="new">New</option>
                  <option value="top">Top</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Time</label>
                <select v-model="time" class="select">
                  <option value="all">All time</option>
                  <option value="day">Past Day</option>
                  <option value="week">Past Week</option>
                  <option value="month">Past Month</option>
                  <option value="year">Past Year</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Recent Searches -->
          <div 
          v-if="recentSearches.length > 0"
          class="shadow card bg-base-100 border p-4 border-gray-300" 
          >
              <div class="text-lg flex items-center">
                <i class="i-lucide-clock h-5 w-5 mr-2 text-[#297D4E]" />
                Recent Searches
              </div>
              <div class="space-y-2">
                <button
                  v-for="(search, index) in recentSearches"
                  :key="index"
                  class="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  @click="handleSearch(search)"
                >
                  {{ search }}
                </button>
              </div>
            </div>
            <div 
              v-else 
              class="shadow card bg-base-100 border p-4 border-gray-300" 
            >
            <div class="p-8 text-center">
              <i class="i-lucide-clock h-12 w-12 mx-auto text-gray-500 mb-4" />
              <h3 class="text-lg font-semibold mb-2">No recent searches</h3>
              <p class="text-gray-500">Your recent searches will appear here</p>
            </div>
          </div>
        </div>
        
        <!-- Search Results -->
        <div class="lg:col-span-3">
          <div 
          v-if="!query"
          class="shadow card bg-base-100 border p-4 border-gray-300" 
          >
            <div class="p-8 text-center">
              <i class="i-lucide-search h-12 w-12 mx-auto text-gray-500 mb-4" />
              <h3 class="text-lg font-semibold mb-2">Search markins</h3>
              <p class="text-gray-500">
                Find posts, comments, communities, and users across the platform
              </p>
            </div>
          </div>

          <div v-else class="space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">Search results for "{{ searchQuery }}"</h2>
              <div class="bg-[#297D4E]/10 text-[#297D4E] badge">
                {{ results.length }} results
              </div>
            </div>

            <div v-if="isLoading" class="space-y-4">
              <div 
              v-for="i in 3" 
              :key="i"
              class="shadow bg-base-100 card border p-4 border-gray-300" 
              >
                <div class="p-4">
                  <div class="animate-pulse space-y-3">
                    <div class="h-4 bg-gray-200 rounded w-3/4"/>
                    <div class="h-3 bg-gray-200 rounded w-1/2"/>
                    <div class="h-3 bg-gray-200 rounded w-full"/>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="results.length > 0" class="space-y-4">
              <component :is="renderResult(result)" v-for="result in results" :key="result.id" />
            </div>

            <div 
            v-else
            class="shadow border p-4 border-gray-300" 
            >
              <div class="p-8 text-center">
                <i class="h-12 w-12 mx-auto text-gray-500 mb-4 i-lucide-search" />
                <h3 class="text-lg font-semibold mb-2">No results found</h3>
                <p class="text-gray-500">Try adjusting your search terms or filters</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </template>
  </BaseLayout>
</template>

<script setup>
import BaseLayout from '~/layouts/base.vue';
import ForumNavbar from '~/components/header/forum-navbar.vue';

const recentSearches = ref([]);

const { query, type, sort, time, results, isLoading } = useSearch();

onMounted(() => {
  // Load recent searches from localStorage
  const saved = localStorage.getItem('recentSearches')
  if (saved) {
    recentSearches.value = JSON.parse(saved)
  }
})

const handleSearch = (query) => {
  query.value = query
}

const renderResult = (result) => {
  switch (result.type) {
    case 'post':
      return {
        template: `
          <div class="shadow border p-4 border-gray-300 hover:shadow-md transition-all duration-300">
            <div class="p-4">
              <div class="flex items-center space-x-2 mb-2">
                <i class="i-lucide-file-text h-4 w-4 text-gray-500" />
                <div class="badge">Post</div>
                <div class="text-sm">${result.communityIcon}</div>
                <NuxtLink
                  :to="'/r/' + result.community?.slice(2)"
                  class="text-sm font-medium text-[#297D4E] hover:underline"
                >
                  ${result.community}
                </NuxtLink>
                <span class="text-xs text-gray-500">•</span>
                <span class="text-xs text-gray-500">by ${result.author}</span>
                <span class="text-xs text-gray-500">${result.timeAgo}</span>
              </div>

              <NuxtLink :to="'/post/' + result.id">
                <h3 class="text-lg font-semibold mb-2 hover:text-[#297D4E] transition-colors cursor-pointer">
                  ${result.title}
                </h3>
              </NuxtLink>

              <p class="text-sm text-gray-700 mb-3 line-clamp-2">${result.content}</p>

              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <div class="flex items-center space-x-1">
                  <i class="i-lucide-chevron-up h-4 w-4" />
                  <span>${result.upvotes}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <i class="i-lucide-message-square h-4 w-4" />
                  <span>${result.comments}</span>
                </div>
              </div>
            </div>
          </div>
        `,
        props: ['result']
      }

    case 'comment':
      return {
        template: `
          <div class="shadow border p-4 border-gray-300 hover:shadow-md transition-all duration-300">
            <div class="p-4">
              <div class="flex items-center space-x-2 mb-2">
                <i class="i-lucide message-square h-4 w-4 text-gray-500" />
                <div class="badge">Comment</div>
                <span class="text-sm text-gray-500">in</span>
                <div class="text-sm">${result.communityIcon}</div>
                <NuxtLink
                  :to="'/r/' + result.community?.slice(2)"
                  class="text-sm font-medium text-[#297D4E] hover:underline"
                >
                  ${result.community}
                </NuxtLink>
                <span class="text-xs text-gray-500">•</span>
                <span class="text-xs text-gray-500">by ${result.author}</span>
                <span class="text-xs text-gray-500">${result.timeAgo}</span>
              </div>

              <p class="text-sm text-gray-700 mb-3">${result.content}</p>

              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <div class="flex items-center space-x-1">
                  <i class="i-lucide-chevron-up h-4 w-4" />
                  <span>${result.upvotes}</span>
                </div>
              </div>
            </div>
          </div>
        `,
        props: ['result']
      }

    case 'community':
      return {
        template: `
          <div class="shadow border p-4 border-gray-300" class="hover:shadow-md transition-all duration-300">
            <div class="p-4">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <i class="i-lucide-building h-4 w-4 text-gray-500" />
                    <div class="badge">Community</div>
                    <span class="text-xs text-gray-500">${result.timeAgo}</span>
                  </div>

                  <NuxtLink :to="'/r/' + result.community?.slice(2)">
                    <div class="flex items-center space-x-3 mb-2">
                      <div class="text-2xl">${result.communityIcon}</div>
                      <div>
                        <h3 class="text-lg font-semibold hover:text-[#297D4E] transition-colors cursor-pointer">
                          ${result.community}
                        </h3>
                        <p class="text-sm text-gray-500">${result.members} members</p>
                      </div>
                    </div>
                  </NuxtLink>

                  <p class="text-sm text-gray-700">${result.content}</p>
                </div>

                <button
                  class="btn text-white"
                  :class="result.isJoined ? '' : 'bg-[#297D4E] hover:bg-[#1f5a37]'"
                >
                  ${result.isJoined ? 'Joined' : 'Join'}
                </button>
              </div>
            </div>
          </div>
        `,
        props: ['result']
      }

    case 'user':
      return {
        template: `
          <div class="shadow border p-4 border-gray-300 hover:shadow-md transition-all duration-300">
            <div class="p-4">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <i class="i-lucide-user h-4 w-4 text-gray-500" />
                    <div class="badge">User</div>
                    <span class="text-xs text-gray-500">${result.timeAgo}</span>
                  </div>

                  <NuxtLink :to="'/user/' + result.author">
                    <div class="flex items-center space-x-3 mb-2">
                      <Avatar class="h-12 w-12">
                        <AvatarImage :src="result.authorAvatar || '/svg/placeholder.svg'" />
                        <AvatarFallback>
                          ${result.author?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 class="text-lg font-semibold hover:text-[#297D4E] transition-colors cursor-pointer">
                          ${result.author}
                        </h3>
                        <p class="text-sm text-gray-500">${result.karma?.toLocaleString()} karma</p>
                      </div>
                    </div>
                  </NuxtLink>

                  <p class="text-sm text-gray-700 mb-2">${result.content}</p>

                  <div v-if="result.badges && result.badges.length > 0" class="flex flex-wrap gap-1">
                    <div v-for="(badge, index) in result.badges" :key="index" class="badge bg-[#297D4E]/10 text-[#297D4E] text-xs">
                      <i class="h-3 w-3 mr-1 i-lucide-award" />
                      ${badge}
                    </div>
                  </div>
                </div>

                <button class="btn btn-outline">Follow</button>
              </div>
            </div>
          </div>
        `,
        props: ['result']
      }

    default:
      return null
  }
}
</script>