<template>
  <NuxtLink :to="`/tags/${id}`" class="border border-base-100 p-1 text-xs mr-1 bg-green-300 rounded-full text-green-900">
    {{ props.text }}
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps({
  text: String,
  id: String
})
</script>

<style scoped>

</style>