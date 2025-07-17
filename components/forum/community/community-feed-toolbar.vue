<script lang="ts" setup>
defineProps<{
  totalPosts: number;
  isSelectMode: boolean;
  sortBy: 'hot' | 'new' | 'top';
}>();

const emit = defineEmits<{
  'update:sortBy': [value: 'hot' | 'new' | 'top'];
  'toggle-selected': Event;
}>();

const setSortBy = (sort: 'hot' | 'new' | 'top') => {
  emit('update:sortBy', sort);
};

const getSortIcon = (sort: string) => {
  return {
    hot: 'i-lucide-flame',
    new: 'i-lucide-clock',
    top: 'i-lucide-trending-up'
  }[sort]
};
</script>

<template>
  <div class="shadow card bg-base-100 border border-gray-300 dark:border-base-300">
    <div class="p-4">
      <div class="flex items-center justify-between">
        <div class="hidden md:flex items-center space-x-2">
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

        <div class="block md:hidden dropdown dropdown-center">
          <div tabindex="0" role="button" class="btn m-1">
            <i :class="getSortIcon(sortBy)" />
            <span class="ml-2 capitalize">{{ sortBy }}</span>
            <i class="h-4 w-4 ml-2 i-lucide-chevron-down" />
          </div>
          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-28 p-2 shadow-sm">
            <li><a @click="setSortBy('hot')"><i class="h-4 w-4 mr-2 i-lucide-flame" /> Hot</a></li>
            <li><a @click="setSortBy('new')"><i class="h-4 w-4 mr-2 i-lucide-clock" /> New</a></li>
            <li><a @click="setSortBy('top')"><i class="h-4 w-4 mr-2 i-lucide-trending-up" /> Top</a></li>
          </ul>
        </div>


        <div class="flex items-center space-x-3">
          <button
            v-if="false"
            class="btn"
            :class="isSelectMode ? 'bg-[#297D4E] hover:bg-[#1f5a37]' : 'btn-outline border-gray-300'"
            @click="$emit('toggle-selected')"
          >
            <i class="-lucide-check-circle h-4 w-4 mr-2" />
            {{ isSelectMode ? 'Cancel' : 'Select' }}
          </button>
          <div class="badge bg-[#297D4E]/10 text-[#297D4E]">
            <!-- {{ posts.length }} posts  -->
            {{ totalPosts }} posts 
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
