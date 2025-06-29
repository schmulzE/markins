<template>
  <div class="min-h-screen bg-base-300">
    <!-- Header -->
    <header class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div class=" flex h-16 items-center justify-between px-4">
        <div class="flex items-center space-x-4">
          <NuxtLink to="/posts" class="flex items-center space-x-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#297D4E]">
              <i class="h-5 w-5 text-white i-lucide-micropscope" />
            </div>
            <span class="text-xl font-bold text-[#297D4E]">markins</span>
          </NuxtLink>

          <label class="input relative w-96 max-w-sm">
            <i class="i-lucide-search absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 " />
            <input
              placeholder="Search within flair..."
              :value="searchQuery"
              class="pl-10 pr-4"
              @input="(e) => setSearchQuery((e.target as HTMLInputElement)?.value)"
            >
          </label>
        </div>

        <nav class="flex items-center space-x-4">
          <NuxtLink to="/posts" class="text-sm font-medium hover:text-[#297D4E] transition-colors">
            Posts
          </NuxtLink>
          <NuxtLink to="/communities" class="text-sm font-medium hover:text-[#297D4E] transition-colors">
            Communities
          </NuxtLink>
          <NuxtLink to="/flairs" class="text-sm font-medium hover:text-[#297D4E] transition-colors">
            Flairs
          </NuxtLink>
        </nav>
      </div>
    </header>

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
                    :style="{
                      backgroundColor: flairInfo.backgroundColor,
                      color: flairInfo.textColor,
                      border: `1px solid ${flairInfo.textColor}`,
                    }"
                    class="badge text-lg px-3 py-1 font-medium rounded-full"
                  >
                    {{ flairInfo.displayName }}
                    
                  </span>
                  <span class="badge rounded-full text-white bg-[#297D4E] text-xs">
                    {{ flairInfo.type }} flair
                  </span>
                </div>
                <p class="text-lg opacity-90 max-w-2xl">{{ flairInfo.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div class="text-center">
            <div class="text-2xl font-bold">{{ flairInfo.totalPosts.toLocaleString() }}</div>
            <div class="text-sm opacity-75">Total Posts</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold">{{ stats?.thisWeek }}</div>
            <div class="text-sm opacity-75">This Week</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold">{{ flairInfo.totalUsers.toLocaleString() }}</div>
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
          <!-- Filters and Sort -->
          <div class="border border-gray-300 bg-base-100 card shadow">
            <div class="p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">

                  <div class="dropdown dropdown-center">
                    <div tabindex="0" role="button" class="btn m-1">
                      <i :class="getSortIcon(sortBy)" />
                      <span class="ml-2 capitalize">{{ sortBy }}</span>
                    </div>
                    <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-32 p-2 shadow-sm">
                      <li>
                        <a @click="setSortBy('hot')">
                          <i class="i-lucide-flame h-4 w-4 mr-2" />
                          Hot
                        </a>
                      </li>
                      <li>
                        <a @click="setSortBy('new')">
                          <i class="i-lucide-clock h-4 w-4 mr-2" />
                          New
                        </a>
                      </li>
                      <li @click="setSortBy('top')">
                        <a>
                          <i class="i-lucide-trending-up h-4 w-4 mr-2" />
                          Top
                        </a>
                      </li>
                      <li @click="setSortBy('comments')">
                        <a>
                          <i class="i-lucide-message-square h-4 w-4 mr-2" />
                          Comments
                        </a>
                      </li>
                    </ul>
                  </div>
                  <select
                    :value="timeFilter"
                    class="w-32 select bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    @change="(e: Event) => setTimeFilter((e.target as HTMLSelectElement)?.value)"
                  >
                    <option value="all">All time</option>
                    <option value="day">Today</option>
                    <option value="week">This week</option>
                    <option value="month">This month</option>
                    <option value="year">This year</option>
                  </select>

                  <select
                    :value="communityFilter"
                    class="w-48 select bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    @change="(e: Event) => setCommunityFilter((e.target as HTMLSelectElement)?.value)"
                    >
                    <option value="all">All communities</option>
                    <option
                      v-for="community in flairInfo.topCommunities"
                      :key="community.name"
                      :value="community.name.toLowerCase()"
                    >
                      {{ community.icon }}
                      {{ community.name }}
                      ({{ community.count }}) 
                    </option>
                  </select>

                  <button
                    class="btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                  >
                    <Filter class="h-4 w-4 mr-2" />
                    More Filters
                  </button>
                </div>

                <span class="bg-[#297D4E]/10 text-[#297D4E] badge text-xs font-medium">
                  {{ posts.length }} posts
                </span>
              </div>
            </div>
          </div>

          <!-- Posts Feed -->
          <div class="space-y-4">
            <div
              v-for="post in posts"
              :key="post.id"
              class="border border-gray-300 card bg-base-100 shadow group hover:shadow-md transition-all duration-300"
            >
              <div class="p-0">
                <div class="flex">
                  <!-- Voting Section -->
                  <div class="flex flex-col items-center p-4 bg-gray-100 rounded-l-lg">
                    <button
                      :class="[
                        'p-1 h-8 w-8 rounded-md',
                        post.userVote === 'up' ? 'text-[#297D4E] bg-[#297D4E]/10' : 'text-gray-400 hover:text-[#297D4E]'
                      ]"
                      @click="handleVote(post.id, 'up')"
                    >
                      <i class="i-lucide-chevron-up h-5 w-5" />
                    </button>
                    <span
                      :class="[
                        'text-sm font-medium py-1',
                        post.userVote === 'up'
                          ? 'text-[#297D4E]'
                          : post.userVote === 'down'
                            ? 'text-red-500'
                            : 'text-gray-600'
                      ]"
                    >
                      {{ post.upvotes - post.downvotes }}
                    </span>
                    <button
                      :class="[
                        'p-1 h-8 w-8 rounded-md',
                        post.userVote === 'down' ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'
                      ]"
                      @click="handleVote(post.id, 'down')"
                    >
                      <i class="i-lucide-chevron-down h-5 w-5" />
                    </button>
                  </div>

                  <!-- Post Content -->
                  <div class="flex-1 p-4">
                    <!-- Post Header -->
                    <div class="flex items-center space-x-2 mb-2">
                      <div class="text-sm">{{ post.communityIcon }}</div>
                      <NuxtLink
                        :to="`/m/${post.community.slice(2)}`"
                        class="text-sm font-medium text-[#297D4E] hover:underline"
                      >
                        {{ post.community }}
                      </NuxtLink>
                      <span class="text-xs text-gray-500">•</span>
                      <span class="text-xs text-gray-500">Posted by</span>
                      <NuxtLink :to="`/user/${post.author}`" class="text-xs text-gray-500 hover:underline">
                        {{ post.author }}
                      </NuxtLink>
                      <span class="text-xs text-gray-500">{{ post.timeAgo }}</span>
                    </div>

                    <!-- Flairs -->
                    <div class="flex flex-wrap gap-1 mb-2">
                      <NuxtLink
                        v-for="flair in post.flairs"
                        :key="flair"
                        :to="`/flair/${flair}`"
                      >
                        <span
                        class="badge"
                          :class="[
                            'text-xs cursor-pointer transition-opacity hover:opacity-80 font-medium',
                            flair === route.params.name
                              ? 'bg-[#297D4E] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          ]"
                        >
                          {{ flair }}
                        </span>
                      </NuxtLink>
                    </div>

                    <!-- Post Title -->
                    <NuxtLink :to="`/post/${post.id}`">
                      <h3 class="text-lg font-semibold mb-2 group-hover:text-[#297D4E] transition-colors cursor-pointer">
                        <div class="flex items-start space-x-2">
                          <div class="text-gray-400 mt-1">
                            <i :class="getPostTypeIcon(post.type)" />
                          </div>
                          <span>{{ post.title }}</span>
                        </div>
                      </h3>
                    </NuxtLink>

                    <!-- Post Content -->
                    <div class="mb-3">
                      <div v-if="post.type === 'image' && post.imageUrl" class="relative w-full h-64 mb-3 rounded-lg overflow-hidden">
                        <img
                          :src="post.imageUrl || '/svg/placeholder.svg'"
                          alt="Post image"
                          class="object-cover w-full h-full"
                        >
                      </div>

                      <div v-if="post.type === 'link' && post.linkUrl" class="border border-gray-200 rounded-lg p-3 mb-3 bg-gray-50">
                        <div class="flex items-center space-x-2 text-sm text-[#297D4E]">
                          <i class="i-lucide-external-link h-4 w-4" />
                          <a :href="post.linkUrl" class="hover:underline truncate" target="_blank">
                            {{ post.linkUrl }}
                          </a>
                        </div>
                      </div>

                      <p class="text-sm text-gray-700 line-clamp-3">{{ post.content }}</p>
                    </div>

                    <!-- Post Actions -->
                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                      <NuxtLink :to="`/post/${post.id}`">
                        <button
                          class="btn btn-ghost"
                        >
                          <i class="i-lucide-message-square h-4 w-4 mr-1" />
                          {{ post.comments }} Comments
                        </button>
                      </NuxtLink>

                      <button
                        class="btn btn-ghost"
                      >
                        <i class="i-lucide-share-2 h-4 w-4 mr-1" />
                        Share
                      </button>

                      <button
                      class="btn btn-ghost"
                        :class="[
                          'inline-flex items-center justify-center rounded-md text-sm font-medium ',
                          post.isBookmarked ? 'text-[#297D4E]' : ''
                        ]"
                        @click="handleBookmark(post.id)"
                      >
                        <i :class="`h-4 w-4 mr-1 ${post.isBookmarked ? 'i-mdi-bookmark' : 'i-mdi-bookmark-outline'}`" />
                        Save
                      </button>

                      <div class="dropdown dropdown-center">
                        <div tabindex="0" role="button" class="btn btn-ghost m-1">
                          <i class="i-lucide-more-horizontal h-4 w-4" />
                        </div>
                        <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-32 p-2 shadow-sm">
                          <li>
                            <a @click="setSortBy('hot')">
                              <i class="i-lucide-eye h-4 w-4 mr-2" />
                              Hide
                            </a>
                          </li>
                          <li>
                            <a @click="setSortBy('new')">
                              <i class="i-lucide-star h-4 w-4 mr-2" />
                              Award
                            </a>
                          </li>
                        </ul>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Load More -->
          <div class="text-center py-8">
            <button
              class="btn"
            >
              Load More Posts
            </button>
          </div>
        </div>

        <!-- Right Sidebar -->
        <div class="lg:col-span-1 space-y-4">
          <!-- Flair Info -->
          <div class="border border-gray-300 card bg-base-100 shadow">
            <div class="p-6">
              <div class="text-lg flex items-center font-medium leading-none tracking-tight">
                <i class="i-lucide-tags h-5 w-5 mr-2 text-[#297D4E]" />
                About This Flair
              </div>
            </div>
            <div class="p-6 pt-0 space-y-4">
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span>Total Posts</span>
                  <span class="font-medium">{{ flairInfo.totalPosts.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Contributors</span>
                  <span class="font-medium">{{ flairInfo.totalUsers.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Created</span>
                  <span class="font-medium">{{ flairInfo.createdDate }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Weekly Growth</span>
                  <span class="font-medium text-green-600">{{ flairInfo.weeklyGrowth }}</span>
                </div>
              </div>

              <button
              class="btn"
                :class="[
                  'w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2',
                  flairInfo.isFollowing ? 'bg-gray-200 text-gray-700' : 'bg-[#297D4E] hover:bg-[#1f5a37] text-white'
                ]"
                @click="handleFollowFlair"
              >
                <i class="i-lucide-star" :class="`h-4 w-4 mr-2 ${flairInfo.isFollowing ? 'fill-current' : ''}`" />
                {{ flairInfo.isFollowing ? 'Following' : 'Follow Flair' }}
              </button>
            </div>
          </div>

          <!-- Top Communities -->
          <div class="border border-gray-300 card bg-base-100 shadow">
            <div class="p-6">
              <div class="text-lg flex items-center font-semibold leading-none tracking-tight">
                <i class="i-lucide-users h-5 w-5 mr-2 text-[#297D4E]" />
                Top Communities
              </div>
            </div>
            <div class="p-6 pt-0">
              <div class="space-y-3">
                <div
                  v-for="(community, index) in flairInfo.topCommunities"
                  :key="community.name"
                  class="flex items-center justify-between"
                >
                  <NuxtLink
                    :to="`/m/${community.name.slice(2)}`"
                    class="flex items-center space-x-3 flex-1"
                  >
                    <div class="flex items-center space-x-2">
                      <span class="text-sm font-medium text-gray-500">#{{ index + 1 }}</span>
                      <span class="text-lg">{{ community.icon }}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium truncate">{{ community.name }}</p>
                    </div>
                  </NuxtLink>
                  <span class="badge badge-neutral badge-outline rounded-full">
                    {{ community.count }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Related Flairs -->
          <div class="border border-gray-300 card bg-base-100 shadow">
            <div class="p-6">
              <div class="text-lg font-semibold leading-none tracking-tight">Related Flairs</div>
            </div>
            <div class="p-6 pt-0">
              <div class="flex flex-wrap gap-2">
                <NuxtLink
                  v-for="flair in flairInfo.relatedFlairs"
                  :key="flair"
                  :to="`/flair/${flair}`"
                >
                  <span
                    class="inline-flex items-center rounded-full badge badge-outline text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer hover:bg-[#297D4E] hover:text-white"
                  >
                    {{ flair }}
                  </span>
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Top Contributors -->
          <div v-if="stats" class="border border-gray-300 card bg-base-100 shadow">
            <div class="p-6">
              <div class="text-lg flex items-center font-semibold leading-none tracking-tight">
                <i class="i-lucide-award h-5 w-5 mr-2 text-[#297D4E]" />
                Top Contributors
              </div>
            </div>
            <div class="p-6 pt-0">
              <div class="space-y-3">
                <div
                  v-for="(author, index) in stats.topAuthors"
                  :key="author.name"
                  class="flex items-center justify-between"
                >
                  <NuxtLink :to="`/user/${author.name}`" class="flex items-center space-x-3 flex-1">
                    <div class="flex items-center space-x-2">
                      <span class="text-sm font-medium text-gray-500">#{{ index + 1 }}</span>
                      <div class="relative h-6 w-6">
                        <img
                          :src="author.avatar || '/svg/placeholder.svg'"
                          :alt="author.name"
                          class="rounded-full h-6 w-6"
                        >
                        <span
                          v-if="!author.avatar"
                          class="flex h-full w-full items-center justify-center rounded-full bg-muted"
                        >
                          {{ author.name.slice(0, 2) }}
                        </span>
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium truncate">{{ author.name }}</p>
                    </div>
                  </NuxtLink>
                  <span class="rounded-full border badge badge-outline badge-neutral text-xs">
                    {{ author.count }} posts
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Activity Chart -->
          <div v-if="showStats && stats" class="border border-gray-300 card bg-base-100 shadow">
            <div class="p-6">
              <div class="text-lg flex items-center font-semibold leading-none tracking-tight">
                <i class="i-lucide-bar-chart-3 h-5 w-5 mr-2 text-[#297D4E]" />
                Weekly Activity
              </div>
            </div>
            <div class="p-6 pt-0">
              <div class="space-y-2">
                <div
                  v-for="day in stats.postsByDay"
                  :key="day.day"
                  class="flex items-center justify-between"
                >
                  <span class="text-sm">{{ day.day }}</span>
                  <div class="flex items-center space-x-2 flex-1 mx-3">
                    <div class="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-[#297D4E] h-2 rounded-full"
                        :style="{
                          width: `${(day.count / Math.max(...stats.postsByDay.map((d) => d.count))) * 100}%`,
                        }"
                      />
                    </div>
                  </div>
                  <span class="text-sm font-medium">{{ day.count }}</span>
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
const route = useRoute()

// Define interfaces
const flairPost = {
  id: String,
  title: String,
  content: String,
  author: String,
  authorAvatar: String,
  community: String,
  communityIcon: String,
  timeAgo: String,
  upvotes: Number,
  downvotes: Number,
  comments: Number,
  type: String, // "text" | "image" | "link"
  imageUrl: String,
  linkUrl: String,
  isBookmarked: Boolean,
  userVote: String, // "up" | "down" | null
  flairs: Array,
}

const flairInfo = ref<{
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
}>({
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
  topCommunities: [],
  weeklyGrowth: '',
})

// Remove unused flairStats object definition

// State
interface FlairPost {
  id: string
  title: string
  content: string
  author: string
  authorAvatar: string
  community: string
  communityIcon: string
  timeAgo: string
  upvotes: number
  downvotes: number
  comments: number
  type: string // "text" | "image" | "link"
  imageUrl?: string
  linkUrl?: string
  isBookmarked: boolean
  userVote: 'up' | 'down' | null
  flairs: string[]
}

const posts = ref<FlairPost[]>([])
const stats = ref<{
  totalPosts: number
  thisWeek: number
  thisMonth: number
  topAuthors: { name: string; avatar: string; count: number }[]
  postsByDay: { day: string; count: number }[]
} | null>(null)
const sortBy = ref('hot')
const timeFilter = ref('all')
const communityFilter = ref('all')
const searchQuery = ref('')
const isLoading = ref(true)
const showStats = ref(true)

// Methods for input bindings
const setSearchQuery = (value: string) => {
  searchQuery.value = value
}

const setCommunityFilter = (value: string) => {
  communityFilter.value = value
}

const setTimeFilter = (value: string) => {
  timeFilter.value = value
}

const setSortBy = (value: string) => {
  sortBy.value = value
}

// Initialize data
onMounted(() => {
  // Mock flair info
  flairInfo.value = {
    name: route.params.name as string,
    displayName: typeof route.params.name === 'string' && route.params.name.length > 0
      ? route.params.name.charAt(0).toUpperCase() + route.params.name.slice(1)
      : '',
    description: 'Posts related to original research papers, studies, and academic publications',
    backgroundColor: '#297D4E',
    textColor: '#FFFFFF',
    type: 'post',
    totalPosts: 1247,
    totalUsers: 892,
    createdDate: '2024-01-15',
    isFollowing: false,
    relatedFlairs: ['discussion', 'theory', 'experiment', 'review'],
    topCommunities: [
      { name: 'm/QuantumPhysics', icon: '⚛️', count: 234 },
      { name: 'm/Genetics', icon: '🧬', count: 189 },
      { name: 'm/Astronomy', icon: '🔭', count: 156 },
    ],
    weeklyGrowth: '+12%',
  }

  // Mock stats
  stats.value = {
    totalPosts: 1247,
    thisWeek: 23,
    thisMonth: 89,
    topAuthors: [
      { name: 'Dr. Sarah Chen', avatar: '/svg/placeholder.svg', count: 45 },
      { name: 'Prof. Michael Rodriguez', avatar: '/svg/placeholder.svg', count: 32 },
      { name: 'Dr. Emma Thompson', avatar: '/svg/placeholder.svg', count: 28 },
    ],
    postsByDay: [
      { day: 'Mon', count: 12 },
      { day: 'Tue', count: 8 },
      { day: 'Wed', count: 15 },
      { day: 'Thu', count: 11 },
      { day: 'Fri', count: 9 },
      { day: 'Sat', count: 6 },
      { day: 'Sun', count: 4 },
    ],
  }

  // Mock posts data
  posts.value = [
    {
      id: '1',
      title: 'Breakthrough in Quantum Error Correction: New Algorithm Achieves 99.9% Fidelity',
      content:
        'Researchers at MIT have developed a revolutionary quantum error correction algorithm that maintains qubit coherence for unprecedented durations...',
      author: 'Dr. Sarah Chen',
      authorAvatar: '/svg/placeholder.svg',
      community: 'm/QuantumPhysics',
      communityIcon: '⚛️',
      timeAgo: '2 hours ago',
      upvotes: 2847,
      downvotes: 23,
      comments: 156,
      type: 'text',
      isBookmarked: false,
      userVote: null,
      flairs: [route.params.name as string, 'breakthrough'],
    },
    {
      id: '2',
      title: 'CRISPR 3.0: Enhanced Gene Editing with Minimal Off-Target Effects',
      content: 'New study shows 99.8% accuracy in gene editing with virtually no unintended modifications...',
      author: 'Prof. Michael Rodriguez',
      authorAvatar: '/svg/placeholder.svg',
      community: 'm/Genetics',
      communityIcon: '🧬',
      timeAgo: '4 hours ago',
      upvotes: 1923,
      downvotes: 45,
      comments: 89,
      type: 'image',
      imageUrl: '/svg/placeholder.svg?height=300&width=500',
      isBookmarked: true,
      userVote: 'up',
      flairs: [route.params.name as string],
    },
    {
      id: '3',
      title: 'James Webb Telescope Discovers Potentially Habitable Exoplanet 22 Light-Years Away',
      content: 'K2-18b shows signs of water vapor and possible biosignatures in its atmosphere...',
      author: 'Dr. Emma Thompson',
      authorAvatar: '/svg/placeholder.svg',
      community: 'm/Astronomy',
      communityIcon: '🔭',
      timeAgo: '6 hours ago',
      upvotes: 3456,
      downvotes: 67,
      comments: 234,
      type: 'link',
      linkUrl: 'https://nasa.gov/webb-discovery',
      isBookmarked: false,
      userVote: null,
      flairs: [route.params.name as string, 'discovery'],
    },
    {
      id: '4',
      title: 'Novel Approach to Carbon Capture Using Engineered Algae',
      content: 'Researchers have developed genetically modified algae that can capture CO2 at unprecedented rates...',
      author: 'Dr. James Wilson',
      authorAvatar: '/svg/placeholder.svg',
      community: 'm/ClimateScience',
      communityIcon: '🌍',
      timeAgo: '8 hours ago',
      upvotes: 1567,
      downvotes: 234,
      comments: 445,
      type: 'text',
      isBookmarked: false,
      userVote: 'down',
      flairs: [route.params.name as string, 'environment'],
    },
    {
      id: '5',
      title: 'Revolutionary Battery Technology: Solid-State Batteries Achieve 1000+ Charge Cycles',
      content: 'New solid-state battery design maintains 95% capacity after 1000 charge cycles...',
      author: 'Dr. Lisa Park',
      authorAvatar: '/svg/placeholder.svg',
      community: 'm/MaterialsScience',
      communityIcon: '⚡',
      timeAgo: '12 hours ago',
      upvotes: 2134,
      downvotes: 89,
      comments: 167,
      type: 'image',
      imageUrl: '/svg/placeholder.svg?height=250&width=400',
      isBookmarked: true,
      userVote: 'up',
      flairs: [route.params.name as string, 'technology'],
    },
  ]

  isLoading.value = false
})

// Methods
const handleVote = (postId: string, voteType: string) => {
  posts.value = posts.value.map((post) => {
    if (post.id === postId) {
      let newUpvotes = post.upvotes
      let newDownvotes = post.downvotes
      let newUserVote = voteType || null

      if (post.userVote === 'up') {
        newUpvotes -= 1
      } else if (post.userVote === 'down') {
        newDownvotes -= 1
      }

      if (post.userVote === voteType) {
        newUserVote = null
      } else {
        if (voteType === 'up') {
          newUpvotes += 1
        } else {
          newDownvotes += 1
        }
      }

      return {
        ...post,
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        userVote: newUserVote,
      }
    }
    return post
  }) as FlairPost[]
}

const handleBookmark = (postId: string) => {
  posts.value = posts.value.map((post) =>
    post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post
  )
}

const handleFollowFlair = () => {
  flairInfo.value.isFollowing = !flairInfo.value.isFollowing
}

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return 'i-lucide-image h-4 w-4'
      case "link":
        return 'i-lucide-link h-4 w-4'
      default:
        return 'i-lucide-file-text h-4 w-4'
    }
  }

  // Add getSortIcon function for sort dropdown
  const getSortIcon = (sort: string) => {
    switch (sort) {
      case "hot":
        return "i-lucide-flame h-4 w-4"
      case "new":
        return "i-lucide-clock h-4 w-4"
      case "top":
        return "i-lucide-trending-up h-4 w-4"
      case "comments":
        return "i-lucide-message-square h-4 w-4"
      default:
        return "i-lucide-flame h-4 w-4"
    }
  }

</script>