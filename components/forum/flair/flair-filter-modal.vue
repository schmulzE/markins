<script lang="ts" setup>
import type { Flair } from '~/types/utility';
const store = useModalStore();


defineProps<{
  flairs: Flair[];
  selectedFlair: Flair;
  loadingFlairs: boolean;
}>();

defineEmits(['apply-filter', 'handle-select-flair']);
</script>

<template>
  <div class="p-6 w-full max-w-md relative">
    <button class="absolute top-2 right-2 btn btn-sm btn-ghost" @click.prevent="store.closeModal">
      <i class="i-lucide-x h-5 w-5" />
    </button>
    <h2 class="text-lg font-semibold mb-4 flex items-center"><i class="i-lucide-filter h-5 w-5 mr-2" />Filter by Flair</h2>
    <div v-if="loadingFlairs" class="text-center py-4">
      <span class="loading loading-spinner text-xl" />
    </div>
    <div v-else>
      <div class="flex flex-wrap gap-2 mb-4">
        <button
          class="badge cursor-pointer transition-colors"
          :class="selectedFlair === null ? 'bg-[#297D4E] text-white' : 'badge-outline hover:bg-[#297D4E]/10'"
          @click="$emit('handle-select-flair', null)"
        >
          All
        </button>
        <button
          v-for="flair in flairs"
          :key="flair.id"
          class="badge cursor-pointer transition-colors"
          :class="selectedFlair && selectedFlair.id === flair.id ? 'bg-[#297D4E] text-white' : 'badge-outline hover:bg-[#297D4E]/10'"
          @click="$emit('handle-select-flair', flair)"
        >
          {{ flair.name }}
        </button>
      </div>
      <div class="flex justify-end">
        <button class="btn bg-[#297D4E] text-base-100" @click="$emit('apply-filter')">Apply</button>
      </div>
    </div>
  </div>
</template>
