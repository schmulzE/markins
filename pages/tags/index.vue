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
          <Tabs 
          class="border rounded-md"
          :initial-active="initialActive" 
          :tabs="tabs" 
          @tab-changed="onTabChange" 
          >
          <template #tab1>
            <div class="absolute left-0 mt-4 mb-8">
                popular tags
                <div class="flex flex-col md:flex-row gap-4 mt-8">
                  <div v-for="tag in paginatedTags" :key="tag.id" class="border p-2 space-y-2">
                    <NuxtLink :to='`/posts/tagged/${tag.title}`' class="text-xs bg-base-200 p-1 rounded-sm">{{ tag.title }}</NuxtLink>
                    <p class="text-sm">{{ tag.description }}</p>
                    <p class="text-xs">{{ tag.posts.length }} questions</p>
                  </div>
                </div>
              </div>
            </template>
            <template #tab2>
              <div class="absolute left-0 mt-4">
                tags by name
                <div class="flex flex-col md:flex-row gap-4 mt-8">
                  <div v-for="tag in paginatedTags" :key="tag.id" class="border p-2 space-y-2">
                    <NuxtLink :to='`/posts/tagged/${tag.title}`' class="text-xs bg-base-200 ">{{ tag.title }}</NuxtLink>
                    <p class="text-sm">{{ tag.description }}</p>
                    <p class="text-xs">{{ tag.posts.length }} questions</p>
                  </div>
                </div>
              </div>
            </template>
            <template #tab3>
              <div class="absolute left-0 mt-4">
                tags by date
                <div class="flex flex-col md:flex-row gap-4 mt-8">
                  <div v-for="tag in paginatedTags" :key="tag.id" class="border p-2 space-y-2">
                    <NuxtLink :to='`/posts/tagged/${tag.title}`' class="text-xs bg-base-200">{{ tag.title }}</NuxtLink>
                    <p class="text-sm">{{ tag.description }}</p>
                    <p class="text-xs">{{ tag.posts.length }} questions</p>
                  </div>
                </div>
              </div>
            </template>
          </Tabs>
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
import Tabs from '~/components/ui/tabs.vue';
import ForumLayout from '~/layouts/forum.vue';
import { useToast } from 'vue-toastification';
import type { Tables } from '~/types/database.types';
import Pagination from '~/components/ui/pagination.vue';

const route =  useRoute();

interface Tag {
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
  { name: 'popular', slot: 'tab1' },
  { name: 'name', slot: 'tab2' },
  { name: 'new', slot: 'tab3' },
]);

const initialActive = tabs.value.findIndex((tab) => tab.name === currentTab.value);

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
