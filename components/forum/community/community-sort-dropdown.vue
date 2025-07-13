<script lang="ts" setup>
const emit = defineEmits(['sort-by']);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
  sortBy: 'members' | 'growth' | 'activity' | 'newest';
}>();

const handleSortChange = (newSortBy: typeof props.sortBy) => {
  emit('sort-by', newSortBy);
};

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
</script>

<template>
  <div class="card bg-base-100 shadow px-4 py-8 border border-gray-300 dark:border-base-300">
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
          <a @click="handleSortChange('members')">
            <i class="h-4 w-4 mr-2 i-lucide-users" />
            Members
          </a>
        </li>
        <li>
          <a @click="handleSortChange('growth')">
            <i class="h-4 w-4 mr-2 i-lucide-trending-up" />
            Growth
          </a>
        </li>
        <li>
          <a @click="handleSortChange('activity')">
            <i class="h-4 w-4 mr-2 i-lucide-star" />
            Activity
          </a>
        </li>
        <li>
          <a @click="handleSortChange('newest')">
            <i class="h-4 w-4 mr-2 i-lucide-clock" />
            Newest
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
