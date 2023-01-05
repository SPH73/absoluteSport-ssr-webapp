<script setup>
const { error, data: content } = await useFetch("/api/parties/details");
const partyDetails = ref([]);
let party = {};
content.value.forEach((record, index) => {
  party = {
    index: index + 1,
    id: record.id,
    slug: record.fields.slug,
    pageTitle: record.fields.pageTitle,
    partyName: record.fields.partyName,
    summaryP1: record.fields.summaryP1,
    summaryP2: record.fields.summaryP2,
    summaryP3: record.fields.summaryP3,
    image: [
      {
        id: record.fields.thumbnail[0].id,
        filename: record.fields.thumbnail[0].filename,
        thumbnail: record.fields.thumbnail[0].thumbnails.large.url,
      },
    ],
  };
  partyDetails.value.push(party);

  const activeParty = ref(null);
  const activateParty = (partySlug) => {
    activeParty.value = partyDetails.value.find((party) => party.slug === partySlug);
  };
});
</script>
<template>
  <main class="pb-20">
    <section>
      <div>
        <div class="max-w-7xl mx-auto">
          <div class="container">
            <h2>AbsoluteSport Themed Kids Parties</h2>
            <div>
              <p>
                At AbsoluteSport we offer 3 different Themed Birthday Parties. Our coaches
                all ensure that the children attending the party will have an absolute
                blast of a time. We aim to keep all parties stress free by tailoring the
                entire process around you and your child's needs. If you having something
                more specific in mind than what you see listed here on the site, please do
                contact us and we will be more than happy to help assist in creating the
                ideal party for your child.
              </p>
            </div>
            <h3>Click on a party from the options below to read a short summary</h3>
          </div>
        </div>

        <div v-if="partyDetails">
          <PartyGrid :partyDetails="partyDetails" />
        </div>
        <div v-else>
          <TheSpinner />
        </div>
        <div class="max-w-7xl mx-auto">
          <div class="container">
            <h3>Why Choose AbsoluteSport As Your Party Entertainer?</h3>
            <p>
              We are very proud of our stellar 5 star reviews as they do say a lot about
              us (we've only received 5 star reviews!), but for some of the other
              important points about our parties, please read on...
            </p>
            <p>
              Our children's parties are perfect for 4 – 14-year-olds and a wide range of
              occasions. Each party is unique to you and your child.
            </p>
            <p>
              We aim to make our children's parties a stress-free and enjoyable
              experience, so you can relax and enjoy watching the children having the time
              of their lives!
            </p>
            <p>
              We supply everything needed for an unforgettable kid\'s party - all
              equipment and game props as well as prizes for the children.
            </p>
            <ul class="bullets list-inside">
              <li class="thumb">
                &nbsp; All staff hold a valid/current DBS, first aid and safeguarding
                certification.
              </li>
              <li class="thumb">
                &nbsp; We deliver our parties at your party venue or your home.
              </li>
              <li class="thumb">
                &nbsp; Our coaches work in schools throughout West Sussex and Hampshire
                and have extensive experience in delivering fun and engaging sessions to
                children of all ages and abilities.
              </li>
              <li class="thumb">
                &nbsp; Children will participate in fun challenges and skill competitions.
              </li>
              <li class="thumb">
                &nbsp; Prizes for game winners but in the end every child is a winner!
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped></style>
