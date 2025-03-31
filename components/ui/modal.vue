<script setup lang="ts">
import useModalStore from '../../stores/useModalStore';
const store = useModalStore();
</script>

<template>
  <client-only>
    <Teleport to="body">
      <Transition>
        <div 
        v-if="store.modalState?.component"  
        class="overlay" 
        aria-modal="true"
        role="dialog"
        tabindex="-1"
        :class="store.modalState?.props!['overlayClass']"
        @click.self="store.closeModal"
        >
          <div 
          :class="store.modalState?.props!['classes']" 
          class="modals z-[1000] rounded-lg shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] fixed max-h-6xl max-w-xl bg-base-100"
          >
            <component
              :is="store.modalState?.component"
              v-bind="store.modalState?.props" 
              v-on="store.modalState?.events"
            />
          </div>
        </div>
      </Transition>
    </Teleport>
  </client-only>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* background-color: rgba(0, 0, 0, .7); */
  z-index: 999;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition: 0.25s ease all;
}

</style>

