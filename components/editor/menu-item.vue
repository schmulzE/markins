<template>
  <button 
  class="border-none active:bg-gray-500 hover:text-black text-black cursor-pointer h-[1.75rem] p-[0.25rem] mr-[0.25rem] w-[1.75rem] bg-base-100" 
  :class="{'is-active' : isActive ? isActive() : null}"
  :title="title"
  @click.prevent="action()"
  >
    <span :class="icon" class="hover:bg-gray-400 hover:font-bold bg-gray-500 text-lg"/>
  </button>
</template>

<script setup lang="ts">

defineProps({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  action: {
    type: Function,
    required: true,
  },
  isActive: {
    type: Function,
    required: false,
    default: () => false,
  }
 });

</script>

<style scoped>

</style>