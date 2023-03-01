<script setup>
const { error, pending, data: reviews } = await useFetch("/api/reviews");
const reviewList = ref([]);
let review = {};
// console.log("reviewsList", reviews.value);
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
    <section
      class="bg-blend-overlay lg:bg-fixed bg-neutral-600 bg-[url('/img/hero_portrait_1920.webp')] md:bg-[url('/img/hero_landscape_1920.webp')] bg-center bg-no-repeat bg-cover w-full h-[90vh] md:h-[70vh] pt-10 pb-4 relative"
    >
      <div class="max-w-7xl mx-auto">
        <div class="container font-play py-4">
          <h1 class="text-center md:text-left">
            Fun, Laughter, Games and Exercise with AbsoluteSport
          </h1>
          <h2 class="text-center md:text-left">
            Kids learn while having fun at our clubs, camps and parties
          </h2>
          <div id="carousel" class="absolute inset-x-0 md:inset-x-5 bottom-0">
            <!-- reviews -->
            <Swiper
              class="w-full md:w-3/4 lg:w-2/4 xl:w-1/3 backdrop-grayscale rounded-xl flex justify-center items center p-4"
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
                delay: 7000,
                disableOnInteraction: true,
              }"
            >
              <SwiperSlide v-for="review in reviewList" :key="review.index" class="p-4"
                ><ReviewItem :review="review" />
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </section>
    <section>
      <!-- Benefits -->
      <section
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full mx-auto pt-8 px-8"
      >
        <BaseBadge>
          <template #icon>
            <font-awesome-icon :icon="['fas', 'award']" />
          </template>
          <template #heading>
            Qualified, insured, first aid trained & DBS checked staff
          </template>
          <template #details>
            We ensure that all staff are appropriately qualified and experienced. Each
            member holds an enhanced DBS check and valid first aid certificate.
          </template>
        </BaseBadge>
        <BaseBadge>
          <template #icon>
            <font-awesome-icon :icon="['fas', 'hand-holding-heart']" />
          </template>
          <template #heading> Warm and friendly team of coaches </template>
          <template #details>
            At the heart of the selection process when recruiting our coaches is the
            qualities required for working with children. Our enthusiastic team
            demonstrate patience and a postive attitude as well as the dedication towards
            helping the children get the most out of each session we deliver at our clubs,
            camps and parties.
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
            We ensure that children are exposed to a variety of sports so that they have a
            fair opportunity of finding a sport they are both interested in and excel at,
            often continuing on to participate at a higher level.
          </template>
        </BaseBadge>
        <BaseBadge>
          <template #icon>
            <font-awesome-icon :icon="['fas', 'check']" />
          </template>
          <template #heading> First-class programme delivery </template>
          <template #details>
            Our sports-based programmes are designed to meet the national curriculum. They
            support growth for the individual and group by providing fun but challenging
            sessions that encourage social interaction and team camaraderie.
          </template>
        </BaseBadge>
      </section>
    </section>
    <section>
      <!-- Services -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mx-auto p-8">
        <BaseCard>
          <BaseContent>
            <template #title>During School Term's</template>
            <template #sub-1>Morning Clubs</template>
            <template #para-1
              >Our Morning Clubs at West Wittering and Sidlesham Primary Schools are
              something that all the children love. We include many fun sports like
              Fencing, Archery and Table Tennis.</template
            >
            <template #sub-2>Afternoon Clubs</template>
            <template #para-2
              >After School Clubs give the children the perfect opportunity to learn a new
              sport or enhance their current skills in their favourite sports. We do a
              wide range of clubs with KS1 and KS2 children.</template
            >
          </BaseContent>
        </BaseCard>
        <BaseCard>
          <BaseContent>
            <template #title>During School Holiday's</template>
            <template #sub-1>Sports & Activity Camps </template>
            <template #para-1
              >Our holiday clubs provide children with the opportunity to make new
              friendships outside of their school or classrooms and remain mentally and
              physically active while having a great time together.</template
            >
            <template #para-2
              >Working parent's have the peace of mind that their children are engaging in
              social and sports activities that boost their confidence and skills in a
              safe and fun environment.
            </template>
            <template #para-3
              >Come and find out how much fun we have during the school
              holidays!</template
            >
          </BaseContent>
        </BaseCard>
        <BaseCard>
          <BaseContent>
            <template #title>All year</template>
            <template #sub-1>Themed Children's Parties</template>
            <template #para-1
              >Are you looking for a fun-filled birthday party for your child? Great, then
              look no further!</template
            >
            <template #para-2
              >Our parties are guaranteed to keep all the children engaged from the first
              minute.</template
            >
            <template #para-3
              >Choose our Football Frenzy Party, our AbsoluteSport Party or, if the
              birthday boy or girl loves dancing then our Disco Party is sure to be a
              hit!</template
            >
          </BaseContent>
        </BaseCard>
      </div>
    </section>
    <!-- About -->
    <section
      id="about"
      class="bg-blend-overlay lg:bg-fixed bg-neutral-700 bg-[url('/img/home_about_portrait_1920.webp')] md:bg-[url('/img/home_about_landscape_1920.webp')] h-[90vh] md:h-[70vh] bg-center bg-no-repeat bg-cover w-full py-10"
    >
      <div class="max-w-7xl mx-auto">
        <div class="container py-8">
          <BaseContent>
            <template #title
              >“FUN FOR EVERYONE” <br />
              -AbsoluteSport</template
            >
            <template #sub-1
              >Service Provider to Parents, Schools, Councils and Sport Coaches in West
              Sussex and Hampshire</template
            >
            <template #para-1
              >Whether you're a parent seeking ways to help your children become more
              active or a school or other organisation looking for a provider of
              first-class sports coaching, mentoring or training, AbsoluteSport is
              certified to help.</template
            >
            <template #para-2
              >Our highly qualified and experienced team will provide programmes and
              activities tailored to your exact needs.</template
            >
            <template #para-3
              >Our mission is to engage children and young people in physical activity, by
              providing innovative delivery and training services and the resources to
              educate and inspire.</template
            >
          </BaseContent>
          <!-- <p>Read more about AbsoluteSport -></p> -->
        </div>
      </div>
    </section>
  </div>
</template>
