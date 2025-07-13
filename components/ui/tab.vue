<template>
  <div class="p-0 border border-gray-300">
    <div class="tabs tabs-box gap-2">
      <!-- eslint-disable-next-line vue/no-unused-vars -->
      <template v-for="(tab, _) in tabs" :key="tab.id">
      <label class="tab flex items-center justify-center gap-2 cursor-pointer" :class="tabButtonClass">
        <input
          type="radio"
          class="hidden"
          :name="radioGroupName"
          :checked="activeTab === tab.id"
          @change="() => setActiveTab(tab.id)"
        >
        <i :class="`w-4 h-4 ${tab.icon}`" />
        <span>{{ tab.label }}</span>
      </label>

      <div 
        v-show="activeTab === tab.id"
        class="tab-content bg-base-100 border-base-300"
        :class="tabContentClass"
      >
        <slot 
          :name="tab.id" 
          :tab="tab"
          :shared-data="sharedData"
          :update-shared="updateSharedData"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  tabs: {
    type: Array,
    required: true
  },
  defaultTab: {
    type: String,
    default: null
  },
  radioGroupName: {
    type: String,
    default: 'generic_tabs'
  },
  sharedData: {
    type: Object,
    default: () => ({})
  },
  tabButtonClass: {
    type: String,
    default: 'px-6 md:px-16'
  },
  tabContentClass: {
    type: String,
    default: 'p-6'
  }
})

const emit = defineEmits(['tab-change', 'update:sharedData']);

const activeTab = ref(props.defaultTab || props.tabs[0]?.id);

const setActiveTab = (tabId) => {
  activeTab.value = tabId
  emit('tab-change', tabId)
}

const updateSharedData = (key, value) => {
  const newData = { ...props.sharedData, [key]: value }
  emit('update:sharedData', newData)
}
</script>