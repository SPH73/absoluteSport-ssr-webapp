<script setup>
useHead({
  title:
    "School Clubs, Holiday Camps & Themed Parties in West Sussex and Hampshire",
  meta: [
    {
      name: "description",
      content:
        "For first-class sports coaching, camps & parties, our highly qualified & experienced team will tailor fun, engaging programmes & activities to your exact needs.",
    },
    {
      property: "og:description",
      content:
        "Get your kids active with our fun and engaging, themed Activity Camps to children aged 5-14 that will keep your kids laughing this school holiday!",
    },
    {
      property: "og:type",
      content: "website",
    },
    // TODO
    // {
    //   property: "og:image",
    //   content: "url...",
    // },
    // {
    //   property: "og:image:width",
    //   content: "1200",
    // },
    // {
    //   property: "og:image:height",
    //   content: "630",
    // },
    // {
    //   name: "twitter:card",
    //   content: `summary_large_image`,
    // },
  ],
  link: [
    {
      rel: "canonical",
      href: "https://www.absolutesport.org/",
    },
    // {
    //   rel: "preload",
    //   href: `https://res.cloudinary.com/asimages/image/upload/v1679601944/webapp/hero_portrait_1920.webp`,
    //   as: "image",
    //   media: "(max-width: 1279px)",
    // },
    // {
    //   rel: "preload",
    //   href: `https://res.cloudinary.com/asimages/image/upload/v1679601944/webapp/hero_landscape_1920.webp`,
    //   as: "image",
    //   media: "(min-width: 1280px)",
    // },
  ],
});
const { error, pending, data: reviews } = await useFetch("/api/reviews");
const reviewList = ref([]);
let review = {};
// console.log("reviewList", reviews.value);
reviews.value.forEach((record, index) => {
  if (record.fields.featured) {
    review = {
      index: index + 1,
      id: record.id,
      name: record.fields.reviewerName,
      comment: record.fields.reviewerComment,
      rating: record.fields.rating,
      created: record.fields.created,
    };
    reviewList.value.push(review);
  }
});
</script>

<template>
  <div>
    <NuxtImg
      provider="cloudinary"
      src="/webapp/hero_landscape_1920.webp"
      preload
      class="hidden"
    />
    <NuxtImg
      provider="cloudinary"
      src="/webapp/hero_portrait_1920.webp"
      preload
      class="hidden"
    />
    <section
      id="hero"
      class="flex flex-col bg-blend-overlay lg:bg-fixed bg-neutral-600 bg-[url('https://res.cloudinary.com/asimages/image/upload/w_768/webapp/hero_portrait_1920.webp')] md:bg-[url('https://res.cloudinary.com/asimages/image/upload/w_1920/webapp/hero_landscape_1920.webp')] bg-center bg-no-repeat bg-cover w-full h-[calc(92vh-91px)] min-h-[667px] md:h-[70vh] pt-10 pb-4 relative"
    >
      <div class="max-w-7xl mx-auto">
        <div class="container font-play py-4 text-center md:text-left">
          <div class="mb-12 static">
            <h1>Fun, Laughter, Games and Exercise with AbsoluteSport</h1>
            <h2>Kids learn while having fun at our clubs, camps and parties</h2>
          </div>
          <!-- <div
            id="carousel"
            class="absolute inset-x-0 bottom-0 backdrop-grayscale backdrop-blur-sm h-fit flex justify-center items-center text-center max-w-[428px] m-auto"
          >
            <Swiper
              class="h-fit"
              id="reviews"
              :modules="[
                SwiperAutoplay,
                SwiperEffectCreative,
                SwiperNavigation,
                SwiperManipulation,
                SwiperAutoplay,
              ]"
              :slides-per-view="1"
              :loop="true"
              :effect="'creative'"
              :navigation="true"
              :creative-effect="{
                prev: {
                  shadow: false,
                  translate: ['-100%', 0, -1],
                },
                next: {
                  translate: ['100%', 0, 0],
                },
              }"
              :autoplay="{
                delay: 5000,
                disableOnInteraction: true,
              }"
            >
              <SwiperSlide
                v-for="review in reviewList"
                :key="review.index"
                class="min-h-[250px] h-fit px-20 py-8 flex justify-center items-center w-[80%] max-w-[428px]"
                ><ReviewItem :review="review" />
              </SwiperSlide>
            </Swiper>
          </div> -->
        </div>
      </div>
    </section>
    <section>
      <!-- Benefits -->
      <section
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full mx-auto pt-8 px-8 mt-10"
      >
        <BaseBadge>
          <template #icon>
            <font-awesome-icon :icon="['fas', 'award']" />
          </template>
          <template #heading>
            Qualified, insured, first aid trained & DBS checked staff
          </template>
          <template #details>
            We ensure that all staff are appropriately qualified and
            experienced. Each member holds an enhanced DBS check and valid first
            aid certificate.
          </template>
        </BaseBadge>
        <BaseBadge>
          <template #icon>
            <font-awesome-icon :icon="['fas', 'hand-holding-heart']" />
          </template>
          <template #heading> Warm and friendly team of coaches </template>
          <template #details>
            At the heart of the selection process when recruiting our coaches is
            the qualities required for working with children. Our enthusiastic
            team demonstrate patience and a postive attitude as well as the
            dedication towards helping the children get the most out of each
            session we deliver at our clubs, camps and parties.
          </template>
        </BaseBadge>
        <BaseBadge>
          <template #icon>
            <font-awesome-icon :icon="['fas', 'ranking-star']" />
          </template>
          <template #heading>
            Top-of-range equipment for a variety of sports and activities
          </template>
          <template #details>
            We ensure that children are exposed to a variety of sports so that
            they have a fair opportunity of finding a sport they are both
            interested in and excel at, often continuing on to participate at a
            higher level.
          </template>
        </BaseBadge>
        <BaseBadge>
          <template #icon>
            <font-awesome-icon :icon="['fas', 'check']" />
          </template>
          <template #heading> First-class programme delivery </template>
          <template #details>
            Our sports-based programmes are designed to meet the national
            curriculum. They support growth for the individual and group by
            providing fun but challenging sessions that encourage social
            interaction and team camaraderie.
          </template>
        </BaseBadge>
      </section>
    </section>
    <section>
      <!-- Services -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mx-auto p-8">
        <BaseCard>
          <BaseContent>
            <template #title>School Clubs &amp; Wraparound Care</template>
            <template #sub-1>Available to book during school term's</template>
            <template #para-1
              >Our Morning Clubs at West Wittering Primary School, Sidlesham
              Primary School and Portfield Academy are something that all the
              children love. We include a variety of fun sports like fencing,
              archery and table tennis.</template
            >
            <template #para-2
              >After School Clubs give the children the perfect opportunity to
              learn a new sport or enhance their current skills in their
              favourite sports. We do a wide range of clubs with KS1 and KS2
              children.</template
            >
          </BaseContent>
        </BaseCard>
        <BaseCard>
          <BaseContent>
            <template #title>Sports & Activity Camps</template>
            <template #sub-1>Available to book each school holiday</template>
            <template #para-1
              >Our holiday clubs provide children with the opportunity to make
              new friendships outside of their school or classrooms and remain
              mentally and physically active while having a great time
              together.</template
            >
            <template #para-2
              >Working parents have the peace of mind that their children are
              engaging in social and sports activities that boost their
              confidence and skills in a safe and fun environment. Camps run
              from 09:00 - 17:00 each day.
            </template>
            <template #para-3
              >Come and find out how much fun we have during the school
              holidays!</template
            >
          </BaseContent>
        </BaseCard>
        <BaseCard>
          <BaseContent>
            <template #title>Themed Children's Parties</template>
            <template #sub-1
              >Our parties and entertainers are available all year</template
            >
            <template #para-1
              >Are you looking for a fun-filled birthday party for your child?
              Great, then look no further!</template
            >
            <template #para-2
              >Our parties are guaranteed to keep all the children engaged from
              the first minute.</template
            >
            <template #para-3
              >Choose our Football Frenzy Party, our AbsoluteSport Party or, if
              the birthday boy or girl loves dancing then our Disco Party is
              sure to be a hit!</template
            >
          </BaseContent>
        </BaseCard>
        <!-- <BaseCard>
          <BaseContent>
            <template #title>Football Academy</template>
            <template #sub-1>Available to book every weekend.</template>
            <template #para-1
              >Come and join Coach Tom at our football academy training sessions
              at Sidlesham Primary School and Portfield Primary
              Academy!</template
            >
            <template #para-2
              >Training sessions are split over two age groups; 5-8 years and
              9-12 years old.</template
            >
            <template #para-3
              >These training sessions involve technical and tactical drills to
              enhance our budding footballer's abilities. All abilities are
              welcome and catered for.
            </template>
          </BaseContent>
        </BaseCard> -->
      </div>
    </section>
    <!-- About -->
    <section
      id="about"
      class="bg-blend-overlay lg:bg-fixed bg-neutral-700 bg-[url('https://res.cloudinary.com/asimages/image/upload/v1679601944/webapp/home_about_portrait_1920.webp')] md:bg-[url('https://res.cloudinary.com/asimages/image/upload/v1679601944/webapp/home_about_landscape_1920.webp')] h-[100vh] min-h-[667px] md:h-[70vh] bg-center bg-no-repeat bg-cover w-full py-8"
    >
      <div class="max-w-7xl mx-auto font-bold">
        <div class="md:flex">
          <div class="container w-full md:h-full shrink-0 py-8">
            <BaseContent>
              <template #title
                >“FUN FOR EVERYONE” <br />
                -AbsoluteSport</template
              >
              <template #sub-1
                >Service Provider to Parents, Schools, Councils and Sport
                Coaches in West Sussex and Hampshire</template
              >
              <template #para-1
                >Whether you're a parent seeking ways to help your children
                become more active or a school or other organisation looking for
                a provider of first-class sports coaching, mentoring or
                training, AbsoluteSport is certified to help.</template
              >
              <template #para-2
                >Our highly qualified and experienced team will provide
                programmes and activities tailored to your exact
                needs.</template
              >
              <template #para-3
                >AbsoluteSport is dedicated to providing positive youth team
                sports experiences through family and community involvement that
                is based on the philosophy
                <span class="text-accent font-play">"FUN FOR EVERYONE"</span
                >.<br />
                <br />
                <span class="text-accent font-play">"FUN FOR EVERYONE"</span> is
                a cornerstone of our organization. Our programs are open to any
                child able to participate regardless of race, religion, creed,
                sex or ability. Our mission is to raise awareness in children
                about the importance of regular exercise and how it will benefit
                their future.</template
              >
            </BaseContent>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<style>
.swiper-wrapper {
  height: fit-content;
  min-height: fit-content;
  max-height: 100vw;
}
</style>
