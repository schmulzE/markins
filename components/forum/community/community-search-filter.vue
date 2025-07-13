<script lang="ts" setup>
  const emit = defineEmits(['view-mode', 'search-query']);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const props = defineProps<{
    searchQuery: string;
    viewMode: 'grid' | 'list';
  }>();

  const handleViewChange = (newSortBy: typeof props.viewMode) => {
    emit('view-mode', newSortBy)
  ;
}
  const handleSearchQuery = (query: string) => {
    emit('search-query', query)
  }
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
    <div class="lg:col-span-3">
      <label class="input relative w-full">
        <i class="i-lucide-search absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          placeholder="Search communities..."
          :value="searchQuery"
          class="pl-10"
          @input="(e : Event) => handleSearchQuery((e.target as HTMLInputElement)?.value)"
        >
      </label>
    </div>
    <div class="flex items-center space-x-2">
      <button
        class="btn"
        :class="viewMode === 'grid' ? 'bg-[#297D4E] hover:bg-[#1f5a37] text-white' : ''"
        @click="handleViewChange('grid')"
      >
        <i class="i-lucide-grid-3x3 h-4 w-4" />
      </button>
      <button
        class="btn"
        :class="viewMode === 'list' ? 'bg-[#297D4E] hover:bg-[#1f5a37] text-white' : ''"
        @click="handleViewChange('list')"
      >
        <i class="i-lucide-list h-4 w-4" />
      </button>
    </div>
  </div>
</template>
