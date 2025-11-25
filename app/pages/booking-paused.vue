<!-- app/pages/booking-paused.vue -->
<script setup lang="ts">
const title = "Online bookings temporarily unavailable";

useHead({
  title,
  meta: [
    {
      name: "description",
      content:
        "Online bookings are temporarily paused. Please contact us via WhatsApp or email to make or amend a booking.",
    },
  ],
});
</script>

<template>
  <NuxtLayout>
    <section
      class="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center bg-dark"
    >
      <div class="max-w-xl">
        <h1 class="text-3xl md:text-4xl font-bold mb-4 text-white">
          {{ title }}
        </h1>

        <p class="mb-4 text-base md:text-lg text-white">
          Our online booking & messaging system is temporarily offline due to a
          technical limit with our database provider.
        </p>

        <p class="mb-6 text-sm md:text-base text-white">
          You can still make or amend bookings by contacting us directly.
          Existing bookings are not affected.
        </p>

        <div class="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <NuxtLink
            to="https://api.whatsapp.com/send?phone=447540309658"
            aria-label="Connect with us on whatsapp chat"
          >
            <font-awesome-icon
              :icon="['fab', 'whatsapp']"
              class="text-secondary h-12 w12"
            />
          </NuxtLink>

          <NuxtLink
            to="mailto:absolutesport.as@gmail.com"
            class="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-dark font-semibold text-sm md:text-base hover:opacity-90 transition"
          >
            Email us: absolutesport.as@gmail.com
          </NuxtLink>
        </div>

        <p class="text-xs text-gray-300">
          We expect normal online booking to resume once our provider resolves
          their technical issues. Thank you for your patience.
        </p>
      </div>
    </section>
  </NuxtLayout>
</template>
