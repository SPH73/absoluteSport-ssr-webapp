<script setup lang="ts">
const props = defineProps(["faqs", "selected-tag"]);
defineEmits(["select-tag"]);
const { tags } = useTags(props.faqs);
</script>
<template>
  <div
    v-for="tag in tags"
    :key="tag"
    class="inline-block p-4 align-middle text-center"
  >
    <h4 class="cursor-pointer" @click="$emit('select-tag', tag, $event)">
      #{{ tag }}&nbsp;
    </h4>
  </div>
</template>
