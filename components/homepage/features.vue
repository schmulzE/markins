<script lang="ts" setup>
  interface Features {
    icon: string;
    title: string;
    description: string;
  };

  interface ScienceCategories {
    icon: string;
    name: string;
    count: string;
  };

  defineProps<{
    isVisible: boolean;
    features: Features[];
    scienceCategories: ScienceCategories[];
  }>();

  

</script>

<template>
  <section id="features" class="py-20 bg-white">
    <div class=" px-4">
      <div
        class="text-center mb-16 transition-all duration-1000"
        :class="{'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-10': !isVisible}"
      >
        <h2 class="text-3xl lg:text-4xl font-bold mb-4">
          Everything You Need for <span class="text-[#297D4E]">Scientific Collaboration</span>
        </h2>
        <p class="text-xl text-gray-500 max-w-2xl mx-auto">
          Powerful tools designed specifically for the scientific community to share, discuss, and advance knowledge
          together.
        </p>
      </div>

      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="group hover:shadow-lg transition-all duration-500 hover:-translate-y-2 cursor-pointer border-0 shadow-md rounded px-6 py-4"
          :class="[
            index === 0 ? 'lg:col-span-2 lg:row-span-2' : '',
            {'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-10': !isVisible}
          ]"
          :style="{ transitionDelay: `${index * 100}ms` }"
        >
          <div class="pb-4">
            <div class="flex items-center space-x-3">
              <div class="p-2 flex rounded-lg bg-[#297D4E]/10 text-[#297D4E] group-hover:bg-[#297D4E] group-hover:text-white transition-all duration-300">
                <i class="text-xl" :class="feature.icon" />
              </div>
              <div class="text-lg font-medium">{{ feature.title }}</div>
            </div>
          </div>
          <div>
            <div class="text-base text-gray-500">{{ feature.description }}</div>
            <div v-if="index === 0" class="mt-6 space-y-4">
              <div class="flex items-center space-x-3 p-3 rounded-lg bg-slate-50">
                <div class="h-8 w-8">
                  <img src="/images/dr_sarah_chen.jpg" alt="SC" class="rounded-full w-full h-full object-cover">
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium">Latest quantum breakthrough discussion</p>
                  <p class="text-xs text-gray-500">2 hours ago • 45 replies</p>
                </div>
              </div>
              <div class="flex items-center space-x-3 p-3 rounded-lg bg-slate-50">
                <div class="h-8 w-8">
                  <img src="/images/prof_michael_rodriguez.jpg" alt="MB" class="rounded-full w-full h-full object-cover">
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium">CRISPR gene editing ethics debate</p>
                  <p class="text-xs text-gray-500">5 hours ago • 23 replies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Science Categories -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div
          v-for="(category, index) in scienceCategories"
          :key="index"
          class="group hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer rounded-lg border-gray-200 border"
          :class="{'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-10': !isVisible}"
          :style="{ transitionDelay: `${600 + index * 50}ms` }"
        >
          <div class="p-4 text-center rounded">
            <div class="text-[#297D4E] group-hover:scale-110 transition-transform duration-300 mb-2 flex justify-center">
              <i class="text-xl" :class="category.icon" />
            </div>
            <h3 class="font-medium text-sm mb-1">{{ category.name }}</h3>
            <p class="text-xs text-gray-500">{{ category.count }} posts</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>