<script lang="ts" setup>
import type { Tag } from '~/pages/tags/index.vue';

defineProps<{
  paginatedTags: Tag[];
  title: string;
}>();
</script>

<template>
  <div class="absolute left-0 mt-4">
    {{ title }}
      <div class="flex flex-col md:flex-row gap-4 mt-8">
        <div v-for="tag in paginatedTags" :key="tag.id" class="border p-2 space-y-2">
          <NuxtLink :to='`/posts/tagged/${tag.title}`' class="text-xs bg-base-200">{{ tag.title }}</NuxtLink>
          <p class="text-sm">{{ tag.description }}</p>
        <p class="text-xs">{{ tag.posts.length }} questions</p>
      </div>
    </div>
  </div>
</template>
