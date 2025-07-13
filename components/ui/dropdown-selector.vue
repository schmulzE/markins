<template>
  <div class="card bg-base-100 p-4 border border-gray-300 dark:border-base-300 space-y-4">
    <div>
      <div class="text-lg">{{ title }}</div>
    </div>
    <div>
      <select 
        :value="modelValue" 
        class="select w-full"
        @input="$emit('update:modelValue', $event.target.value)"
      >
        <option disabled value="">{{ placeholder }}</option>
        <option
          v-for="item in items"
          :key="item[keyField]"
          :value="item[valueField]"
          class="flex items-center text-gray-5000 space-x-2 p-4"
        >
          <span v-if="iconField && item[iconField]">{{ item[iconField] }}</span>
          {{ item[labelField] }}
          <span v-if="metaField && item[metaField]">({{ formatMeta(item[metaField]) }})</span>
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Choose an option'
  },
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  items: {
    type: Array,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  keyField: {
    type: String,
    default: 'id'
  },
  valueField: {
    type: String,
    default: 'id'
  },
  labelField: {
    type: String,
    default: 'name'
  },
  iconField: {
    type: String,
    default: null
  },
  metaField: {
    type: String,
    default: null
  },
  formatMeta: {
    type: Function,
    default: (value) => value
  }
})

defineEmits(['update:modelValue'])
</script>