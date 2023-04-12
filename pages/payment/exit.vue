<script lang="ts" setup>
const route = useRoute();
const paymentRef = route.query.paymentRef;
const amount = route.query.amount;
</script>

<template>
  <div>
    <h1>Your payment couldn't be taken</h1>
    <p>
      Your instant payment was not successful but don't worry, you can still pay by bank
      transfer using the details below:
    </p>
    <p>Account Name: ABSOLUTESPORT</p>
    <p>Account Number: 36771585</p>
    <p>Sort Code: 09-01-29</p>
    <p>Amount to pay: £{{ amount }}</p>
    <p>Beneficiary reference: {{ paymentRef }}</p>
    <p>
      Please don't forget to send us your proof of payment so that we can update your
      booking status to confirmed.
    </p>
  </div>
</template>
