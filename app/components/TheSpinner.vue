<script lang="ts" setup></script>

<template>
  <div
    class="flex max-w-md h-20 text-center justify-center items-center backdrop-blur-sm backdrop-grayscale rounded-full p-4 m-auto"
  >
    <div
      class="block w-10 h-10 m-7 m-auto rounded-full border-4 border-accent border-x-primary border-y-secondary motion-safe:animate-spin"
    ></div>
    <p class="font-mulish text-light animate-pulse">
      Fetching&nbsp;
      <slot name="fetching" />
    </p>
  </div>
</template>
