<script setup>
const { data: policies, error } = await useFetch("/api/legal/policies");
const policyList = ref([]);
let doc = {};
policies.value.forEach((record, index) => {
  doc = {
    index: index + 1,
    id: record.id,
    policyName: record.fields.policyName,
    policyDate: record.fields.policyDate,
    link: record.fields.link,
    status: record.fields.status,
  };
  policyList.value.push(doc);
});
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
