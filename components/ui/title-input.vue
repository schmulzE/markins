<template>
  <div class="space-y-2 mb-6">
    <label class="label text-base-neutral" for="title">Title *</label>
    <input
      id="title"
      :value="value"
      placeholder="An interesting title for your post"
      class="input input-md text-md bock w-full"
      @input="$emit('update', ($event.target as HTMLInputElement)?.value)"
    >
    <p class="text-sm text-muted-foreground">{{ value.length }}/300 characters</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value: string;
}>()

defineEmits(['update'])
</script>