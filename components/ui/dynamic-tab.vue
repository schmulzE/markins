<script setup lang="ts">
import type { Component } from 'vue'

interface Tab {
  id: string | number
  title: string
  // Can be either string content or a Vue component
  content?: string | Component
  // For dynamic component props
  componentProps?: Record<string, unknown>
  disabled?: boolean
}

const props = defineProps<{
  tabs: Tab[]
  initialTab?: string | number
}>()

const activeTab = ref<string | number>(props.initialTab || props.tabs[0]?.id)

const setActiveTab = (tabId: string | number) => {
  const tab = props.tabs.find(t => t.id === tabId)
  if (tab && !tab.disabled) {
    activeTab.value = tabId
  }
}
</script>

<template>
  <div class="bg-base-100 my-4 w-full">
    <div class="overflow-x-auto md:overflow-x-hidden hide-scrollbar">
      <div class="tabs w-full tabs-bordered mx-2 py-1 flex whitespace-nowrap">
        <a
        v-for="tab in tabs"
        :key="tab.id"
        class="tab capitalize hover:underline flex-shrink-0"
        :class="{'text-base-content text-sm bg-base-300 rounded-full' : activeTab === tab.id }"
        @click="setActiveTab(tab.id)"
        >
          {{ tab.title }}
        </a>
      </div>
    </div>
    
    <div class="mt-2">
      <template v-for="tab in tabs" :key="tab.id">
        <div v-if="activeTab === tab.id">
          <!-- Slot content takes precedence -->
          <slot :name="`tab-${tab.id}`">
            <!-- If no slot, check for component content -->
            <component
            :is="tab.content"
              v-if="typeof tab.content !== 'string'"
              v-bind="tab.componentProps || {}"
            />
            
            <!-- Fall back to string content -->
            <template v-else>
              {{ tab.content }}
            </template>
          </slot>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>

</style>