<template>
  <div class="relative flex flex-col">
    <!-- Header slot with fallback to default NavbarHomepageNavbar -->
    <slot name="header"/>
    
    <!-- Main content slot -->
    <main class="flex-1">
      <slot name="main"/>
    </main>
    
    <!-- Footer slot with fallback to default Footer -->
    <slot name="footer"/>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>