<template>
  <footer data-theme="light" class="bg-zinc-800 text-white w-full">
    <section class="bg-zinc-800 grid grid-cols-1 md:grid-cols-12 px-4 md:px-24 py-8">
      <NuxtLink to='/' class="col-span-1 md:col-span-4 mb-8 md:mb-0">
        <img src="/svg/markins-logo.svg" class="object-contain w-64 h-auto items-start">
      </NuxtLink>
      <div class="col-span-1 md:col-span-3 space-y-2 mb-8 md:mb-0">
        <h5 class="font-medium text-base">Company</h5>
        <div class="cursor-pointer text-xs flex flex-col gap-2">
          <a>About us</a>
          <a>Terms and condition</a>
          <a>Privacy and policy</a>
          <a>Contact us</a>
        </div>
      </div>
      <div class="col-span-1 md:col-span-3 space-y-2 mb-8 md:mb-0">
        <h5 class="font-medium text-base">Company</h5>
        <div class="cursor-pointer text-xs flex flex-col gap-2">
          <a>About us</a>
          <a>Terms and condition</a>
          <a>Privacy and policy</a>
          <a>Contact us</a>
        </div>
      </div>
      <div class="col-span-1 md:col-span-2 flex flex-col items-center md:items-end gap-y-2">
        <h5>Find us on</h5>
        <div class="space-x-2">
          <a href="#" class="text-xl"><i class="ri i-ri-facebook-fill" /></a>
          <a href="#" class="text-xl"><i class="ri i-ri-instagram-line" /></a>
          <a href="#" class="text-xl"><i class="ri i-ri-twitter-line" /></a>
        </div>
      </div>
    </section>
    <section class="bg-zinc-900 px-4 md:px-24 py-4 text-sm flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
      <p>Copyright © 2025 - Markins</p>
      <p>All right reserved</p>
    </section>
  </footer>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>