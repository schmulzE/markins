<script lang="ts" setup>
import { ref, onMounted } from 'vue';
const gsap = await import('gsap').then(m => m.gsap)
const { ScrollTrigger } = await import('gsap/ScrollTrigger')


// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Define the structure of the number object
interface NumberData {
  value: number;
  target: number;
  element: HTMLElement | null;
}

// Define the target numbers
const numbers = ref<NumberData[]>([
  { value: 0, target: 7000, element: null }, // Daily users
  { value: 0, target: 5000, element: null }, // Weekly active unique
  { value: 0, target: 4000, element: null }, // Active communities
  { value: 0, target: 13000, element: null }, // Posts and comments
]);

onMounted(() => {
  // Select all number elements
  const numberElements = document.querySelectorAll<HTMLElement>('.number');

  // Assign each number element to its corresponding ref
  numberElements.forEach((el, index) => {
    numbers.value[index].element = el;
  });

  // Create a ScrollTrigger for each number
  numbers.value.forEach((num, index) => {
    gsap.to(num, {
      value: num.target, // Animate from 0 to the target number
      duration: 2, // Animation duration
      scrollTrigger: {
        trigger: numberElements[index], // Trigger when the number comes into view
        start: 'top 80%', // Start animation when the element is 80% in view
        end: 'bottom 20%', // End animation when the element is 20% in view
        toggleActions: 'play none none none', // Play animation once
      },
      onUpdate: () => {
        // Update the text content of the element with the current value
        if (num.element) {
          num.element.textContent = Math.floor(num.value).toLocaleString();
        }
      },
    });
  });
});
</script>

<template>
  <div class="bg-zinc-900 grid grid-cols-1 md:grid-cols-12 gap-8 px-4 py-8 md:py-8 md:px-24 text-black">
    <div class="bg-white text-center rounded-md p-16 col-span-3">
      <h3 class="text-4xl text-green-500 font-semibold number">0</h3>
      <p class="text-lg">Daily user</p>
    </div>
    <div class="bg-white text-center rounded-md px-8 py-16 col-span-3">
      <h3 class="text-4xl text-green-500 font-semibold number">0</h3>
      <p class="text-lg">Weekly active unique</p>
    </div>
    <div class="bg-white text-center rounded-md py-16 px-8 col-span-3">
      <h3 class="text-4xl text-green-500 font-semibold number">0</h3>
      <p class="text-lg">Active communities</p>
    </div>
    <div class="bg-white text-center rounded-md py-16 px-8 col-span-3">
      <h3 class="text-4xl text-green-500 font-semibold number">0</h3>
      <p class="text-lg">Posts and comments</p>
    </div>
  </div>
</template>