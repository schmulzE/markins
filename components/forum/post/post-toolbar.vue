<template>
  <div class="card shadow bg-base-100 border border-gray-300 dark:border-base-100">
    <div class="p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <!-- Sort Dropdown -->
          <div class="dropdown dropdown-center">
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

          <!-- Filter Button -->
          <button class="btn btn-md btn-outline border-gray-200 dark:border-base-100" @click="openFilterModal">
            <i class="h-4 w-4 mr-2 i-lucide-filter" />
            Filter
          </button>
        </div>

        <!-- Post Count Badge -->
        <div class="bg-[#297D4E]/10 text-[#297D4E] badge">
          {{ posts.length }} posts
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Post, Flair } from '~/types/utility';

defineProps<{ sortBy: string, posts: Post[] }>();

const emit = defineEmits<{
  (e: 'update:sortBy', value: 'hot' | 'new' | 'top'): void,
  (e: 'update:filterBy', value: Flair | null): void
}>();

function setSortBy(value: 'hot' | 'new' | 'top') {
  emit('update:sortBy', value)
};

const getSortIcon = (sort: string) => {
  return {
    hot: 'i-lucide-flame',
    new: 'i-lucide-clock',
    top: 'i-lucide-trending-up'
  }[sort] || 'i-lucide-list'
};

const store = useModalStore();
// Filter Modal State
const flairs = ref<Flair[]>([]);
const loadingFlairs = ref(false);
const selectedFlair = ref<Flair | null>(null);

const fetchFlairs = async () => {
  loadingFlairs.value = true;
  try {
    const response = await $fetch<{ data: Flair[] }>('/api/flairs');
    flairs.value = response.data || [];
  } catch (error) {
    flairs.value = [];
    throw new Error((error as Error).message);;
  } finally {
    loadingFlairs.value = false;
  }
};

onMounted(() => {
  fetchFlairs();
});

function openFilterModal() {
  store.openModal({ 
    component: markRaw(defineAsyncComponent(() => import('~/components/forum/flair/flair-filter-modal.vue'))), 
    props: {
      classes: "fixed w-fit top-[50%] left-[50%] h-fit transform translate-x-[-50%] translate-y-[-50%]", 
      overlayClass: 'bg-gray-900/90',
      selectedFlair,
      flairs,
      loadingFlairs
    }, 
    events: {
      applyFilter: () => {
        emit('update:filterBy', selectedFlair.value);
        store.closeModal();
      },
      handleSelectFlair: (payload) => {
        selectedFlair.value = payload as Flair | null;
      }
    }
  });
}
</script>
