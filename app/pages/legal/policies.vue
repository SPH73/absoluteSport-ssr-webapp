<script setup>
const { guardedFetch } = useBookingApi();

const policies = await guardedFetch("/api/legal/policies");
const policyList = ref([]);

// Guard against undefined result from 429/503 redirect
if (policies && Array.isArray(policies)) {
  let doc = {};
  policies.forEach((record, index) => {
    doc = {
      index: index + 1,
      id: record.id,
      policyName: record.policyName,
      policyDate: record.policyDate,
      link: record.link,
      status: record.status,
    };
    policyList.value.push(doc);
  });
}
</script>

<template>
  <div class="container py-4">
    <h1 class="font-play capitalize">Policies and Procedures</h1>
    <p>
      The nature of caring for children requires us to have strict policies and
      procedures in place that ensure the children are protected at all times
      and cover pupil welfare, safeguarding, recruitment, behaviour, and
      discrimination amongst many others.
    </p>
    <p>
      These policies and procedures are vital to protect both staff and pupils.
    </p>
    <div v-for="doc in policyList" class="text-2xl text-light">
      <div>
        <NuxtLink :to="doc.link" target="_blank" rel="noopener">
          {{ doc.policyName }}
          <font-awesome-icon
            :icon="['fas', 'arrow-up-right-from-square']"
            class="w-5 h-5"
          >
          </font-awesome-icon
        ></NuxtLink>
      </div>
    </div>
  </div>
</template>
