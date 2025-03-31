<script lang="ts" setup>
import useModalStore from '../../stores/useModalStore';

const store = useModalStore();
const emit = defineEmits(["submit-username"]);
const props = defineProps<{ description: string }>();

// Create a local ref to modify the description
const localUsername = ref(props.description);

const submitUsernameHandler = () => {
  emit('submit-username', localUsername.value);
  store.closeModal();
}

const resetForm = () => {
  store.closeModal();
}
</script>

<template>
  <form @submit.prevent="submitUsernameHandler">
    <div class="flex justify-between">
      <h3 class="text-lg font-semibold mb-4">Display name</h3>
      <button class="text-base-neutral btn btn-sm btn-circle" @click.prevent="store.closeModal">
        <i class="ri i-ri-close-line text-2xl" />
      </button>
    </div>
    <input v-model="localUsername" type="text" class="input input-ghost bg-base-300 w-full rounded-full" placeholder="Display name">
    <div class="flex gap-x-2 mt-8 text-sm justify-end">
      <button type="button" class="bg-base-300 p-2 rounded-full capitalize cursor-pointer" @click="resetForm">cancel</button>
      <button type="submit" class="bg-blue-600 p-2 rounded-full capitalize text-white cursor-pointer">save</button>
    </div>
  </form>
</template>
