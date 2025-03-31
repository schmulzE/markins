<script lang="ts" setup>
import { onMounted } from 'vue';
const gsap = await import('gsap').then(m => m.gsap)
const { ScrollTrigger } = await import('gsap/ScrollTrigger')

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
  // Select all sections
  const sections = document.querySelectorAll('section');

  sections.forEach((section) => {
    const images = section.querySelectorAll('.img');
    const texts = section.querySelectorAll('.text');

    // Set initial styles for images and texts
    gsap.set(images, { autoAlpha: 0, y: 50 });
    gsap.set(texts, { autoAlpha: 0, y: 20 });

    // Create a timeline for each section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%', // Start animation when the top of the section is 80% in view
        end: 'bottom 20%', // End animation when the bottom of the section is 20% in view
        toggleActions: 'play none none reverse', // Play animation on enter, reverse on leave
      },
    });

    // Add animations to the timeline
    tl.to(images, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.2 })
      .to(texts, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 }, '-=0.5');
  });
});
</script>

<template>
  <div class="bg-white px-4 md:px-24 py-16 space-y-4 text-black">
    <section class="bg-orange-50 grid grid-cols-1 md:grid-cols-8 justify-between rounded-lg p-8 gap-y-8 md:gap-y-0">
      <div class="col-span-4 flex flex-col text-center md:text-left justify-center space-y-4 text">
        <h3 class="text-4xl font-semibold">Post</h3>
        <p class="text-xl">The community can share content by posting stories, links, images, and videos.</p>
      </div>
      <div class="col-span-4 flex justify-center md:justify-end">
        <img src="/images/post-image.png" class="w-[250px] img">
      </div>
    </section>
    <section class="bg-green-50 grid grid-cols-1 md:grid-cols-8 rounded-lg p-8">
      <div class="col-span-4">
        <img src="/images/comment-image.png" class="w-[350px] img">
      </div>
      <div class="col-span-4 flex flex-col md:text-left text-center justify-center space-y-4 text">
        <h3 class="text-4xl font-semibold">Comment</h3>
        <p class="text-xl">The community comments on posts. Comments provide discussion and often humor.</p>
      </div>
    </section>
    <section class="bg-yellow-50 grid grid-cols-1 md:grid-cols-8 rounded-lg p-8 gap-y-8 md:gap-y-0">
      <div class="col-span-4 flex flex-col text-center md:text-left justify-center space-y-4 text">
        <h3 class="text-4xl font-semibold">Vote</h3>
        <p class="text-xl">Comments & posts can be upvoted or downvoted. The most interesting content rises to the top.</p>
      </div>
      <div class="col-span-4 flex justify-center md:justify-end">
        <img src="/images/vote-image.png" class="w-[250px] img">
      </div>
    </section>
  </div>
</template>