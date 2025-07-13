<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
    <!-- Header slot with fallback to default NavbarHomepageNavbar -->
    <slot name="header"/>
    
    <!-- Main content slot -->
    <main>
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