<script lang="ts" setup>

</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
    <div class="flex h-16 items-center justify-between px-4">
      <div class="flex items-center space-x-2">
        <NuxtLink to='/'>
          <img src="/svg/markins-logo.svg" class="h-8">
        </NuxtLink>
      </div>

      <nav class="hidden md:flex items-center space-x-6">
        <NuxtLink to="#" class="text-sm hover:text-[#297D4E] transition-colors">
          Discussions
        </NuxtLink>
        <NuxtLink to="#" class="text-sm hover:text-[#297D4E] transition-colors">
          Communities
        </NuxtLink>
        <NuxtLink to="#" class="text-sm hover:text-[#297D4E] transition-colors">
          Research
        </NuxtLink>
        <NuxtLink to="#blog" class="text-sm hover:text-[#297D4E] transition-colors">
          Blog
        </NuxtLink>
      </nav>

      <div class="flex items-center space-x-4">
        <NuxtLink to="/account/signin" class="rounded p-1.5">
          Sign In
        </NuxtLink>
        <NuxtLink to="/account/signup" class="hidden md:block bg-[#297D4E] py-2 px-4 text-sm rounded text-white hover:bg-[#1f5a37] transition-all duration-300 hover:scale-105">
          Join Community
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
