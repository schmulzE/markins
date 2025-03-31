<template>
  <div class="relative overflow-hidden min-h-screen">
    <NavbarForumNavbar @toggle-sidebar="toggleSidebar" />
    <main 
		:class="['h-screen flex flex-col md:flex-row overflow-y-auto bg-base-300 pt-8', { 'gap-x-4': shouldApplyGap }]"	
		>
      <!-- Sidebar -->
      <Sidebar :menu="menu" :is-open="isSidebarOpen" @toggle-sidebar="toggleSidebar" />

      <!-- Main Content Slot -->
      <div class="flex-1 bg-base-100">
        <slot name="main" />
      </div>

      <!-- Aside Slot (Optional) -->
      <aside 
			v-show="$slots.aside" 
			class="sticky top-0 w-full max-w-xs px-2 bg-base-100 overflow-hidden"
			>
        <slot name="aside" />
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '~/components/ui/sidebar.vue';

import { useRoute } from 'vue-router';

const route = useRoute();
const shouldApplyGap = ref(false);
// Define the target routes
const isTargetRoute = () => {
  const path = route.path;
  const routeName = route.name;
  const query = route.query;

  // Exact matches
  if (path === '/posts' || path === '/m/popular') return true;

  // Dynamic route patterns
  if (path.startsWith('/posts/tagged/') || path.startsWith('/post')) return true;

  // Match by route name
  if (routeName === 'search' || routeName === 'posts-tagged') return true;

  // Match routes with query parameters
  if (path === '/search' && query.q) return true;

  return false;
};

// Initialize the gap state based on the current route
shouldApplyGap.value = isTargetRoute();

// Wait for the route transition to complete before updating the gap state
onBeforeRouteLeave(() => {
  shouldApplyGap.value = isTargetRoute();
});

const menu = [
	{
		id: '1',
		title: 'communities',
		contents: [
			{
				image: '/images/general-science.jpg',
				link: 'GeneralScience'
			},
			{
				image: '/images/mathematics.png',
				link: 'mathematics'
			},
			{
				image: '/images/physics.png',
				link: 'physics'
			},
			{
				image: '/images/chemistry.png',
				link: 'chemistry'
			},
			{
				image: '/images/biology.png',
				link: 'biology'
			},
		],
		open: true,
	},
	{
		id: '2',
		title: 'resource',
		contents: [
			{
				image: '',
				link: 'advertisement'
			}
		],
		open: true,
	},
]

// Add to existing script setup
const isSidebarOpen = ref(false);

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

// Close sidebar when clicking outside
onMounted(() => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.querySelector('.toggle-sidebar-button');

    if (isSidebarOpen.value && sidebar && !sidebar.contains(target) && !toggleButton?.contains(target)) {
      isSidebarOpen.value = false;
    }
  });
});

onBeforeUnmount(() => {
  document.removeEventListener('click', () => {});
});
</script>

<style scoped>
.break-words {
	word-break: break-all;
	overflow-wrap: break-word;
}

main {
  transition: gap 0.2s ease-in-out;
}
</style>