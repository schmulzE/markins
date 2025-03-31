<script lang="ts" setup>
const route = useRoute();
</script>

<template>
  <ul class="menu group rounded-box capitalize w-full pt-12">
    <li>
      <NuxtLink to="/posts" :exact-active-class="'bg-base-300'" class="flex items-center w-full hover:bg-base-200">
        <i class="i-ph-house text-2xl" :class="{' i-ph-house-fill': route.path == '/posts'}" />
        home
      </NuxtLink>
    </li>
    <li>
      <NuxtLink to="/m/popular" :exact-active-class="'bg-base-300'" class="flex items-center w-full hover:bg-base-200">
        <i class="i-ph-arrow-circle-up-right text-2xl" :class="{' i-ph-arrow-circle-up-right-fill': route.path == '/m/popular'}" />
        popular
      </NuxtLink>
    </li>
    <li>
      <NuxtLink to="/tags" :exact-active-class="'bg-base-300'" class="flex items-center w-full hover:bg-base-200">
        <i class="text-xl i-ph-tag" :class="{' i-ph-tag-fill': route.path === '/tags'}" />
        tags
      </NuxtLink>
    </li>
  </ul>
</template>


<style scoped>
.nuxt-link-active {
  font-weight: bold;
}
</style>