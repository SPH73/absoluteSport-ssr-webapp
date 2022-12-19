<script lang="ts" setup></script>

<template>
  <div class="tracking-wider">
    <h2 class="text-accent font-play">
      <slot name="title" />
    </h2>
    <h3 class="text-accent font-play">
      <slot name="sub-1" />
    </h3>
    <p class="font-mulish">
      <slot name="para-1" />
    </p>
    <h3 class="text-accent font-play">
      <slot name="sub-2" />
    </h3>
    <p class="font-mulish">
      <slot name="para-2" />
    </p>
    <p class="font-mulish">
      <slot name="para-3" />
    </p>
  </div>
</template>
