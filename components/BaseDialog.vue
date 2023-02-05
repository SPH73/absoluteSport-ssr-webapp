<script lang="ts" setup>
const props = defineProps(["open", "title"]);
const emit = defineEmits(["close"]);
</script>

<template>
  <teleport to="body">
    <div class="backdrop" v-if="open" @click="$emit('close')"></div>
    <dialog open v-if="open">
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
@keyframes dialog {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.8);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* check .modal enter active ***** */
.modal-enter-active {
  animation: dialog 0.8s ease-in;
}

/* check .modal leave active ***** */
.modal-leave-active {
  animation: dialog 0.8s ease-out reverse;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 10;
}

dialog {
  position: fixed;
  top: 20vh;
  left: 10%;
  width: 80%;
  z-index: 100;
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 0;
  margin: 0;
  overflow: hidden;
  animation: modal 0.3s ease-in-out forwards;
}

@media (min-width: 768px) {
  dialog {
    left: calc(50% - 20rem);
    width: 40rem;
  }
}

/* @keyframes modal {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
} */
</style>
