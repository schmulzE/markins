<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
    <!-- Header -->
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
          <NuxtLink to="/account/signup" class="bg-[#297D4E] py-2 px-4 text-sm rounded text-white hover:bg-[#1f5a37] transition-all duration-300 hover:scale-105">
            Join Community
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
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
              <button class="bg-[#297D4E] flex items-center text-white py-3 px-8 text-sm rounded hover:bg-[#1f5a37] transition-all duration-300 hover:scale-105 group" >
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

    <!-- Features Section - Bento Grid -->
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

    <!-- Community Section -->
    <section class="py-20 bg-gradient-to-br from-[#297D4E]/5 to-green-50">
      <div class=" px-4">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div
            class="space-y-6 transition-all duration-1000"
            :class="{'opacity-100 translate-x-0': isVisible, 'opacity-0 -translate-x-10': !isVisible}"
          >
            <h2 class="text-3xl lg:text-4xl font-bold">
              Join a Global Community of <span class="text-[#297D4E]">Science Enthusiasts</span>
            </h2>
            <p class="text-lg text-gray-500">
              Connect with researchers, professors, students, and curious minds from around the world. Share your
              discoveries, get feedback on your research, and collaborate on groundbreaking projects.
            </p>

            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <div class="p-2 rounded-full flex justify-center bg-[#297D4E]/10">
                  <i class="h-5 w-5 text-[#297D4E] i-lucide-users" />
                </div>
                <span class="font-medium">50,000+ active researchers and students</span>
              </div>
              <div class="flex items-center space-x-3">
                <div class="p-2 flex justify-center rounded-full bg-[#297D4E]/10">
                  <i class="h-5 w-5 text-[#297D4E] i-lucide-book-open" />
                </div>
                <span class="font-medium">100,000+ scientific discussions</span>
              </div>
              <div class="flex items-center space-x-3">
                <div class="p-2 flex justify-center rounded-full bg-[#297D4E]/10">
                  <i class="h-5 w-5 text-[#297D4E] i-lucide-trending-up" />
                </div>
                <span class="font-medium">Daily trending topics and breakthroughs</span>
              </div>
            </div>

            <button class="bg-[#297D4E] py-3 px-8 text-sm text-white rounded hover:bg-[#1f5a37] transition-all duration-300 hover:scale-105">
              Join the Community
            </button>
          </div>

          <div
            class="relative transition-all duration-1000 delay-300"
            :class="{'opacity-100 translate-x-0': isVisible, 'opacity-0 translate-x-10': !isVisible}"
          >
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-4">
                <div class="group hover:shadow-lg transition-all duration-300 bg-white rounded-lg border border-gray-200">
                  <div class="p-4">
                    <div class="flex items-center space-x-3 mb-3">
                      <div class="h-8 w-8">
                        <img src="/images/dr_rachel_kim.jpg" class="h-full w-full object-cover rounded-full"  alt="DR">
                      </div>
                      <div>
                        <p class="font-medium text-sm">Dr. Rachel Kim</p>
                        <p class="text-xs text-gray-500">Quantum Physicist</p>
                      </div>
                    </div>
                    <p class="text-sm text-gray-500">
                      "Amazing platform for discussing cutting-edge research with peers worldwide."
                    </p>
                  </div>
                </div>

                <div class="group hover:shadow-lg transition-all duration-300 bg-white rounded-lg border border-gray-200">
                  <div class="p-4">
                    <div class="flex items-center space-x-3 mb-3">
                      <div class="h-8 w-8">
                        <img src="/images/prof_maria_santos.jpg" class="h-full w-full object-cover rounded-full"  alt="MS">
                      </div>
                      <div>
                        <p class="font-medium text-sm">Prof. Maria Santos</p>
                        <p class="text-xs text-gray-500">Marine Biologist</p>
                      </div>
                    </div>
                    <p class="text-sm text-gray-500">
                      "The collaborative environment here has enhanced my research significantly."
                    </p>
                  </div>
                </div>
              </div>

              <div class="pt-8 space-y-4">
                <div class="group hover:shadow-lg transition-all duration-300 bg-white rounded-lg border border-gray-200">
                  <div class="p-4">
                    <div class="flex items-center space-x-3 mb-3">
                      <div class="h-8 w-8">
                        <img src="/images/james_liu.jpg" class="h-full w-full object-cover rounded-full"  alt="JL">
                      </div>
                      <div>
                        <p class="font-medium text-sm">James Liu</p>
                        <p class="text-xs text-gray-500">PhD Student</p>
                      </div>
                    </div>
                    <p class="text-sm text-gray-500">
                      "Perfect place to get feedback on my thesis and connect with experts."
                    </p>
                  </div>
                </div>

                <div class="group hover:shadow-lg transition-all duration-300 bg-white rounded-lg border border-gray-200">
                  <div class="p-4">
                    <div class="flex items-center space-x-3 mb-3">
                      <div class="h-8 w-8">
                        <img src="/images/dr_ahmed_ben.jpg" class="h-full w-full object-cover rounded-full" alt="AB">
                      </div>
                      <div>
                        <p class="font-medium text-sm">Dr. Ahmed Ben</p>
                        <p class="text-xs text-gray-500">Astrophysicist</p>
                      </div>
                    </div>
                    <p class="text-sm text-gray-500">
                      "Incredible community of passionate scientists and researchers."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Blog Section -->
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

    <!-- CTA Section -->
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

    <!-- Footer -->
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
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {

  setup() {
    const isVisible = ref(false);

    onMounted(() => {
      isVisible.value = true;
    });

    const features = [
      {
        icon: 'i-lucide-message-square',
        title: "Post & Discuss",
        description: "Share your research, ask questions, and engage in meaningful scientific discussions",
      },
      {
        icon: 'i-lucide-thumbs-up',
        title: "Vote & Rank",
        description: "Community-driven content curation through upvoting and downvoting",
      },
      {
        icon: 'i-lucide-share-2',
        title: "Share Knowledge",
        description: "Easily share discoveries and insights across social platforms",
      },
      {
        icon: 'i-lucide-users',
        title: "Join Communities",
        description: "Connect with researchers, students, and science enthusiasts worldwide",
      },
    ];

    const blogPosts = [
      {
        title: "Breakthrough in Quantum Computing: New Qubit Stability Record",
        excerpt: "Researchers achieve 99.9% fidelity in quantum state preservation, marking a significant milestone...",
        author: "Dr. Sarah Chen",
        date: "2 days ago",
        category: "Physics",
        votes: 234,
        comments: 45,
        image: '/images/dr_sarah_chen.jpg'
      },
      {
        title: "CRISPR 3.0: Enhanced Gene Editing with Minimal Off-Target Effects",
        excerpt: "Latest developments in gene editing technology promise safer therapeutic applications...",
        author: "Prof. Michael Rodriguez",
        date: "4 days ago",
        category: "Biology",
        votes: 189,
        comments: 32,
        image: '/images/prof_michael_rodriguez.jpg'
      },
      {
        title: "Climate Models Predict Accelerated Arctic Ice Loss",
        excerpt: "New computational models suggest faster than expected changes in polar ice coverage...",
        author: "Dr. Emma Thompson",
        date: "1 week ago",
        category: "Climate Science",
        votes: 156,
        comments: 78,
        image: '/images/dr_emma_thompson.jpg'
      },
    ];

    const scienceCategories = [
      { icon: 'i-lucide-atom', name: "Physics", count: "12.5K" },
      { icon: 'i-lucide-dna', name: "Biology", count: "8.3K" },
      { icon: 'i-lucide-calculator', name: "Mathematics", count: "6.7K" },
      { icon: 'i-lucide-beaker', name: "Chemistry", count: "5.2K" },
      { icon: 'i-lucide-telescope', name: "Astronomy", count: "4.1K" },
      { icon: 'i-lucide-zap', name: "Engineering", count: "7.8K" },
    ];

    return {
      isVisible,
      features,
      blogPosts,
      scienceCategories,
    };
  },
};
</script>