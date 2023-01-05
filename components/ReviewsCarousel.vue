<script lang="ts" setup>
defineProps(["reviews"]);
</script>

<template>
  <div class="relative">
    <BaseCarousel>
      <template #slide="{ currentSlide }">
        <BaseSlide v-for="(review, index) in reviews" :key="index">
          <template #review v-show="currentSlide === index + 1">
            <ReviewItem :review="review" />
          </template>
        </BaseSlide>
      </template>
    </BaseCarousel>
  </div>
</template>
