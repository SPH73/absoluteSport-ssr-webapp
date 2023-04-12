<script lang="ts" setup>
useHead({
  title: `Payment Success`,
  meta: [
    {
      name: "robots",
      content: "noindex",
    },
  ],
  link: [
    {
      rel: "canonical",
      href: "https://www.absolutesport.org/payment/success",
    },
  ],
});
</script>

<template>
  <div class="">
    <h1>Thank you for your payment!</h1>
    <p>Your instant payment was successful and your booking is now confirmed.</p>
    <p>GoCardless will email you confirmation of your payment.</p>
    <p>
      The payment will appear on your bank statement as GoCardless with the payment
      reference included in their email.
    </p>
  </div>
</template>
