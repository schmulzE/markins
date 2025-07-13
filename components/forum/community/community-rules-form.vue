<script lang="ts" setup>
// Define the props that will be passed from parent
const props = defineProps<{
  rules: string[];
}>();

// Define the emits for v-model
const emit = defineEmits<{
  'update:rules': [value: string[]];
}>();

// Handler functions
const updateRule = (index: number, value: string) => {
  const newRules = [...props.rules];
  newRules[index] = value;
  emit('update:rules', newRules);
};

const removeRule = (index: number) => {
  const newRules = props.rules.filter((_, i) => i !== index);
  emit('update:rules', newRules);
};

const addRule = () => {
  const newRules = [...props.rules, ''];
  emit('update:rules', newRules);
};
</script>

<template>
  <div class="shadow bg-base-100 border p-4 border-gray-300 dark:border-base-100"> 
    <div class="flex items-center font-medium mb-4">
      <i class="i-lucide-shield h-5 w-5 mr-2 text-[#297D4E]" />
      Community Rules
    </div>     
    <div class="space-y-4">
      <p class="text-sm text-gray-500">Set clear guidelines for your community members</p>

      <div class="space-y-3">
        <div v-for="(rule, index) in rules" :key="index" class="flex items-center space-x-2">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-[#297D4E]/10 text-[#297D4E] text-sm font-medium flex items-center justify-center">
            {{ index + 1 }}
          </div>
          <input
            placeholder="Enter a community rule"
            :value="rule"
            class="flex-1 input"
            @input="updateRule(index, ($event.target as HTMLInputElement).value)"
          >
          <button 
            v-if="rules.length > 1" 
            class="btn btn-ghost btn-sm"
            @click="removeRule(index)"
          >
            <i class="i-lucide-x h-4 w-4" />
          </button>
        </div>
      </div>

      <button 
        class="w-full btn btn-outline"
        @click="addRule" 
      >
        <i class="i-lucide-plus h-4 w-4 mr-2" />
        Add Rule
      </button>
    </div>
  </div>
</template>