<script lang="ts" setup></script>

<template>
  <div class="my-8">
    <section class="max-w-7xl mx-auto">
      <div class="container py-4">
        <h2>Holiday Activity Camps</h2>
        <div>
          <p>
            Who doesn’t love meeting a superhero, dressing up like a Pirate or
            playing Survival?
          </p>
          <p>
            Each day of our Holiday Camps has a different theme in store for the
            children. Our days are fun-filled and exciting, helping your
            children to spend the school break in laughter, while building new
            friendships and life-long memories.
          </p>
          <p>
            Our camps are suitable for children of all abilities between 5 and
            12 years old and provide an opportunity to stay active throughout
            the school holidays by participating in a wide range of fun,
            exciting sports, games and art projects.
          </p>
          <p>
            Our camps are structured and delivered by our coaches trained in
            coaching children in sports. The team will ensure that your child
            feels included in all the fun so that they build not only skills in
            sports but also socially and emotionally (self-esteem and
            confidence).
          </p>
        </div>
      </div>
    </section>
    <section
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full mx-auto pt-8 px-8"
    >
      <BaseBadge>
        <template #icon>
          <font-awesome-icon :icon="['fas', 'mask']" />
        </template>
        <template #heading> Themes </template>
        <template #details>
          With a variety of themes we make each day an exciting one. We may even
          surprise you with your favourite superhero!
        </template>
      </BaseBadge>
      <BaseBadge>
        <template #icon>
          <font-awesome-icon :icon="['fas', 'paintbrush']" />
        </template>
        <template #heading>Arts & Crafts</template>
        <template #details>
          Your children's imaginations will run wild with our creative arts and
          crafts sessions!
        </template>
      </BaseBadge>
      <BaseBadge>
        <template #icon>
          <font-awesome-icon :icon="['fas', 'puzzle-piece']" />
        </template>
        <template #heading>Games </template>
        <template #details>
          It's fun all the way! Your children will enjoy a variety of games
          sessions during each camp that include individual and group
          activities.
        </template>
      </BaseBadge>
      <BaseBadge>
        <template #icon>
          <font-awesome-icon :icon="['fas', 'futbol-ball']" />
        </template>
        <template #heading>Sports</template>
        <template #details>
          May the best team win but may the losers feel like winners too! Sports
          sessions include many fun sports from football to dodgeball!
        </template>
      </BaseBadge>
    </section>
  </div>
</template>
