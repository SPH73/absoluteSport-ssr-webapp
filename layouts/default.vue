<template>
  <div class="w-full min-h-full h-screen flex flex-col">
    <div class="bg-secondary w-full text-light font-mulish uppercase h-6">
      This is the ticker notification bar
    </div>
    <header class="bg-accent max-h-fit w-full flex items-center justify-between p-2">
      <NuxtLink class="mr-4" to="/">
        <img src="/img/logo.webp" alt="Logo" />
      </NuxtLink>
      <nav class="flex justify-evenly uppercase font-inter-medium">
        <NuxtLink
          to="/"
          class="text-secondary active:text-primary block mt-4 lg:inline-block lg:mt-0 mr-4"
        >
          Home
        </NuxtLink>
        <NuxtLink
          class="text-secondary active:text-primary block mt-4 lg:inline-block lg:mt-0 mr-4"
        >
          Contact
        </NuxtLink>
        <NuxtLink
          class="text-secondary active:text-primary block mt-4 lg:inline-block lg:mt-0 mr-4"
        >
          School Clubs
        </NuxtLink>
        <NuxtLink
          class="text-secondary active:text-primary block mt-4 lg:inline-block lg:mt-0 mr-4"
        >
          Activity Camps
        </NuxtLink>
        <NuxtLink
          to="/parties"
          class="text-secondary active:text-primary block mt-4 lg:inline-block lg:mt-0 mr-4"
        >
          Kids Parties
        </NuxtLink>
      </nav>
    </header>
    <div class="mb-auto flex flex-col bg-primary">
      <slot />
    </div>
    <footer class="bg-dark text-light">
      <div class="container">
        <h1>Footer</h1>
      </div>
    </footer>
  </div>
</template>
