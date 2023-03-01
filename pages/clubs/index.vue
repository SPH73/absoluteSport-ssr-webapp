<script setup>
const { error, data: list } = await useFetch("/api/clubs/sportList");

const sportList = ref([]);
let activity = {};
list.value.forEach((record, index) => {
  activity = {
    index: index + 1,
    id: record.id,
    sportName: record.fields.sportName,
    intro: record.fields.intro,
    yearRange: record.fields.yearRange,
    schoolList: record.fields.schoolList,
    sessions: record.fields.sessions,
  };
  sportList.value.push(activity);
});
console.log("sportList", sportList.value);
</script>

<template>
  <div class="my-8">
    <section class="max-w-7xl mx-auto">
      <div class="container py-4">
        <h2 class="font-play capitalize">School Clubs &amp; Wraparound Care</h2>
        <div>
          <p>
            Our clubs and wraparound care are designed with children at the
            fore. We aim to ensure that each child is supported as an individual
            whilst encouraging them to engage within a group. This provides them
            a safe environment to improve their self-confidence and social
            interaction alongside their teams and as individuals; skills that
            reach far beyond school and sports to other areas of their lives.
          </p>
          <p>
            The parents of children attending our clubs report that their
            children enjoy a greater sense of well-being and concentration due
            to the extra opportunities to spend time being active.
          </p>
          <p>
            Our clubs are suitable for children of all levels of ability/skill.
            Regular practice promotes muscle memory, which results in positive
            self-esteem from improving their game. In addition, children learn
            the art of effective strategising and planning through team sports
            and again, these skills will be highly beneficial for the children
            to establish early on.
          </p>
          <p>
            Research on the topic suggests that extra-curricular sports and
            activities play a positive role in significantly improving soft
            skills for those children who regularly attend, such as
            independence, teamwork, communication, problem-solving as well as
            fitting in with their peers.
          </p>
          <p>You'll find an itinerary of upcoming clubs we run below.</p>
        </div>
      </div>
    </section>
    <section
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full mx-auto pt-8 px-8"
    >
      <BaseBadge>
        <template #icon>
          <font-awesome-icon :icon="['fas', 'dumbbell']" />
        </template>
        <template #heading> Physical </template>
        <template #details>
          Encourages a healthy lifestyle outside of the school curriculum which
          is physically beneficial for primary children and lowers the risk of
          obesity
        </template>
      </BaseBadge>
      <BaseBadge>
        <template #icon>
          <font-awesome-icon :icon="['fas', 'brain']" />
        </template>
        <template #heading>Mental</template>
        <template #details>
          Physical activity and increased exercise can, to an extent, aid in
          lowering the chance of an individual suffering from depression and
          anxiety
        </template>
      </BaseBadge>
      <BaseBadge>
        <template #icon>
          <font-awesome-icon :icon="['fas', 'face-laugh-beam']" />
        </template>
        <template #heading>Emotional </template>
        <template #details>
          Develop skills in sports and attending extra-curricular enrichment
          activities helps build confidence and self-esteem
        </template>
      </BaseBadge>
      <BaseBadge>
        <template #icon>
          <font-awesome-icon :icon="['fas', 'people-group']" />
        </template>
        <template #heading>Social</template>
        <template #details>
          The opportunity to interact with new people, develop interpersonal
          skills and learn from each other; discourages anti-social behaviours
          and encourages trust and friendship
        </template>
      </BaseBadge>
    </section>
    <section class="max-w-7xl mx-auto">
      <div class="container py-4">
        <h3 class="font-play capitalize">
          How we aim to improve sporting performance in chldren attending our
          clubs
        </h3>
        <p>
          Many elite performers identify a background in multi-sports. Physical
          skills such as balance, running, catching, eye-hand coordination,
          jumping etc., are required for a multitude of sports and sports
          disciplines. Developing these vital skills in one sport will transfer
          into another. For example, a great footballer will also have the
          skills of a track and field athlete. This statement can be rephrased
          to make sense for most sports
        </p>

        <p class="tracking-wide">
          We offer parents an affordable avenue for their children to experience
          a variety of sports in a fun and safe environment that is not overly
          competitive but challenging enough to allow growth and where they can
          be assured their child is receiving quality instruction and support.
          If you would like to choose a club for your child this upcoming term
          you can book them
          <NuxtLink to="camps/booking" class="font-bold underline"
            >here</NuxtLink
          >.
        </p>
        <div class="py-4">
          <h3 class="font-play capitalize">Upcoming Clubs</h3>
          <p>
            We coach a variety of sports and activities at our clubs and
            wraparound care at Sidlesham Primary School, West Wittering Primary
            School and Portfield Academy. These are updated regularly to keep
            our clubs current and interesting.
          </p>
          <div>
            <button class="btn-primary my-4 w-full md:w-fit">
              <NuxtLink to="clubs/booking">book now</NuxtLink>
            </button>
          </div>
          <table
            v-for="activity in sportList"
            class="table-auto border-separate border-spacing-2 border border-secondary text-light w-full text-2xl rounded-md mb-4"
          >
            <tbody>
              <tr>
                <th
                  class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4 w-2/5"
                >
                  Activity
                </th>
                <td
                  class="bg-light text-dark border border-secondary p-4 w-3/5"
                >
                  {{ activity.sportName }}
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4"
                >
                  What you can expect
                </th>
                <td class="bg-light text-dark border border-secondary p-4">
                  <span v-for="item in activity.intro">{{ item }},&nbsp;</span>
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4 w-2/5"
                >
                  Schools
                </th>
                <td
                  class="bg-light text-dark border border-secondary p-4 w-3/5"
                >
                  <span v-for="item in activity.schoolList"
                    >{{ item }},&nbsp;</span
                  >
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4"
                >
                  Year groups
                </th>
                <td class="bg-light text-dark border border-secondary p-4">
                  <span v-for="item in activity.yearRange"
                    >{{ item }},&nbsp;</span
                  >
                </td>
              </tr>
              <tr>
                <th
                  class="uppercase p-4 bg-secondary text-left text-accent border border-secondary p-4"
                >
                  Sessions per booking
                </th>
                <td class="bg-light text-dark border border-secondary p-4">
                  {{ activity.sessions }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
