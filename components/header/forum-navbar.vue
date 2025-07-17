<template>
  <header class="sticky top-0 z-50 w-full border-b border-gray-300 dark:border-base-100 bg-base-100 backdrop-blur-md">
    <div class="flex h-16 items-center justify-between px-2 md:px-4">
      <NuxtLink to="/posts" class="flex items-center space-x-2">
        <img src="/svg/markins-logo.svg" class="h-8 hidden md:block" >
        <img src="/svg/markins.svg" class="w-8 md:hidden" >
      </NuxtLink>

      <div ref="searchWrapper" class="relative md:w-full max-w-36 mx-2 md:max-w-lg">
        <label class="input relative focus:outline-none outline-none bg-base-200 focus:ring-0 ring-0 w-full">
          <i class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 i-lucide-search" />
          <input
            v-model="searchQuery"
            placeholder="Search posts, users, communities..."
            class="pl-4 md:pl-8"
            @keyup.enter="handleSearch"
            @keydown.escape="closeSearchDropdown"
            @keydown.down="navigateDropdown(1)"
            @keydown.up="navigateDropdown(-1)"
            @focus="showRecentSearches = true"
            @input="filterRecentSearches"
          >
        </label>
        
        <!-- Search Dropdown -->
        <div 
          v-if="showRecentSearches"
          class="absolute top-full left-0 right-0 mt-1 bg-base-100 border border-gray-300 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          <div class="p-2">
            <!-- Recent Searches Section -->
            <div v-if="filteredSearches.length > 0" class="mb-3">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700 flex items-center">
                  <i class="i-lucide-clock h-4 w-4 mr-1" />
                  Recent Searches
                </span>
                <button
                title="Clear all recent searches"
                class="text-xs text-gray-500 hover:text-red-500 transition-colors"
                @click="clearRecentSearches"
                >
                  <i class="i-lucide-trash-2 h-3 w-3" />
                </button>
              </div>
              <div class="space-y-1">
                <button
                  v-for="(search, index) in filteredSearches"
                  :key="index"
                  :class="[
                    'w-full text-left p-2 rounded transition-colors text-sm flex items-center justify-between group',
                    selectedIndex === index ? 'bg-[#297D4E] text-white' : 'hover:bg-gray-50'
                  ]"
                  @click="useRecentSearch(search)"
                >
                  <div class="flex items-center">
                    <i class="i-lucide-search h-3 w-3 mr-2" :class="selectedIndex === index ? 'text-white' : 'text-gray-400'" />
                    <span>{{ search }}</span>
                  </div>
                  <a
                  title="Remove this search"
                  :class="[
                    'transition-colors opacity-0 group-hover:opacity-100',
                    selectedIndex === index ? 'text-white hover:text-red-200' : 'text-gray-400 hover:text-red-500'
                  ]"
                  @click.stop="removeRecentSearch(recentSearches.indexOf(search))"
                  >
                    <i class="i-lucide-x h-3 w-3" />
                  </a>
                </button>
              </div>
            </div>

            <!-- Quick Search Options -->
            <div class="border-t pt-3">
              <div class="mb-2">
                <span class="text-sm font-medium text-gray-700 flex items-center">
                  <i class="i-lucide-zap h-4 w-4 mr-1" />
                  Quick Search
                </span>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="(quickSearch, index) in quickSearchOptions"
                  :key="quickSearch.label"
                  :class="[
                    'text-left p-2 rounded transition-colors text-sm flex items-center',
                    selectedIndex === (filteredSearches.length + index) ? 'bg-[#297D4E] text-white' : 'hover:bg-gray-50'
                  ]"
                  @click="useQuickSearch(quickSearch.query)"
                >
                  <i 
                  :class="[
                    quickSearch.icon + ' h-3 w-3 mr-2',
                    selectedIndex === (filteredSearches.length + index) ? 'text-white' : 'text-gray-400'
                  ]" />
                  {{ quickSearch.label }}
                </button>
              </div>
            </div>

            <!-- Search Tips -->
            <div v-if="searchQuery.length === 0" class="border-t pt-3 mt-3">
              <div class="mb-2">
                <span class="text-sm font-medium text-gray-700 flex items-center">
                  <i class="i-lucide-lightbulb h-4 w-4 mr-1" />
                  Search Tips
                </span>
              </div>
              <div class="text-xs text-gray-500 space-y-1">
                <div>• Use quotes for exact phrases</div>
                <div>• Add "type:post" to search only posts</div>
                <div>• Add "type:community" to search communities</div>
                <div>• Add "type:user" to search users</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center">
        <!-- dynamic contents -->
        <div v-show="auth.isAuthenticated">
          <slot name="dynamic-content" />
        </div>

        <NuxtLink v-if="!auth.isAuthenticated" to="/account/signin" class="btn bt-m p-2 bg-[#297D4E] text-white hover:bg-[#1f5a37]">
          Sign In
        </NuxtLink>
          <div v-else class="dropdown dropdown-bottom dropdown-center">
            <div tabindex="0" role="button" class="btn bg-ghost border-none bg-transparent hover:shadow-none shadow-none hover:bg-transparent md:m-1">
              <div v-if="auth.profile?.avatar_url" class="avatar">
                <div class="w-7 rounded-full">
                  <img :src="auth.profile?.avatar_url" class="rounded-full" alt="User Avatar">
                </div>
              </div>
              <div v-else class="avatar avatar-placeholder">
                <div class="bg-gray-300 text-neutral-content w-7 rounded-full">
                  <span class="text-lg">{{ auth.profile?.display_name?.split(' ').map(n => n[0]).join('') }}</span>
                </div>
              </div>
            </div>
            <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-48 p-2 shadow-sm">
              <li>
                <NuxtLink
                :to="`/user/${profile?.username}`"
                class="flex items-center"
                >
                  <i class="i-lucide-user w-4 h-4" />
                  Profile
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                :to="{
                  path: '/settings/user',
                  query: { username: profile?.username }
                }"
                class="flex items-center"
                >
                  <i class="i-lucide-settings w-4 h-4"/>
                  Settings
                </NuxtLink>
              </li>
              <li>
                <a 
                class="flex items-center"
                @click.prevent="toggleTheme"
                >
                  <i class="w-4 h-4" :class="theme == 'light'? 'i-lucide-moon' : 'i-lucide-sun'"/>
                  {{theme == 'light' ? 'Dark mode' : 'Light mode'}}
                </a>
              </li>
              <li>
                <a class="flex items-center" @click="signOut">
                  <i class="i-lucide-log-in w-4 h-4" />
                  Logout
                </a>
              </li>
            </ul>
          </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { Profile } from '~/types/utility';
import { useTheme } from '~/composables/useTheme';

const { theme, toggleTheme, initTheme } = useTheme()

// const router = useRouter();
const auth  = useAuthStore();
const user = useSupabaseUser();
const supabase = useSupabaseClient();

const searchQuery = ref('');
const selectedIndex = ref(-1);
const showRecentSearches = ref(false);
const error = ref<unknown | null>(null);
const recentSearches = ref<string[]>([]);
const profile = ref<Profile | null>(null);
const filteredSearches = ref<string[]>([]);
const searchWrapper = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
  if (
    searchWrapper.value &&
    !searchWrapper.value.contains(event.target as Node)
  ) {
    showRecentSearches.value = false
  }
}

// Quick search options
const quickSearchOptions = ref([
  { label: 'Popular Posts', query: 'type:post sort:top', icon: 'i-lucide-trending-up' },
  { label: 'New Posts', query: 'type:post sort:new', icon: 'i-lucide-clock' },
  { label: 'Communities', query: 'type:community', icon: 'i-lucide-building' },
  { label: 'Users', query: 'type:user', icon: 'i-lucide-users' },
  { label: 'My Posts', query: 'author:me', icon: 'i-lucide-user' },
  { label: 'Bookmarked', query: 'bookmarked:true', icon: 'i-lucide-bookmark' }
]);

onMounted(async () => {
  if(!user.value){
    return;
  }
  
  try {
    const response = await $fetch('/api/user');
    profile.value = response?.data as unknown as Profile ?? null;
  } catch (err) {
    error.value = err;
  }
});

onMounted(() => {
  initTheme()
  // Load recent searches from localStorage
  const saved = localStorage.getItem('recentSearches')
  if (saved) {
    recentSearches.value = JSON.parse(saved)
  }
})

// Add search to recent searches
const addToRecentSearches = (searchTerm: string) => {
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

// Handle search from navbar
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    addToRecentSearches(searchQuery.value)
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}

// Use a recent search
const useRecentSearch = (searchTerm: string) => {
  searchQuery.value = searchTerm
  addToRecentSearches(searchTerm)
  navigateTo(`/search?q=${encodeURIComponent(searchTerm)}`)
}

// Use a quick search option
const useQuickSearch = (query: string) => {
  searchQuery.value = query
  addToRecentSearches(query)
  navigateTo(`/search?q=${encodeURIComponent(query)}`)
}

// Remove a specific search from recent searches
const removeRecentSearch = (index: number) => {
  recentSearches.value.splice(index, 1)
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
}

// Clear all recent searches
const clearRecentSearches = () => {
  recentSearches.value = []
  filteredSearches.value = []
  localStorage.removeItem('recentSearches')
}

// Filter recent searches based on input
const filterRecentSearches = () => {
  if (!searchQuery.value.trim()) {
    filteredSearches.value = recentSearches.value
  } else {
    filteredSearches.value = recentSearches.value.filter(search => 
      search.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  selectedIndex.value = -1
}

// Close search dropdown
const closeSearchDropdown = () => {
  showRecentSearches.value = false
  selectedIndex.value = -1
}

// Navigate dropdown with arrow keys
const navigateDropdown = (direction: number) => {
  const totalItems = filteredSearches.value.length + quickSearchOptions.value.length
  if (totalItems === 0) return

  selectedIndex.value += direction
  
  if (selectedIndex.value >= totalItems) {
    selectedIndex.value = 0
  } else if (selectedIndex.value < 0) {
    selectedIndex.value = totalItems - 1
  }
}

// const displayRecentSearch = () => {
//   setTimeout(() => showRecentSearches.value = false, 200)
// }

const signOut = async() => {
  await supabase.auth.signOut()
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
});

</script>