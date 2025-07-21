<script lang="ts" setup>
const emit = defineEmits(['update:communityDisplayName', 'update:communityDescription', 'update:communityCategory', 'update:communityName']);

interface Categories {
  id: string;
  name: string;
  icon: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props =defineProps<{
  communityCategory: string;
  communityDescription: string;
  communityDisplayName: string;
  isValidName: boolean;
  communityName: string;
  categories: Categories[];
}>();


const handleCommunityNameChange = (value: typeof props.communityDisplayName) => {
  emit('update:communityName', value);
};

const handleDisplayNameChange = (value: typeof props.communityDisplayName) => {
  emit('update:communityDisplayName', value);
};

const handleDescriptionChange = (value: typeof props.communityDescription) => {
  emit('update:communityDescription', value);
};

const handleCategoryChange = (value: typeof props.communityCategory) => {
  emit('update:communityCategory', value);
};
</script>

<template>
  <div class="shadow border bg-base-100 p-4 border-gray-300 dark:border-base-100">        
    <div class="flex items-center font-medium mb-4">
      <i class="i-lucide-info h-5 w-5 mr-2 text-[#297D4E]" />
      Basic Information
    </div>
    <div class="space-y-4">
      <div class="space-y-2">
        <label class="label" for="community-name">Community Name *</label>
        <label class="input block w-full relative" >
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">m/</span>
          <input
            id="community-name"
            placeholder="Quantum Physics"
            :value="communityName"
            class="pl-8"
            @input="handleCommunityNameChange(($event.target as HTMLInputElement).value)"
            >
        </label>
        <div class="flex items-center justify-between text-sm">
          <span :class="isValidName ? 'text-green-600' : 'text-red-500'">
            {{ communityName.length }}/21 characters
          </span>
          <span v-if="!isValidName && communityName" class="text-red-500">Only letters, numbers, and underscores allowed</span>
        </div>
      </div>

      <div class="space-y-2">
        <label for="display-name" class="label">Display Name *</label>
        <input
          id="display-name"
          class="input block w-full"
          placeholder="quantum-physics"
          :value="communityDisplayName"
          @input="handleDisplayNameChange(($event.target as HTMLInputElement).value.toLowerCase())"
        >
      </div>

      <div class="space-y-2">
        <label for="description" class="label">Description *</label>
        <textarea
          id="description"
          class="textarea block w-full"
          placeholder="A community for discussing quantum mechanics, quantum computing, and quantum technologies"
          :value="communityDescription"
          rows="3"
          @input="handleDescriptionChange(($event.target as HTMLTextAreaElement).value)"
          />
        <p class="text-sm text-gray-500">{{ communityDisplayName.length }}/500 characters</p>
      </div>

      <div class="space-y-2">
        <label for="category" class="label">Category *</label>
        <select 
        class="select w-full block" 
        :value="communityCategory" 
        @change="handleCategoryChange(($event.target as HTMLSelectElement).value)"
        >
          <option disabled selected>Select a category</option>                  
            <option v-for="cat in categories" :key="cat.id" :value="cat.id" class="flex items-center space-x-2">
              {{ cat.icon }}
              {{ cat.name }}
            </option>                 
        </select>
      </div>
    </div>
  </div>
</template>
