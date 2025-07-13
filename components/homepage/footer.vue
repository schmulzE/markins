<template>
  <footer class="bg-slate-900 text-white py-16">
    <div class="px-4">
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <NuxtLink to='/'>
              <img src="/svg/markins-logo.svg" class="h-8">
            </NuxtLink>
          </div>
          <p class="text-gray-400">
            Connecting the global scientific community through meaningful discussions and collaborative research.
          </p>
        </div>

        <div>
          <h3 class="font-semibold mb-4">Community</h3>
          <ul class="space-y-2 text-gray-400">
            <li>
              <NuxtLink to="#" class="hover:text-white transition-colors">
                Discussions
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="#" class="hover:text-white transition-colors">
                Research Groups
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="#" class="hover:text-white transition-colors">
                Events
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="#" class="hover:text-white transition-colors">
                Mentorship
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-semibold mb-4">Resources</h3>
          <ul class="space-y-2 text-gray-400">
            <li>
              <NuxtLink to="#" class="hover:text-white transition-colors">
                Blog
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="#" class="hover:text-white transition-colors">
                Research Papers
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="#" class="hover:text-white transition-colors">
                Guidelines
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="#" class="hover:text-white transition-colors">
                Help Center
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-semibold mb-4">Company</h3>
          <ul class="space-y-2 text-gray-400">
            <li>
              <NuxtLink to="#" class="hover:text-white transition-colors">
                About
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="#" class="hover:text-white transition-colors">
                Careers
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="#" class="hover:text-white transition-colors">
                Privacy
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="#" class="hover:text-white transition-colors">
                Terms
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 pt-8 text-center text-gray-400">
        <p>&copy; {{ new Date().getFullYear() }} markins. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>