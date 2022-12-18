<template>
  <nav class="w-full bg-accent p-3">
    <div class="flex items-center justify-between">
      <!-- Header Logo -->
      <NuxtLink class="mr-4" to="/">
        <img src="/img/logo.webp" alt="Logo" class="w-64" />
      </NuxtLink>
      <!-- Mobile Menu Button -->
      <div class="lg:hidden">
        <button @click="drawer">
          <font-awesome-icon :icon="['fas', 'bars']" class="text-secondary w-12 h-12" />
        </button>
      </div>

      <!-- Navbar -->
      <div class="hidden lg:block">
        <ul class="flex space-x-8 text-3xl font-mulish uppercase text-secondary">
          <li>
            <NuxtLink to="/" class="pb-2 hover:font-bold"> Home </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/clubs" class="hover:font-bold pb-2"> School Clubs </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/camps" class="hover:font-bold pb-2"> Activity Camps </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/parties" class="hover:font-bold pb-2"> Kids Parties </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/contact" class="hover:font-bold pb-2"> Contact </NuxtLink>
          </li>
        </ul>
      </div>
      <!-- Mobile Menu Transition background -->
      <transition
        enter-class="opacity-0"
        enter-active-class="ease-out transition-medium"
        enter-to-class="opacity-100"
        leave-class="opacity-100"
        leave-active-class="ease-out transition-medium"
        leave-to-class="opacity-0"
      >
        <div
          @keydown.esc="isOpen = false"
          v-show="isOpen"
          class="z-10 fixed inset-0 transition-opacity"
        >
          <div
            @click="isOpen = false"
            class="absolute inset-0 bg-black opacity-50"
            tabindex="0"
          ></div>
        </div>
      </transition>
      <!-- Drawer Menu -->
      <aside
        class="p-5 transform top-0 right-0 left-0 w-80 bg-accent fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30"
        :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <div class="close">
          <button class="absolute top-0 right-0 mt-4 mr-4" @click="isOpen = false">
            <font-awesome-icon :icon="['fas', 'xmark']" class="text-secondary h-12 w12" />
          </button>
        </div>
        <span @click="isOpen = false" class="flex w-full items-center p-4">
          <NuxtLink class="mr-4" to="/">
            <img src="/img/logo.webp" alt="Logo" class="w-48" />
          </NuxtLink>
        </span>
        <ul
          class="divide-y-2 divide-primary font-mulish text-secondary uppercase text-2xl"
        >
          <li>
            <NuxtLink to="/" @click="isOpen = false" class="my-4 inline-block">
              Home</NuxtLink
            >
          </li>
          <li>
            <NuxtLink to="/" @click="isOpen = false" class="my-4 inline-block">
              Contact</NuxtLink
            >
          </li>
          <li>
            <NuxtLink to="/" @click="isOpen = false" class="my-4 inline-block">
              School Clubs</NuxtLink
            >
          </li>
          <li>
            <NuxtLink to="/" @click="isOpen = false" class="my-4 inline-block">
              Activity Camps</NuxtLink
            >
          </li>
          <li>
            <NuxtLink to="/parties" @click="isOpen = false" class="my-4 inline-block">
              Kids Parties</NuxtLink
            >
          </li>
        </ul>
        <div class="follow">
          <p class="font-mulish uppercase text-secondary text-2xl">follow us:</p>
          <div class="social flex space-x-5 mt-4">
            <a href="#">
              <font-awesome-icon
                :icon="['fab', 'linkedin']"
                class="text-secondary h-12 w12"
              />
            </a>
            <a href="#">
              <font-awesome-icon
                :icon="['fab', 'facebook']"
                class="text-secondary h-12 w12"
              />
            </a>
            <a href="#">
              <font-awesome-icon
                :icon="['fab', 'instagram']"
                class="text-secondary h-12 w12"
              />
            </a>
          </div>
        </div>
      </aside>
    </div>
  </nav>
</template>

<script setup lang="ts">
const isOpen = ref(false);
function drawer() {
  isOpen.value = !isOpen.value;
}
watch(isOpen, function handler(isOpen) {
  if (process.client) {
    if (isOpen) document.body.style.setProperty("overflow", "hidden");
    else document.body.style.removeProperty("overflow");
  }
});
onMounted(() => {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && isOpen.value) isOpen.value = !isOpen.value;
  });
});
</script>

<style scoped>
.router-link-active,
.router-link-exact-active {
  border-bottom: solid 0.3rem rgb(248 132 37);
}
</style>
