  <template>
    <div data-theme="light" class="navbar" :class='stickyNavbar'>
      <div class="navbar-start">
        <NuxtLink to='/'>
          <img src="/svg/markins-logo.svg" class="h-8">
        </NuxtLink>
      </div>
      
      <!-- Mobile menu (hamburger) button -->
      <div class="navbar-end lg:hidden">
        <button class="btn btn-ghost" @click="toggleMobileMenu" >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      <!-- Desktop menu -->
      <div class="navbar-center hidden lg:flex">
        <ul class="flex gap-10 font-thin px-1 text-[#1e1e2f] text-md">
          <li><a class="nav-link">About</a></li>
          <li><a class="nav-link">Careers</a></li>
          <li><a class="nav-link">Skills</a></li>
          <li><a class="nav-link">Brand</a></li>
          <li><a class="nav-link">Blog</a></li>
        </ul>
      </div>
      
      <div class="navbar-end hidden lg:flex gap-8">
        <NuxtLink to="/posts" class="btn bg-[seagreen] text-white rounded-3xl hover:bg-[#297d4e]">Join now</NuxtLink>
      </div>
    </div>
    
    <!-- Mobile menu drawer -->
    <div v-if="mobileMenuOpen" class="lg:hidden fixed inset-0 bg-white z-50 pt-20 px-6">
      <button class="absolute top-4 right-4" @click="toggleMobileMenu" >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <ul class="flex flex-col gap-6 font-thin text-[#1e1e2f] text-xl">
        <li><a class="nav-link" @click="toggleMobileMenu">About</a></li>
        <li><a class="nav-link" @click="toggleMobileMenu">Careers</a></li>
        <li><a class="nav-link" @click="toggleMobileMenu">Skills</a></li>
        <li><a class="nav-link" @click="toggleMobileMenu">Brand</a></li>
        <li><a class="nav-link" @click="toggleMobileMenu">Blog</a></li>
        <li class="mt-6">
          <NuxtLink 
          to="/posts" 
          class="btn bg-[seagreen] text-white rounded-3xl hover:bg-[#297d4e] w-full" 
          @click="toggleMobileMenu" 
          >
            Join now
          </NuxtLink>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
    import {ref, onMounted} from 'vue';
    const stickyNavbar = ref('navbar px-4 sm:px-8 md:px-16 lg:px-24 py-4 lg:py-6 transition duration-300 ease-in smooth-scroll')
    const route = useRoute()
    const mobileMenuOpen = ref(false)
    
    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value;
      // Prevent scrolling when menu is open
      if (mobileMenuOpen.value) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }
    
    const stickyNavbarHandler = () => {
      if (window !== undefined && route.path === '/') {
        const windowHeight = window.scrollY;
        stickyNavbar.value = windowHeight > 800 
          ? 'navbar px-4 sm:px-8 md:px-16 lg:px-24 fixed top-0 left-0 w-full bg-white z-50 py-4 lg:py-6 transition duration-300 smooth-scroll ease-in'
          : 'navbar px-4 sm:px-8 md:px-16 lg:px-24 py-4 lg:py-6 transition duration-300 ease-in smooth-scroll';
      }
    };
  
    onMounted(() => {
      window.addEventListener('scroll', stickyNavbarHandler)
    })
  
    onUnmounted(() => {
      window.removeEventListener('scroll', stickyNavbarHandler)
      document.body.style.overflow = 'auto';  // Ensure scrolling is enabled when component unmounts
    })
  </script>
  
  <style scoped>
  ul, a {
    font-family: 'Mali',sans-serif;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all .35s
  }

  .nav-link:before{
    position: absolute;
    left: 0;
    content: "";
    width: 100%;
    height: 40%;
    bottom: -120%;
    background: seagreen;
    z-index: -1;
    transition: all .35s;
  }

  .nav-link:hover:before{
    bottom: 0;
  }

  .fill-up{
    display: block;
    width: 120px;
    height: 50px;
    text-decoration: none;
    text-align: center;
    border-radius: 50px;
    border: 3px solid seagreen;
    color: seagreen;
    font-size: 15px;
    position: relative;
    overflow: hidden;
    background: transparent;
    text-transform: capitalize;
    transition: all .35s;
  }

  .fill-up:before{
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    bottom: -100%;
    left: 0;
    background: seagreen;
    z-index: -1;
    transition: all .35s;
  }

  .fill-up:hover{
    color: #fff;
  }

  .fill-up:hover:before{
    bottom: 0;
  }
  
  /* Mobile menu specific styles */
  @media (max-width: 1023px) {
    .nav-link {
      display: block;
      padding: 0.5rem 0;
    }
  }
  </style>