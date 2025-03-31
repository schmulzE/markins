<template>
  <DefaultLayout>
    <template #header>
      <NavbarHomepageNavbar/>
    </template>
    <template #main>
      <HeroSection/>
      <Features/>
      <About/>
      <Blog/>
    </template>
    <template #footer>
      <Footer/>
    </template>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '~/layouts/default.vue';
import Blog from '~/components/homepage/blog.vue';
import About from '~/components/homepage/about.vue';
import Footer from '~/components/homepage/footer.vue';
import Features from '~/components/homepage/features.vue';
import HeroSection from '~/components/homepage/hero-section.vue';

definePageMeta({
  colorMode: 'light',
});


</script>

<style lang="css" scoped>
body{
  background: linear-gradient(to bottom, #fefefe, #ffffff,#f8f4f1);
  font-family: 'Varela', sans-serif
}
.options-sec{
  width: 100%;
  display: flex;
  overflow: hidden;
}
.img-1{
  width: 50%;
  height: 650px;
}
 .img-2, .img-3{
  width: 30%;
  height: 650px;
}

img{
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>