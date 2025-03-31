<script lang="ts" setup>
import Accordion from '~/components/ui/accordion.vue';
import NavigationMenu from '~/components/ui/navigation-menu.vue';

type Menu = {
   id: string
   title: string
   contents:
   {  name?: string
      image?: string
      link?: string
   }[]
   open: boolean
}[]

defineProps<{ 
   menu: Menu,
   isOpen: boolean,
}>()


const emit = defineEmits(['toggle-sidebar']);

const toggleSidebar = () => {
  emit('toggle-sidebar');
}
</script>

<template>
   <aside 
    class="sidebar font-rubik fixed z-50 md:z-0 md:sticky top-0 left-0 w-full max-w-[280px] h-full border-r border-base-300 px-2 bg-base-100 transform transition-transform duration-300 ease-in-out"
   :class="{
      'translate-x-0': isOpen,
      '-translate-x-full': !isOpen,
      'md:translate-x-0': true,
    }"
   >
   <button class="block md:hidden absolute top-2 right-2" @click="toggleSidebar">
      <i class="i-ri-close-line text-xl"/>
   </button>
      <NavigationMenu/>
      <Accordion :content="menu"/>
   </aside>
</template>