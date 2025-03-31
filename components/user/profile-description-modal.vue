<script lang="ts" setup>
import useModalStore from '../../stores/useModalStore';

const store = useModalStore();
const emit = defineEmits(["submit-description"]);
const props = defineProps<{ description: string }>();

// Create a local ref to modify the description
const localDescription = ref(props.description);

const submitUserDescription = () => {
  emit('submit-description', localDescription.value);
  store.closeModal();
};

const resetForm = () => {
  store.closeModal();
}
</script>

<template>
  <form @submit.prevent="submitUserDescription">
    <div class="flex justify-between">
      <h3 class="text-lg font-semibold mb-4">About description</h3>
      <button class="text-base-neutral btn btn-sm btn-circle" @click.prevent="store.closeModal">
        <i class="ri i-ri-close-line text-2xl" />
      </button>
    </div>
    <textarea 
    v-model="localDescription" 
    type="text" 
    class="textarea resize-none p-2 textarea-ghost textarea-lg bg-base-300 w-full" 
    placeholder="About" 
    />
    <div class="flex gap-x-2 mt-8 text-sm justify-end">
      <button type="button" class="bg-base-300 p-2 rounded-full capitalize cursor-pointer" @click="resetForm" >cancel</button>
      <button type="submit" class="bg-blue-600 p-2 rounded-full capitalize cursor-pointer text-white">save</button>
    </div>
  </form>
</template>