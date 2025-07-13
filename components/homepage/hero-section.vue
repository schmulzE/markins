<script lang="ts" setup>
 defineProps<{
  isVisible: boolean;
 }>();
</script>


<template>
  <section class="relative overflow-hidden py-20 lg:py-32">
    <div class="px-4">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div
          class="space-y-8 transition-all duration-1000"
          :class="{'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-10': !isVisible}"
        >
          <div class="space-y-4">
            <div class="text-xs rounded-full badge badge-soft badge-success text-[#297D4E] hover:bg-[#297D4E]/20 transition-colors">
              🧬 Science Community Platform
            </div>
            <h1 class="text-4xl lg:text-6xl font-bold leading-tight">
              Where Science
              <span class="text-[#297D4E] block">Meets Community</span>
            </h1>
            <p class="text-xl text-gray-500 max-w-lg">
              Join thousands of researchers, students, and science enthusiasts in meaningful discussions about the
              latest discoveries and breakthroughs.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <button class="bg-[#297D4E] flex justify-center items-center text-white py-3 px-8 text-sm rounded hover:bg-[#1f5a37] transition-all duration-300 hover:scale-105 group" >
              Start Exploring
              <i class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 i-lucide-arrow-right" />
          </button>
            <button
              class="border-[#297D4E] border py-3 px-8 text-sm rounded text-[#297D4E] hover:bg-[#297D4E] hover:text-white transition-all duration-300"
            >
              Watch Demo
            </button>
          </div>

          <div class="flex items-center space-x-8 pt-8">
            <div class="text-center">
              <div class="text-2xl font-bold text-[#297D4E]">50K+</div>
              <div class="text-sm text-gray-500">Active Members</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-[#297D4E]">100K+</div>
              <div class="text-sm text-gray-500">Discussions</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-[#297D4E]">25+</div>
              <div class="text-sm text-gray-500">Science Fields</div>
            </div>
          </div>
        </div>

        <!-- Hero Images -->
        <div
          class="relative transition-all duration-1000 delay-300"
          :class="{'opacity-100 translate-x-0': isVisible, 'opacity-0 translate-x-10': !isVisible}"
        >
          <div class="grid grid-cols-2 gap-4 h-[500px]">
            <div class="space-y-4">
              <div class="relative h-48 rounded-2xl overflow-hidden group cursor-pointer">
                <img
                  src="/images/laboratory_research.jpg"
                  alt="Laboratory Research"
                  class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div class="absolute bottom-4 left-4 text-white">
                  <div class="flex items-center space-x-2">
                    <i class="h-4 w-4 i-lucide-beaker" />
                    <span class="text-sm font-medium">Lab Research</span>
                  </div>
                </div>
              </div>
              <div class="relative h-48 rounded-2xl overflow-hidden group cursor-pointer">
                <img
                  src="/images/space_exploration.jpg"
                  alt="Space Exploration"
                  class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div class="absolute bottom-4 left-4 text-white">
                  <div class="flex items-center space-x-2">
                    <i class="h-4 w-4 i-lucide-telescope" />
                    <span class="text-sm font-medium">Astronomy</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="pt-8">
              <div class="relative h-80 rounded-2xl overflow-hidden group cursor-pointer">
                <img
                  src="/images/dna.jpg"
                  alt="DNA Research"
                  class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div class="absolute bottom-4 left-4 text-white">
                  <div class="flex items-center space-x-2">
                    <i class="h-4 w-4 i-lucide-dna" />
                    <span class="text-sm font-medium">Genetics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>

</style>