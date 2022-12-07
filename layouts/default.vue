<template>
  <div class=" bg-primary w-full min-h-full h-screen flex flex-col">
    <header
            class="bg-accent max-h-fit w-full flex items-center justify-between p-2">
      <NuxtLink to="/">
        <img src="/img/logo.webp" alt="Logo">
      </NuxtLink>
      <nav
           class="text-secondary flex justify-evenly  text-lg uppercase font-inter-medium">
        <NuxtLink to="/" class="block mt-4 lg:inline-block lg:mt-0 mr-4">Home
        </NuxtLink>
        <NuxtLink class="block mt-4 lg:inline-block lg:mt-0 mr-4">Contact
        </NuxtLink>
        <NuxtLink class="block mt-4 lg:inline-block lg:mt-0 mr-4">School Clubs
        </NuxtLink>
        <NuxtLink class="block mt-4 lg:inline-block lg:mt-0 mr-4">Activity Camps
        </NuxtLink>
        <NuxtLink to="/parties" class="block mt-4 lg:inline-block lg:mt-0 mr-4">
          Kids Parties
        </NuxtLink>
      </nav>
    </header>
    <div class="mb-auto flex flex-col items-center flex-grow">
      <slot />
    </div>

    <footer class="bg-zinc-800 w-full max-h-fit text-white">This is the
      footer</footer>
  </div>
</template>

<style scoped>

</style>
