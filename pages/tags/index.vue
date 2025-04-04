<template>
  <ForumLayout>
    <template #main>
      <div class="mt-12 pl-4 w-full h-screen md:h-auto">
        <h1 class="text-3xl capitalize">tags</h1>
        <p class="my-4 mx-2 md:max-w-3xl text-sm">
          A tag is a keyword or label that categorizes your question with other, similar questions. 
          Using the right tags makes it easier for others to find and comment your question.
        </p>
        <div role="input" class="flex justify-between relative items-center max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-5xl">
          <label class="input input-bordered hidden md:flex items-center gap-2 w-64">
            <i class=" i-ri-search-line" />
            <input 
            v-model="searchTag" 
            type="text" 
            class="grow outline-none bg-base-100" 
            placeholder="Search" 
            >
          </label>

          <DynamicTab 
          :tabs="tabs"  
          tab-class="border rounded-md w-fit justify-self-end"
          @tab-changed="onTabChange" 
          />
        </div>
        
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          class="absolute bottom-8 right-32"
          @update:current-page="updateCurrentPage"
        />
      </div>
    </template>
  </ForumLayout>
</template>

<script setup lang="ts">
import ForumLayout from '~/layouts/forum.vue';
import { useToast } from 'vue-toastification';
import type { Tables } from '~/types/database.types';
import Pagination from '~/components/ui/pagination.vue';
import DynamicTab from '~/components/ui/dynamic-tab.vue';
import ExploreTag from '~/components/forum/tag/explore-tag.vue';

const route =  useRoute();

export interface Tag {
  id: number;
  title: string;
  description: string;
  posts:Tables<'posts'>[];
}

interface TagResponse {
  count: number;
  data: Tag[];
};


const perPage = ref(3);
const totalTag = ref(0);
const toast = useToast();
const searchTag = ref('');
const router =  useRouter();
const paginatedTags = ref<Tag[]>();
const currentPage = ref(Number(route.query.page) || 1);
const currentTab = ref(route.query.sortBy?.toString() || 'popular');

const tabs = ref([
  {
    id: 'popular',
    title: 'popular',
    content: shallowRef(ExploreTag),
    componentProps: {
      paginatedTags,
      title: 'popular tags',
    }
  },
  {
    id: 'name',
    title: 'name',
    content: shallowRef(ExploreTag),
    componentProps: {
      title: 'tags by name',
      paginatedTags,
    }
  },
  {
    id: 'new',
    title: 'new',
    content: shallowRef(ExploreTag),
    componentProps: {
      title: 'tags by date',
      paginatedTags,
    }
  },
])


const fetchTags = async (page: number, tab: string) => {
  const from = (page - 1) * perPage.value;
  const to = from + (perPage.value - 1);

  try {
    const { data: response } = await useFetch<TagResponse>("/api/tags", {
      params: { 
        sortBy: tab,
        from,
        to
      },
    });

    if (response.value) {
      totalTag.value = response.value.count;
      paginatedTags.value = response.value.data;
    }
  } catch {
    toast.error("Failed to fetch tags");
  }
};

const onTabChange = async (tabName: string) => {
  currentTab.value = tabName;
  currentPage.value = 1;
  
  await router.push({
    query: {
      sortBy: tabName
    }
  });

  await fetchTags(1, tabName);
};

const updateCurrentPage = async (newPage: number) => {
  currentPage.value = newPage;
  
  await router.push({
    query: {
      page: newPage,
      tab: currentTab.value
    }
  });

  await fetchTags(newPage, currentTab.value);
};

// Initial fetch
onMounted(async () => {
  await fetchTags(currentPage.value, currentTab.value);
});


const totalPages = computed(() => Math.ceil(totalTag.value / perPage.value));

fetchTags(currentPage.value, route.query.sortBy?.toString() || 'popular');

</script>
