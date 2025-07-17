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
              <div class="flex items-center justify-between mb-3">
                <div class="text-lg flex items-center">
                  <i class="i-lucide-clock h-5 w-5 mr-2 text-[#297D4E]" />
                  Recent Searches
                </div>
                <button
                class="text-sm text-gray-500 hover:text-red-500 transition-colors"
                title="Clear all recent searches"
                @click="clearRecentSearches"
                >
                  <i class="i-lucide-trash-2 h-4 w-4" />
                </button>
              </div>
              <div class="space-y-2">
                <div
                  v-for="(search, index) in recentSearches"
                  :key="index"
                  class="flex items-center justify-between group"
                >
                  <button
                    class="flex-1 text-left p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    @click="useSearch(search)"
                  >
                    {{ search }}
                  </button>
                  <button
                  title="Remove this search"
                  class="p-1 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  @click="removeSearch(index)"
                  >
                    <i class="i-lucide-x h-3 w-3" />
                  </button>
                </div>
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
              <h2 class="text-xl font-semibold">Search results for "{{ query }}"</h2>
              <div class="bg-[#297D4E]/10 text-[#297D4E] badge">
                {{ results.posts.length + results.communities.length + results.users.length }} results
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

            <div v-else-if="results.posts.length > 0 || results.communities.length > 0 || results.users.length > 0" class="space-y-4">
              <!-- Posts -->
              <div v-if="results.posts.length > 0" class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-700">Posts</h3>
                <div v-for="post in results.posts" :key="post.id" class="shadow border p-4 border-gray-300 hover:shadow-md transition-all duration-300">
                  <div class="p-4">
                    <div class="flex items-center space-x-2 mb-2">
                      <i class="i-lucide-file-text h-4 w-4 text-gray-500" />
                      <div class="badge">Post</div>
                      <span class="text-sm text-gray-500">in</span>
                      <NuxtLink
                        :to="`/m/${post.community?.name}`"
                        class="text-sm font-medium text-[#297D4E] hover:underline"
                      >
                        m/{{ post.community?.name }}
                      </NuxtLink>
                      <span class="text-xs text-gray-500">•</span>
                      <span class="text-xs text-gray-500">by {{ post.author?.username }}</span>
                      <span class="text-xs text-gray-500">{{ formatDateTime(post.created_at) }}</span>
                    </div>

                    <NuxtLink :to="`/post/${post.id}`">
                      <h3 class="text-lg font-semibold mb-2 hover:text-[#297D4E] transition-colors cursor-pointer">
                        {{ post.title }}
                      </h3>
                    </NuxtLink>

                    <p class="text-sm text-gray-700 mb-3 line-clamp-2">{{ post.content }}</p>

                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                      <div class="flex items-center space-x-1">
                        <i class="i-lucide-chevron-up h-4 w-4" />
                        <span>{{ post.upvotes }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Communities -->
              <div v-if="results.communities.length > 0" class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-700">Communities</h3>
                <div v-for="community in results.communities" :key="community.id" class="shadow border p-4 border-gray-300 hover:shadow-md transition-all duration-300">
                  <div class="p-4">
                    <div class="flex items-center justify-between">
                      <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-2">
                          <i class="i-lucide-building h-4 w-4 text-gray-500" />
                          <div class="badge">Community</div>
                        </div>

                        <NuxtLink :to="`/m/${community.name}`">
                          <div class="flex items-center space-x-3 mb-2">
                            <div class="text-2xl">{{ community.icon }}</div>
                            <div>
                              <h3 class="text-lg font-semibold hover:text-[#297D4E] transition-colors cursor-pointer">
                                m/{{ community.name }}
                              </h3>
                              <p class="text-sm text-gray-500">{{ community.member_count }} members</p>
                            </div>
                          </div>
                        </NuxtLink>

                        <p class="text-sm text-gray-700">{{ community.description }}</p>
                      </div>

                      <button class="btn bg-[#297D4E] hover:bg-[#1f5a37] text-white">
                        Join
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Users -->
              <div v-if="results.users.length > 0" class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-700">Users</h3>
                <div v-for="user in results.users" :key="user.id" class="shadow border p-4 border-gray-300 hover:shadow-md transition-all duration-300">
                  <div class="p-4">
                    <div class="flex items-center justify-between">
                      <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-2">
                          <i class="i-lucide-user h-4 w-4 text-gray-500" />
                          <div class="badge">User</div>
                        </div>

                        <NuxtLink :to="`/user/${user.username}`">
                          <div class="flex items-center space-x-3 mb-2">
                            <div class="avatar">
                              <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                <img v-if="user.avatar_url" :src="user.avatar_url" class="w-full h-full rounded-full object-cover" >
                                <span v-else class="text-lg font-semibold text-gray-600">
                                  {{ user.username?.charAt(0).toUpperCase() }}
                                </span>
                              </div>
                            </div>
                            <div>
                              <h3 class="text-lg font-semibold hover:text-[#297D4E] transition-colors cursor-pointer">
                                {{ user.display_name || user.username }}
                              </h3>
                              <p class="text-sm text-gray-500">u/{{ user.username }}</p>
                            </div>
                          </div>
                        </NuxtLink>
                      </div>

                      <button class="btn btn-outline">Follow</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div 
            v-else
            class="shadow border bg-base-100 p-4 border-gray-300" 
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
import { formatDateTime } from '~/utils/formatters';

const recentSearches = ref([]);
const searchQuery = ref('');

const { query, type, sort, time, results, isLoading } = useSearch();

// Load recent searches from localStorage and handle URL query
onMounted(() => {
  const saved = localStorage.getItem('recentSearches')
  if (saved) {
    recentSearches.value = JSON.parse(saved)
  }
  
  // Check for query parameter in URL
  const route = useRoute()
  if (route.query.q) {
    const urlQuery = route.query.q
    query.value = urlQuery
    searchQuery.value = urlQuery
    addToRecentSearches(urlQuery)
  }
})

// Add search to recent searches
const addToRecentSearches = (searchTerm) => {
  if (!searchTerm.trim()) return
  
  // Remove if already exists
  const index = recentSearches.value.indexOf(searchTerm)
  if (index > -1) {
    recentSearches.value.splice(index, 1)
  }
  
  // Add to beginning
  recentSearches.value.unshift(searchTerm)
  
  // Keep only last 10 searches
  if (recentSearches.value.length > 10) {
    recentSearches.value = recentSearches.value.slice(0, 10)
  }
  
  // Save to localStorage
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
}

// Remove a specific search from recent searches
const removeSearch = (index) => {
  recentSearches.value.splice(index, 1)
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
}

// Clear all recent searches
const clearRecentSearches = () => {
  recentSearches.value = []
  localStorage.removeItem('recentSearches')
}

// Watch for new searches and add them to recent searches
watch(query, (newQuery) => {
  if (newQuery && newQuery.trim()) {
    addToRecentSearches(newQuery)
  }
})

</script>