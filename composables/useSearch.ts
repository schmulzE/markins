import type { Posts } from "~/types/utility";

export const useSearch = () => {
  const searchTerm = ref('');
  const page = ref(1);
  const itemsPerPage = ref(10);
  const hasMorePosts = ref(true);
  const isSearching = ref(false);
  const searchResults = ref<Posts[]>([]);
  const error = ref<string | null>(null);

  const searchPosts = async () => {
    if (!searchTerm.value) {
      searchResults.value = [];
      page.value = 1;
      hasMorePosts.value = true;
      return;
    }

    try {
      isSearching.value = true;
      const data = await $fetch('/api/posts/search', {
        query: {
          q: searchTerm.value,
          page: page.value,
          itemsPerPage: itemsPerPage.value,
        },
      });

      if (Array.isArray(data)) {
        searchResults.value = [...searchResults.value, ...data];
      } else {
        throw new Error('Unexpected response format');
      }
      page.value++;
      hasMorePosts.value = data.length === itemsPerPage.value;
    } catch (e) {
      if (e instanceof Error) {
        error.value = e.message;
      } else {
        error.value = String(e);
      }
      hasMorePosts.value = false;
    } finally {
      isSearching.value = false;
    }
  };

  return {
    searchTerm,
    page,
    itemsPerPage,
    hasMorePosts,
    isSearching,
    searchResults,
    error,
    searchPosts,
  };
};
