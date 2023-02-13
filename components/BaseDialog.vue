<script lang="ts" setup>
const props = defineProps(["open", "title"]);
const emit = defineEmits(["close"]);
</script>

<template>
  <teleport to="body">
    <div
      class="fixed inset-0 bg-neutral-900 bg-opacity-75 overflow-y-auto h-full w-full"
      v-if="open"
      @click="$emit('close')"
    ></div>
    <dialog
      open
      v-if="open"
      class="modal m-0 p-0 fixed top-1/4 left-[10%] w-[80%] md:w-[40rem] md:left-[calc(50%-20rem)] z-100 overflow-hidden rounded-xl shadow-lg"
    >
      <header class="bg-primary text-light w-full p-4">
        <slot name="header">
          <h2 class="m-0">{{ title }}</h2>
        </slot>
      </header>
      <section class="p-4">
        <slot name="content"></slot>
      </section>
      <menu class="p-4 flex justify-end m-0">
        <slot name="actions"></slot>
      </menu>
    </dialog>
  </teleport>
</template>

<style scoped>
.modal {
  animation: modal 0.3s ease-in-out forwards;
}
@keyframes modal {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.75);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
