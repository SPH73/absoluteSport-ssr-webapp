<script setup></script>
<template>
  <section
           class="bg-blend-overlay lg:bg-fixed bg-neutral-600 bg-[url('/img/hero_1920.webp')] bg-center bg-no-repeat bg-cover w-full h-[90vh] md:h-[70vh] pt-10 pb-4">
    <div class="max-w-7xl mx-auto">
      <div class="container relative font-play">
        <h1>Fun, Laughter, Games and Exercise with AbsoluteSport</h1>
        <h2>Kids learn while having fun at our clubs, camps and parties</h2>
      </div>
    </div>
  </section>
  <section>
    <div>
      <!-- Reviews -->
    </div>
  </section>
  <section>
    <!-- Benefits -->

    <div
         class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full mx-auto p-8">
      <BaseBadge>
        <template #icon>
          <font-awesome-icon :icon="['fas', 'award']" />
        </template>
        <template #heading>
          Qualified, insured, first aid trained & DBS checked staff
        </template>
        <template #details>
          We ensure that all staff are appropriately qualified and experienced.
          Each
          member holds an enhanced DBS check and valid first aid certificate.
        </template>
      </BaseBadge>
      <BaseBadge>
        <template #icon>
          <font-awesome-icon :icon="['fas', 'hand-holding-heart']" />
        </template>
        <template #heading> Warm and friendly team of coaches </template>
        <template #details>
          At the heart of the selection process when recruiting our coaches is
          the
          qualities required for working with children. Our team demonstrate
          patience and
          a postive attitude as well as the dedication towards helping the
          children get
          the most out of each session we deliver at our clubs, camps and
          parties.
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
          they have a
          fair opportunity of finding a sport they are not only interested in
          but also
          excel at, often going on to participating at a higher level.
        </template>
      </BaseBadge>
      <BaseBadge>
        <template #icon>
          <font-awesome-icon :icon="['fas', 'check']" />
        </template>
        <template #heading> First-class programme delivery </template>
        <template #details>
          Our sports-based programmes are designed to meet the national
          curriculum. They
          support growth for the individual and group by providing fun but
          challenging
          sessions that encourage social interaction and team camaraderie.
        </template>
      </BaseBadge>
    </div>
  </section>
  <section>
    <div class="container">
      <BaseCard>
        <BaseContent>
          <template #title>During School Term's</template>
          <template #sub-1>Morning Clubs</template>
          <template #para-1>Our Morning Clubs at West Wittering and Sidlesham
            Primary Schools are
            something that all the children will love. We include many fun
            sports like
            Fencing, Archery and Table Tennis.</template>
          <template #sub-2>Afternoon Clubs</template>
          <template #para-2>After School Clubs give the children that
            opportunity to learn a new sport or
            enhance their current skills in their favourite sports. We do a wide
            range of
            clubs with KS1 and KS2 children.</template>
        </BaseContent>
      </BaseCard>
    </div>
  </section>
  <!-- About -->
  <section
           class="bg-blend-overlay lg:bg-fixed bg-neutral-700 bg-[url('/img/home_about_1920.webp')] lg:bg-center sm:bg-left bg-no-repeat bg-cover w-full h-[90vh] py-10">
    <div class="max-w-7xl mx-auto">
      <div class="container">
        <BaseContent>
          <template #title>“FUN FOR EVERYONE” <br />
            -AbsoluteSport</template>
          <template #sub-1>Service Provider to Parents, Schools, Councils and
            Sport Coaches in West
            Sussex and Hampshire</template>
          <template #para-1>Whether you're a parent seeking ways to help your
            children become more active
            or a school or other organisation looking for a provider of
            first-class sports
            coaching, mentoring or training, AbsoluteSport is certified to
            help.</template>
          <template #para-2>Our highly qualified and experienced team will
            provide programmes and
            activities tailored to your exact needs.</template>
          <template #para-3>Our mission is to engage children and young people
            in physical activity, by
            providing innovative delivery and training services and the
            resources to
            educate and inspire.</template>
        </BaseContent>
        <!-- <p>Read more about AbsoluteSport -></p> -->
      </div>
    </div>
  </section>
  <section>
    <div class="max-w-7xl mx-auto">
      <div class="container">
        <BaseCard>
          <BaseContent>
            <template #title>Contact Form</template>
          </BaseContent>
        </BaseCard>
      </div>
    </div>
  </section>
</template>
