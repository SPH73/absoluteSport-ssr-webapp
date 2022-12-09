<template>
  <div class="w-full min-h-full h-screen flex flex-col">
    <div class="bg-secondary w-full text-light font-mulish uppercase h-6">
      This is the ticker notification bar
    </div>
    <header class="bg-accent max-h-fit w-full flex items-center justify-between p-2">
      <NuxtLink to="/">
        <img src="/img/logo.webp" alt="Logo" />
      </NuxtLink>
      <nav class="text-secondary flex justify-evenly text-lg uppercase font-inter-medium">
        <NuxtLink to="/" class="block mt-4 lg:inline-block lg:mt-0 mr-4">Home </NuxtLink>
        <NuxtLink class="block mt-4 lg:inline-block lg:mt-0 mr-4">Contact </NuxtLink>
        <NuxtLink class="block mt-4 lg:inline-block lg:mt-0 mr-4">School Clubs </NuxtLink>
        <NuxtLink class="block mt-4 lg:inline-block lg:mt-0 mr-4"
          >Activity Camps
        </NuxtLink>
        <NuxtLink to="/parties" class="block mt-4 lg:inline-block lg:mt-0 mr-4">
          Kids Parties
        </NuxtLink>
      </nav>
    </header>
    <div class="mb-auto flex flex-col bg-primary">
      <slot />
    </div>
    <footer class="bg-dark text-light">
      <h1>Footer</h1>
    </footer>
  </div>
</template>
