<template>
  <div class="space-y-2 mt-6">
    <label class="flex items-center space-x-2">
      <i class="h-4 w-4 i-lucide-hash" />
      <span>Flairs (optional)</span>
    </label>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="flair in flairs"
        :key="flair.id"
        class="badge cursor-pointer transition-colors"
        :class="selected.includes(flair) 
          ? 'bg-[#297D4E] hover:bg-[#1f5a37]' 
          : 'hover:bg-[#297D4E]/10 badge-outline'"
        @click="toggleFlair(flair)"
      >
        {{ flair.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Flair } from '~/types/utility';


const props = defineProps<{
  flairs: Flair[];
  selected: Flair[];
}>();

const emit = defineEmits(['update'])

const toggleFlair = (flair: Flair) => {
  const newSelected = props.selected.includes(flair)
    ? props.selected.filter(f => f.id !== flair.id)
    : [...props.selected, flair]
  emit('update', newSelected)
}
</script>