<script setup lang="ts">
const currentSlide = ref<number>(1);
const getSlideCount = ref<number | null>(null);
const autoPlayEnabled = ref<boolean>(true);
const changeDelay = ref<number>(1000);

// slide navigation
// next slide
const nextSlide = () => {
  if (currentSlide.value === getSlideCount.value) {
    currentSlide.value = 1;
    return;
  }
  currentSlide.value += 1;
};

// prev slide
const prevSlide = () => {
  if (currentSlide.value === 1) {
    currentSlide.value = getSlideCount.value;
    return;
  }
  currentSlide.value -= 1;
};

// autoplay
const autoPlay = () => {
  setInterval(() => {
    nextSlide();
  }, changeDelay.value);
};

if (autoPlayEnabled.value) {
  autoPlay();
}

onMounted(() => {
  getSlideCount.value = document.querySelectorAll(".slide").length;
});
</script>

<template>
  <div id="carousel">
    <slot name="slide" :currentSlide="currentSlide" />
    <!-- navigation -->
    <div class="z-50 w-full h-full flex space-between">
      <div @click="prevSlide" class="flex grow z-[100]">
        <font-awesome-icon
          class="h-14 w-14 text-3xl text-primary cursor-pointer"
          :icon="['fas', 'angle-left']"
        />
      </div>
      <div @click="nextSlide" class="flex z-[100] justify-end">
        <font-awesome-icon
          class="h-14 w-14 text-3xl text-primary cursor-pointer"
          :icon="['fas', 'angle-right']"
        />
      </div>
    </div>
  </div>
</template>
