<template>
  <div class="pagination h-auto mt-4 py-4">
    <button v-if="currentPage > 1" @click="prevPage">Prev</button>
    <span v-for="page in pageNumbers" :key="page">
      <button :class="{ active: currentPage === page }" @click="setPage(page)">
        {{ page }}
      </button>
    </span>
    <button v-if="currentPage < totalPages" @click="nextPage">Next</button>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter();
const route = useRoute();

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  totalPages: {
    type: Number,
    required: true,
  }
})
const emit =  defineEmits(['update:currentPage'])
const prevPage = () => {
  emit('update:currentPage', props.currentPage - 1);
  router.push({
  path: '/tags',
  query: {
    page: props.currentPage - 1,
    ...route.query
  },
});
}
const nextPage = () => {
  emit('update:currentPage', props.currentPage + 1)
  router.push({
  path: '/tags',
  query: {
    page: props.currentPage + 1,
    ...route.query
  },
});
}

const setPage = (page: number) => {
  emit('update:currentPage', page)
  router.push({
  path: '/tags',
  query: {
    page: page,
    ...route.query
  },
});
}

const pageNumbers = computed(() => {
  const pages = [];
    const startPage = Math.max(1, props.currentPage - 2);
    const endPage = Math.min(props.totalPages, props.currentPage + 2);
    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }
    return pages;
  }
)

</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
}

.pagination button:hover {
  background-color: #f0f0f0;
}

.pagination button.active {
  background-color: #ddd;
}
</style>
