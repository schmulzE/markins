<script setup lang="ts">
import { useTheme } from '~/composables/useTheme';

const { initTheme } = useTheme();

onMounted(() => {
  initTheme()
});

</script>

<template>
  <div class="min-h-screen bg-base-300">
    <!-- Header -->
    <header class="sticky top-0 z-50 w-full border-b border-gray-300 dark:border-base-100 bg-base-100 backdrop-blur-md">
      <slot name="header" />
    </header>

    <div class="px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Left Sidebar -->
        <div class="lg:col-span-1 space-y-4 order-2 md:order-2 lg:order-1">
          <slot name="left-sidebar" />
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-4 order-1 md:order-1 lg:order-2">
          <slot name="main" />
        </div>

        <!-- Right Sidebar -->
        <div class="lg:col-span-1 space-y-4 order-3">
          <slot name="right-sidebar" />
        </div>
      </div>
    </div>
  </div>
</template>