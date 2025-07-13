<script setup lang="ts">
import { useTheme } from '~/composables/useTheme';

const { initTheme } = useTheme();

onMounted(() => {
  initTheme()
});

</script>

<template>
  <div class="min-h-screen bg-base-300">  
    <header> 
      <slot name="header" />
    </header>

    <main> 
      <slot name="main" />
    </main>
  </div>
</template>
