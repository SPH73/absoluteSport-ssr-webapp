<template>
  <div class="w-full min-h-full h-screen flex flex-col">
    <TheTicker />
    <header>
      <TheNavbar />
    </header>
    <main class="mb-auto flex flex-col bg-primary">
      <slot />
    </main>
    <footer class="bg-dark text-light">
      <div class="container">
        <h1>Footer</h1>
      </div>
    </footer>
  </div>
</template>
