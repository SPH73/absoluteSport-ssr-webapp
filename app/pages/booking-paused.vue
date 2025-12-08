<!-- app/pages/booking-paused.vue -->
<script setup lang="ts">
const route = useRoute();
const context = (route.query.context as string) || "booking";

// Context-aware messaging
const contextConfig = {
  booking: {
    title: "Online bookings temporarily unavailable",
    description:
      "Online bookings are temporarily paused. Please contact us via WhatsApp or email to make or amend a booking.",
    systemType: "booking & messaging system",
    actionText: "make or amend bookings",
    affectedText: "Existing bookings are not affected.",
  },
  contact: {
    title: "Online contact form temporarily unavailable",
    description:
      "Our online contact form is temporarily paused. Please contact us via WhatsApp or email.",
    systemType: "contact form",
    actionText: "get in touch",
    affectedText: "We look forward to hearing from you.",
  },
  quote: {
    title: "Online party enquiries temporarily unavailable",
    description:
      "Our online party enquiry form is temporarily paused. Please contact us via WhatsApp or email to request a quote.",
    systemType: "party enquiry system",
    actionText: "request a party quote",
    affectedText: "Existing bookings are not affected.",
  },
  enquiry: {
    title: "Online enquiries temporarily unavailable",
    description:
      "Our online enquiry forms are temporarily paused. Please contact us via WhatsApp or email.",
    systemType: "enquiry system",
    actionText: "submit your enquiry",
    affectedText: "We appreciate your patience.",
  },
};

const config =
  contextConfig[context as keyof typeof contextConfig] || contextConfig.booking;

useHead({
  title: config.title,
  meta: [
    {
      name: "description",
      content: config.description,
    },
  ],
});
</script>

<template>
  <section
    class="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center bg-dark"
  >
    <div class="max-w-xl">
      <h1 class="text-3xl md:text-4xl font-bold mb-4 text-white">
        {{ config.title }}
      </h1>

      <p class="mb-4 text-base md:text-lg text-white">
        {{ config.description }}
      </p>

      <p class="mb-6 text-sm md:text-base text-white">
        You can still {{ config.actionText }} by contacting us directly.
        {{ config.affectedText }}
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
</template>
