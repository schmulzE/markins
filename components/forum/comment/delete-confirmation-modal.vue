<script lang="ts" setup>
import useModalStore from '~/stores/useModalStore';
const store = useModalStore();
const props = defineProps({
  loading: Boolean
});
const emit = defineEmits(["onDeleteComment"])

const clickHandler = () => {
  emit("onDeleteComment")
}

const delay = ref(props.loading)

watch(() => props.loading, (value) => {
  delay.value = value
})

</script>

<template>
  <div class="bg-base-100 rounded-lg">
    <h3 class="font-semibold text-lg">Delete comment?</h3>
    <p class="mt-6 text-sm">Deleting a comment cannot be undone. Are you sure you want to permanently delete it?</p>
    <div class="space-x-4 ml-auto mt-4 flex justify-end">
      <button class="btn btn-ghost btn-md rounded-sm" @click.prevent="store.closeModal">Cancel</button>
      <button class="btn btn-error btn-md text-white rounded-sm" @click.stop="clickHandler">
        <span v-if="loading" class="loading loading-spinner" />
        Delete
      </button>
    </div>
  </div>
</template>