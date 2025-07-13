<script lang="ts" setup>
  defineProps<{
    isVisible: boolean;
  }>();
</script>

<template>
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
</template>
