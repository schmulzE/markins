<template>
  <div class="w-full delay-150">
    <div v-for="(item) in contents" :key="item.id">
      <div 
        class="uppercase p-2.5 flex justify-between items-center cursor-pointer text-base font-extralight text-left" 
        @click.stop="toggleAccordion(item.id)"
      >
        <h3>{{ item.title }}</h3>
        <button>
          <i :class="item.open ? 'i-ri-arrow-up-s-line' : 'i-ri-arrow-down-s-line'" class="text-xl"/>
        </button>
      </div>
      <div v-show="item.open" class="panel" >
        <ul>
          <li 
          v-for="(subContent, index) in item.contents" 
          :key="index"
          class="py-2 flex items-center gap-x-2" 
          >
            <div v-if="subContent.image" class="avatar">
              <div class="w-5 rounded-full bg-white">
                <img :src="subContent.image" alt="community image">
              </div>
            </div>
            <NuxtLink
              :to="subContent.link !== 'advertisement' ? `/m/${subContent.link}` : `/${subContent.link}`" 
              class="text-sm"
            >
            {{ subContent.link }}
            </NuxtLink>
            <span class="text-sm">{{ subContent.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'


const props = defineProps<{
  content: Array<{
    id: string;
    title: string;
    open: boolean;
    contents: Array<{
      image?: string;
      link?: string;
      name?: string;
    }>;
  }>;
}>();

const emit = defineEmits(['toggle-action']);

const contents = ref([...props.content]);

const toggleAccordion = (id: string) => {
  contents.value = contents.value.map(item => ({
    ...item,
    open: item.id === id ? !item.open : item.open
  }));
  emit('toggle-action', id);
};

watch(() => props.content, (newContent) => {
  contents.value = [...newContent];
}, { deep: true });
</script>

<style scoped>
.panel {
  padding: 9px 18px;
  overflow: hidden;
}
</style>