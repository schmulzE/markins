<script lang="ts" setup>
import {onMounted, onUnmounted, ref } from 'vue'
const gsap = await import('gsap').then(m => m.gsap)

const container = ref()
let ctx: gsap.Context;
onMounted(() => {
  ctx = gsap.context(() => {

    const wrap = document.querySelector(".options-sec");
    const img1 = document.querySelector(".img-1");
    const img2 = document.querySelector(".img-2");
    const img3 = document.querySelector(".img-3");
      
    gsap.set(".img-1", { width: "50%" });
    gsap.set(".img-2", { width: "20%" });
    gsap.set(".img-3", { width: "20%" });
    gsap.set(".text-01", { rotate: -90, x: 0, y: 0 });
    gsap.set(".text-02", { rotate: -90, x: 0, y: 0 });


    img1?.addEventListener("mouseenter", () => {
      gsap.to(".img-1", { duration: .5, width: "50%" });
      gsap.to(".img-2", { duration: .5, width: "20%" });
      gsap.to(".img-3", { duration: .5, width: "20%" });
      gsap.to(".text-01", { duration: .5, rotate: -90, x: 0, y: 0 });
      gsap.to(".text-02", { duration: .5, rotate: -90, x: 0, y: 0 });
      
    });
    
    
    img2?.addEventListener("mouseenter", () => { 
      gsap.to(".img-2", { duration: .5, width: "50%" });
      gsap.to(".img-3", { duration: .5, width: "20%" });
      gsap.to(".img-1", { duration: .5, width: "20%" });
      gsap.to(".text-01", { duration: .5, rotate: 0, x: 25, y: 30 });
      gsap.to(".text-02", { duration: .5, rotate: -90, x: 0, y: 0 });
    });
    img3?.addEventListener("mouseenter", () => { 
      gsap.to(".img-3", { duration: .5, width: "50%" });
      gsap.to(".img-1", { duration: .5, width: "20%" });
      gsap.to(".img-2", { duration: .5, width: "20%" });
      gsap.to(".text-01", { duration: .5, rotate: -90, x: 0, y: 0 });
      gsap.to(".text-02", { duration: .5, rotate: 0, x: 25, y: 30 });
      
    });
    
    wrap?.addEventListener("mouseleave", () => {
      gsap.to(".img-1", { duration: 1, width: "50%" });
      gsap.to(".img-2", { duration: 1, width: "20%" });
      gsap.to(".img-3", { duration: 1, width: "20%" });
      gsap.to(".text-01", { duration: .5, rotate: -90, x: 0, y: 0 });
      gsap.to(".text-02", { duration: .5, rotate: -90, x: 0, y: 0 });
    })
  }, container.value);
})

  onUnmounted(() => {
    ctx.revert()
  })

</script>


<template>
  <div class="bg-white px-4 md:px-24">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-x-[400px]">
      <!-- Text section -->
      <div class="col-span-1 h-auto lg:h-[500px] self-center text-center lg:text-left">
        <ul class="text-4xl md:text-5xl lg:text-7xl font-semibold text-[#1e1e2f] space-y-2">
          <li>Discuss.</li>
          <li>Discover.</li>
          <li>Innovate.</li>
        </ul>
      </div>

      <!-- Images section -->
      <div ref="container" class="col-span-1 lg:col-span-3 mt-4 lg:mt-10">
        <div ref="wrap" class="options-sec flex flex-col md:flex-row gap-4 md:gap-5 overflow-hidden">
          <!-- First image -->
          <div ref="img-1" class="img-1 photo w-full md:w-1/2 h-[400px] md:h-[650px] relative">
            <div class="absolute inset-0 rounded-lg bg-gradient-to-b from-transparent via-transparent to-black">
              <div class="flex justify-between px-4 md:px-10 w-full absolute bottom-8 md:bottom-36 text-white">
                <div class="text-xl md:text-3xl">
                  Writing<br> Course
                </div>
                <div>
                  <span class="block mr-3 text-3xl md:text-5xl">100</span>
                  <span class="text-base md:text-lg block uppercase pl-3">topics</span>
                </div>
              </div>
            </div>
            <img class="rounded-lg w-full h-full object-cover" src="https://assets.website-files.com/617fa48948c7ab24b715140e/6183bce7320d030e82c15028_hero_person-1.webp">         
          </div>
          
          <!-- Second image -->
          <div ref="img-2" class="img-2 w-full md:w-1/4 h-[400px] md:h-[650px] relative rounded-lg">
            <div class="absolute inset-0 rounded-lg bg-gradient-to-b from-transparent via-transparent to-black">
              <div class="bg-[#1e1e2f] text-white absolute bottom-8 md:bottom-24">
                <span class="pl-4 md:pl-0 text-01 origin-center -rotate-90 block text-2xl md:text-4xl mb-10 md:mb-20 break-normal  capitalize">writing</span>
              </div>
            </div>
            <img class="rounded-lg w-full h-full object-cover" src="https://assets.website-files.com/617fa48948c7ab24b715140e/6183bce3e584104be2e330e0_hero_person-2.webp">
          </div>

          <!-- Third image -->
          <div ref="img-3" class="img-3 w-full md:w-1/4 h-[400px] md:h-[650px] relative rounded-lg">
            <div class="absolute inset-0 rounded-lg bg-gradient-to-b from-transparent via-transparent to-black">
              <div class="bg-[#1e1e2f] text-white absolute bottom-8 md:bottom-24 w-24 md:w-32">
                <span ref="text" class="pl-4 md:pl-0 text-02 origin-center -rotate-90 block text-2xl md:text-4xl mb-10 md:mb-20 break-normal capitalize">business</span>
              </div>
            </div>
            <img class="rounded-lg w-full h-full object-cover" src="https://assets.website-files.com/617fa48948c7ab24b715140e/6183bb01e5841050e8e31f3b_hero_person-3.webp">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>

@media (max-width: 767px) {
  .img-1, .img-2, .img-3 {
    width: 100% !important; /* Override GSAP styles on mobile */
    height: 400px !important
  }

  .text-01, .text-02 {
    transform: none !important; /* Reset any rotation on mobile */
  }
}

@media (max-width: 768px) {
  .text-01, .text-02 {
    transform: rotate(0deg);
    margin-bottom: 1rem;
  }
}
</style>