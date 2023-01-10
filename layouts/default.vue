<template>
  <div class="w-full min-h-full h-screen flex flex-col">
    <TheTicker />
    <header>
      <TheNavbar />
    </header>
    <main class="mb-auto flex flex-col bg-primary">
      <slot />
    </main>
    <footer class="bg-dark text-light print:hidden">
      <div class="container">
        <h2>Footer</h2>
      </div>
    </footer>
  </div>
</template>
