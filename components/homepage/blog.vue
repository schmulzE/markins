<script lang="ts" setup>
  interface BlogPosts {
    title: string;
    excerpt: string;
    author: string;
    date: string;
    category: string;
    votes: number;
    comments: number;
    image: string;
  };

  defineProps<{
    isVisible: boolean;
    blogPosts: BlogPosts[]
  }>();

</script>


<template>
  <section id="#blog" class="py-20 bg-white">
    <div class="px-4">
      <div
        class="text-center mb-16 transition-all duration-1000"
        :class="{'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-10': !isVisible}"
      >
        <h2 class="text-3xl lg:text-4xl font-bold mb-4">
          Latest from the <span class="text-[#297D4E]">Science Blog</span>
        </h2>
        <p class="text-xl text-gray-500 max-w-2xl mx-auto">
          Stay updated with the latest scientific breakthroughs, research findings, and community discussions.
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div
          v-for="(post, index) in blogPosts"
          :key="index"
          class="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer p-4 rounded-lg border border-gray-200"
          :class="{'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-10': !isVisible}"
          :style="{ transitionDelay: `${index * 150}ms` }"
        >
          <div class="pb-4">
            <div class="flex items-center justify-between mb-2">
              <div variant="secondary" class="bg-[#297D4E]/10 rounded-full text-xs px-2 py-1 font-medium text-[#297D4E]">
                {{ post.category }}
              </div>
              <div class="flex items-center space-x-1 text-sm text-gray-500">
                <i class="h-3 w-3 i-ri-calendar-line" />
                <span>{{ post.date }}</span>
              </div>
            </div>
            <div class="text-lg group-hover:text-[#297D4E] font-medium transition-colors">{{ post.title }}</div>
          </div>
          <div class="space-y-4">
            <div class="text-sm text-gray-500 leading-relaxed">{{ post.excerpt }}</div>

            <div class="flex items-center justify-between pt-4 0 border-t border-gray-200">
              <div class="flex items-center space-x-2">
                <div class="h-6 w-6">
                  <img :src="post.image" :alt="post.author.split(' ').map(n => n[0]).join('')" class="w-full h-full object-cover rounded-full">
                </div>
                <span class="text-sm font-medium">{{ post.author }}</span>
              </div>

              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <div class="flex items-center space-x-1">
                  <i class="h-3 w-3 i-mdi-thumbs-up-outline" />
                  <span>{{ post.votes }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <i class="h-3 w-3 i-lucide-message-square" />
                  <span>{{ post.comments }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center flex justify-center">
        <button
          class="border-[#297D4E] py-3 px-8 text-sm flex items-center rounded text-[#297D4E] border hover:bg-[#297D4E] hover:text-white transition-all duration-300 group"
        >
          View All Posts
          <i class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 i-lucide-arrow-right" />
        </button>
      </div>
    </div>
  </section>
</template>