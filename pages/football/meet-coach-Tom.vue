<script lang="ts" setup>
useHead({
  title: "Football Academy",
  meta: [
    {
      name: "description",
      content:
        "We provide high quality football training with an F.A. qualified coach and talent scout.",
    },
    {
      property: "og:description",
      content:
        "High quality football training with an F.A. qualified coach and talent scout.",
    },
    {
      property: "og:type",
      content: "website",
    },
  ],
  link: [
    {
      rel: "canonical",
      href: "https://www.absolutesport.org/football",
    },
  ],
});
const formData = ref({});
const firstName = ref({ val: "", isValid: true });
const lastName = ref({ val: "", isValid: true });
const email = ref({ val: "", isValid: true });
const success = ref("");

const formIsValid = ref(true);

// methods
const validateForm = () => {
  formIsValid.value = true;

  // form details
  if (firstName.value.val === "") {
    firstName.value.isValid = false;
    formIsValid.value = false;
  }
  if (lastName.value.val === "") {
    lastName.value.isValid = false;
    formIsValid.value = false;
  }
  if (email.value.val === "" || !email.value.val.includes("@")) {
    email.value.isValid = false;
    formIsValid.value = false;
  }
};

async function subscribe() {
  validateForm();
  if (!formIsValid.value) {
    return;
  }

  formData.value = {
    firstName: firstName.value.val,
    lastName: lastName.value.val,
    email: email.value.val.toLowerCase(),
    tags: ["football"],
  };

  const result = await $fetch("/api/mailchimp", {
    method: "put",
    body: formData.value,
  });

  if (result) {
    success.value =
      "Thank you for subscribing to Football Academy updates and news!";
    firstName.value.val = "";
    lastName.value.val = "";
    email.value.val = "";
  }
}
</script>

<template>
  <div class="my-8">
    <section class="max-w-7xl mx-auto">
      <div class="container py-4">
        <h1 class="font-play capitalize">Football Academy at AbsoluteSport</h1>
        <p>
          Hello and welcome to our new Football Academy! We're super excited to
          introduce our star football coach, Tom. With Tom's wealth of
          experience and unique coaching style, we believe he will take our
          players to new heights. We look forward to working with him and
          achieving great success together.
        </p>
        <p>
          We thank you for your interest in our Football Academy and if you've
          not already done so, we would love to invite you to explore our
          website to learn more about what we offer here at AbsoluteSport.
          Before you do, please take a moment to read the message below from
          Tom, where he shares some insights into his career and mission as a
          football coach and highlights some key aspects of his vision for the
          Football academy.
        </p>
        <p>We hope to see you soon!</p>
        <p class="font-play">Ben - Founder &amp; CEO</p>
      </div>

      <div id="message-from-coach" class="container py-4">
        <h2 class="font-play">A message from your Football Academy Coach</h2>
        <p>
          My name is Coach Tom and I am a dedicated and experienced F.A
          qualified football coach and talent scout. I have been involved in the
          sport for many years and have a passion for helping young players
          develop their skills and reach their full potential.
        </p>
        <p>
          I have worked with players of all ages and skill levels, teaching them
          the fundamentals of the game and helping them hone their skills. I
          believe that football is much more than just a game - it's a tool for
          building self-confidence, teamwork, and sportsmanship. I strive to
          create a positive and encouraging environment that helps players
          develop not just their football skills, but also their character.
        </p>

        <p>
          I am proud of the players and teams I have had the privilege of
          working with, and I'm excited to continue helping players develop
          their skills and reach their full potential.
        </p>

        <p>
          Our Football coaching academy hopes to achieve several key goals for
          our players. First and foremost, we aim to develop strong and skilled
          players who can compete at a high level. To do this, we provide access
          to high-level coaching and training that helps players master the
          fundamentals of football and hone their skills. We also place an
          emphasis on building teamwork and sportsmanship, as these are
          essential qualities for success on the field.
        </p>

        <p>
          Another key goal of our academy is to foster a love of the game in our
          players. We strive to create a positive and engaging environment, by
          teaching them to love the game, we hope that they'll continue to play
          football and stay involved in the sport for years to come.
        </p>

        <p>
          We also understand the importance of preparation to play at a higher
          level of competition like school, local teams or even professional
          level. We work on individual player development and also helping the
          team play at a higher level. Our coaching staff and training program
          is designed to ensure that players have the necessary skills and
          knowledge to progress to the next level of play.
        </p>

        <p>
          We also aim to build a strong community within our academy. We believe
          that by fostering positive relationships among players, coaches, and
          parents, we can create a supportive culture that helps players succeed
          both on and off the field. We encourage the sense of belongingness and
          healthy competition among players.
        </p>

        <p>
          Overall, our Football academy is dedicated to providing players with a
          comprehensive and engaging football experience that helps them develop
          the skills and love for the game they need to excel. We strive to
          create an environment that promotes personal and athletic growth in
          all our players
        </p>
      </div>
    </section>
    <section id="subscriber" class="max-w-7xl mx-auto">
      <div class="container py-4">
        <p class="tracking-wide text-md lg:text-xl 2xl:text-2xl py-3 lg:py-8">
          Please consider subscribing to the Football Academy mailing list to be
          kept informed. No spam ever, just updates and info!
        </p>
        <form @submit.prevent="subscribe">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-4">
            <input type="text" v-model.trim.lazy="firstName.val" placeholder="First" class="p-3 rounded text-xl" />
            <input type="text" v-model.trim.lazy="lastName.val" placeholder="Last" class="p-3 rounded text-xl" />
            <input type="email" v-model.trim.lazy="email.val" placeholder="Email" class="p-3 rounded text-xl" />
            <button class="btn-subscribe">Subscribe</button>
          </div>
        </form>
        <p v-if="success" class="text-md font-inter-medium tracking-wide">
          {{ success }}
        </p>
        <p v-else class="text-sm font-inter-regular tracking-wide">
          By submitting your info you are giving us permission to store your
          data for the purpose of you relevant info you relevant info, updates
          and upcoming offers to your inbox. Your data will never be sold or
          given to a third party. You can request to unsubscribe at anytime by
          clicking the unsubscribe link in our emails.
        </p>
      </div>
    </section>
  </div>
</template>
