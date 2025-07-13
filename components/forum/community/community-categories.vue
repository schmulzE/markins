<script lang="ts" setup>
const emit = defineEmits(['select-category'])
interface Categories {
  id: string;
  name: string;
  icon: string;
};

defineProps<{
  categories: Categories[];
  selectedCategory: string;
}>();

const handleCategoryChange = (categoryId: string) => {
  emit('select-category', categoryId)
};
</script>

<template>
  <div class="card shadow p-4 border bg-base-100 border-gray-300 dark:border-base-300">
    <div class="text-lg mb-4 font-medium">Categories</div>
    <div class="space-y-2">
      <button
        v-for="category in categories"
        :key="category.id"
        class="cursor-pointer"
        :class="`w-full text-left p-2 rounded-lg transition-colors flex items-center space-x-2 ${
          selectedCategory === category.id ? 'bg-[#297D4E]/10 text-[#297D4E]' : 'hover:bg-gray-50 dark:hover:bg-base-200'
        }`"
        @click="handleCategoryChange(category.id)"
      >
        <span>{{ category.icon }}</span>
        <span class="text-sm">{{ category.name }}</span>
      </button>
    </div>
  </div>
</template>
