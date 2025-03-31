<template>
  <NuxtLoadingIndicator />
  <NuxtPage/>
  <Modal/>
</template>


<script setup lang="ts">
import Modal from '~/components/ui/modal.vue';
// Get access to all plugin provides
const { $initializePresence } = useNuxtApp()

// Use the provided function
onMounted(() => {
  $initializePresence()
})

useHead({
  script: [
    {
      innerHTML: `
        (function() {
          const savedTheme = localStorage.getItem('daisyui-theme') || 'light';
          document.documentElement.setAttribute('data-theme', savedTheme);
        })();
      `,
      type: 'text/javascript',
      tagPriority: 'high' // ensure this script runs first
    }
  ]
});
</script>