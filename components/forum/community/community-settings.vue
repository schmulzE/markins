<script lang="ts" setup>
// Define the props that will be passed from parent
defineProps<{
  communityType: 'public' | 'restricted' | 'private';
  allowImages: boolean;
  allowLinks: boolean;
  requireApproval: boolean;
}>();

// Define the emits
const emit = defineEmits<{
  'update:communityType': [value: 'public' | 'restricted' | 'private'];
  'update:allowImages': [value: boolean];
  'update:allowLinks': [value: boolean];
  'update:requireApproval': [value: boolean];
  'update:isNSFW': [value: boolean];
}>();

// Handler functions
const setCommunityType = (value: 'public' | 'restricted' | 'private') => {
  emit('update:communityType', value);
};

const setAllowImages = (value: boolean) => {
  emit('update:allowImages', value);
};

const setAllowLinks = (value: boolean) => {
  emit('update:allowLinks', value);
};

const setRequireApproval = (value: boolean) => {
  emit('update:requireApproval', value);
};
</script>

<template>
  <div class="shadow bg-base-100 border p-4 border-gray-300 dark:border-base-100">    
    <div class="flex items-center font-medium mb-4">
      <i class="i-lucide-settings h-5 w-5 mr-2 text-[#297D4E]" />
      Community Settings
    </div>       
    <div class="space-y-4">
      <div class="space-y-2">
        <label class="label">Community Type</label>
        <select 
          class="select w-full block" 
          :value="communityType" 
          @change="setCommunityType(($event.target as HTMLSelectElement).value as 'public' | 'restricted' | 'private')"
        >                  
          <option value="public" class="font-medium">
            Public
          </option>
          <option value="restricted" class="font-medium">
            Restricted
          </option>
          <option value="private" class="font-medium">
            Private
          </option>                  
        </select>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <label>Allow image posts</label>
            <p class="text-sm text-gray-500">Members can upload images</p>
          </div>
          <input 
            type="checkbox" 
            :checked="allowImages" 
            class="toggle checked:bg-[#297D4E] checked:border-[#297D4E] checked:text-white" 
            @change="setAllowImages(($event.target as HTMLInputElement).checked)"
          >
        </div>

        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <label>Allow link posts</label>
            <p class="text-sm text-gray-500">Members can share external links</p>
          </div>
          <input 
            type="checkbox" 
            :checked="allowLinks" 
            class="toggle checked:bg-[#297D4E] checked:border-[#297D4E] checked:text-white" 
            @change="setAllowLinks(($event.target as HTMLInputElement).checked)"
          >
        </div>

        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <label>Require post approval</label>
            <p class="text-sm text-gray-500">All posts must be approved by moderators</p>
          </div>
          <input 
            type="checkbox" 
            class="toggle checked:bg-[#297D4E] checked:border-[#297D4E] checked:text-white" 
            :checked="requireApproval" 
            @change="setRequireApproval(($event.target as HTMLInputElement).checked)"
          >
        </div>
      </div>
    </div>
  </div>
</template>