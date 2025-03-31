<template>
  <div class="bg-base-100 my-4">
    <!-- Render the tab headers in a scrollable container -->
    <div class="overflow-x-auto md:overflow-x-hidden hide-scrollbar">
      <div class="tabs w-full tabs-bordered mx-2 py-1 flex whitespace-nowrap">
          <a
          v-for="(tab, index) in tabList"
          :key="index"
          :class="{'text-base-content text-sm bg-base-300 rounded-full' : index === activeTab }"
          class="tab capitalize hover:underline flex-shrink-0"
          @click="setActiveTab(index, tab.name,)"
        >
          {{ tab.name }}
        </a>
      </div>
    </div>

    <!-- Render the active tab content -->
    <div class="tab-content bg-red-700">
      <!-- <slot :name="tabs[activeTab].slot"/> -->
       <slot :name="activeSlot" />
    </div>
  </div>
</template>

<script lang="ts">
// import { defineComponent, ref } from 'vue';
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  name: 'Tabs',
  props: {
    initialActive: {
      type: Number,
      default: 0
    },
    tabs: {
      type: Array<{ name: string; slot: string }>,
      default: () => []
    }
  },
  emits: ['tab-changed'],
  setup(props, { emit }) {
    const activeTab = ref(props.initialActive);

    const setActiveTab = (index: number, tabName: string) => {
      activeTab.value = index;
      emit('tab-changed', tabName);
    };

    // Compute the active slot dynamically
    const activeSlot = computed(() => props.tabs[activeTab.value]?.slot || '');

    return {
      activeTab,
      tabList: props.tabs,
      setActiveTab,
      activeSlot
    };
  }
});


// export default defineComponent({
//   name: 'Tabs',
//   props: {
//     initialActive: {
//       type: Number,
//       default: 0
//     },
//     tabs: {
//       type: Array<{ name: string; slot: string }>,
//       default: () => []
//     }
//   },
//   emits: ['tab-changed'],
//   setup(props, { emit }) {
//     const activeTab = ref(props.initialActive);

//     const setActiveTab = (index: number, tabName: string) => {
//       activeTab.value = index;
//       emit('tab-changed', tabName);
//     };

//     return {
//       activeTab,
//       tabList: props.tabs,
//       setActiveTab,
//     };
//   }
// });

</script>

<style scoped>
.tabs{
  flex-wrap: nowrap;
}

.tab-content {
  margin-top: 10px;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
