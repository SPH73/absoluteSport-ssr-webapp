<script setup lang="ts">
const props = defineProps<{
  src: string; // Path to your image in Cloudinary
  width?: number | string;
  height?: number | string;
  alt?: string;
  className?: string; // Optional CSS classes
  quality?: number | string; // Cloudinary quality, default auto
  format?: string; // Cloudinary format, default auto
  loading?: "lazy" | "eager";
}>();

const config = useRuntimeConfig();

// Default values
const width = props.width ?? "auto";
const height = props.height ?? "auto";
const quality = props.quality ?? "auto";
const format = props.format ?? "auto";
const loading = props.loading ?? "lazy";

// Construct the Cloudinary URL
const cloudinaryBase = `https://res.cloudinary.com/${config.public.cloudName}/image/upload/`;
const transformations = `q_${quality},f_${format}${
  width !== "auto" ? `,w_${width}` : ""
}${height !== "auto" ? `,h_${height}` : ""}/`;
const cloudinaryUrl = `${cloudinaryBase}${transformations}${props.src}`;
</script>
<template>
  <img
    :src="cloudinaryUrl"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="loading"
    :class="className"
    v-bind="$attrs"
  />
</template>
