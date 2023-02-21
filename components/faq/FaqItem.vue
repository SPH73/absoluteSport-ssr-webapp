<script lang="ts" setup>
defineProps(["faq"]);

const showAnswer = ref(false);

const toggleAnswer = () => {
  showAnswer.value = !showAnswer.value;
};
</script>

<template>
  <div class="faq">
    <h4 @click="toggleAnswer" class="text-accent cursor-pointer my-4">
      {{ faq.question }} &#9662;
    </h4>
    <div>
      <transition name="answer">
        <p class="text-light" v-if="showAnswer">{{ faq.answer }}</p>
      </transition>
      <span class="text-accent text-lg" v-for="tag in faq.tags" :key="tag">
        #{{ tag }}</span
      >
    </div>
  </div>
</template>
<style>
@keyframes slide-scale {
  0% {
    opacity: 0;
    transform: translateY(-2rem) scale(0.8);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.answer-enter-active {
  animation: slide-scale 0.5s ease-in-out;
}

.answer-leave-active {
  animation: slide-scale 0.5s ease-in-out reverse;
}
</style>
