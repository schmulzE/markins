<script lang="ts" setup>
 defineProps<{
  isVisible: boolean;
 }>();
</script>

<template>
  <section class="py-20 bg-gradient-to-r from-[#297D4E] to-[#1f5a37]">
    <div class=" px-4 text-center">
      <div
        class="space-y-8 transition-all duration-1000"
        :class="{'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-10': !isVisible}"
      >
        <h2 class="text-3xl lg:text-4xl font-bold text-white">Ready to Join the Scientific Revolution?</h2>
        <p class="text-xl text-green-100 max-w-2xl mx-auto">
          Connect with brilliant minds, share groundbreaking research, and be part of the future of scientific
          collaboration.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            class="bg-white text-[#297D4E] py-3 px-8 text-sm rounded hover:bg-gray-100 transition-all duration-300 hover:scale-105"
          >
            Get Started Free
          </button>
          <button
            class="border-white border py-3 px-8 text-sm rounded text-white hover:bg-white hover:text-[#297D4E] transition-all duration-300"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
