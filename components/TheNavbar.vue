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

<template>
  <nav class="w-full bg-accent p-3 print:hidden" role="navigation">
    <div class="flex items-center justify-between">
      <!-- Header Logo -->
      <NuxtImg
        provider="cloudinary"
        src="/webapp/logo.webp"
        alt="Logo"
        width="256"
        class="w-64"
      />
      <!-- Mobile Menu Button -->
      <div class="lg:hidden">
        <button
          @click="drawer"
          id="toggle"
          aria-label="menu"
          aria-expanded="false"
          aria-controls="menu"
        >
          <font-awesome-icon
            :icon="['fas', 'bars']"
            class="text-secondary w-12 h-12"
          />
        </button>
      </div>

      <!-- Navbar -->
      <div class="hidden lg:block">
        <ul
          class="flex space-x-8 text-3xl font-mulish uppercase text-secondary"
        >
          <li class="flex justify-items-center">
            <NuxtLink
              to="/"
              class="pb-2 hover:font-bold"
              aria-label="Navigate to the homepage"
            >
              Home
            </NuxtLink>
          </li>
          <li class="dropdown" aria-haspopup="true">
            <span
              >School Clubs
              <font-awesome-icon
                :icon="['fas', 'angle-down']"
                class="text-secondary h-8 w-8 my-auto"
              />
            </span>

            <ul class="dropdown-content" aria-label="submenu">
              <li class="flex justify-items-center">
                <NuxtLink
                  to="/clubs"
                  class="hover:font-bold pb-2"
                  aria-label="Navigate to the School clubs page"
                >
                  About Our Clubs
                </NuxtLink>
              </li>
              <li class="flex justify-items-center">
                <NuxtLink
                  to="/clubs/upcoming"
                  class="hover:font-bold pb-2"
                  aria-label="Navigate to the School clubs page"
                >
                  Our Upcoming Clubs
                </NuxtLink>
              </li>
              <li class="flex justify-items-center">
                <NuxtLink
                  to="/clubs/booking"
                  class="hover:font-bold pb-2"
                  aria-label="Navigate to the School clubs page"
                >
                  Book Our Clubs
                </NuxtLink>
              </li>
            </ul>
          </li>
          <li class="dropdown" aria-haspopup="true">
            <span
              >Activity Camps&nbsp;<font-awesome-icon
                :icon="['fas', 'angle-down']"
                class="text-secondary h-8 w-8 my-auto"
            /></span>
            <ul class="dropdown-content" aria-label="submenu">
              <li class="flex justify-items-center">
                <NuxtLink
                  to="/camps"
                  class="hover:font-bold pb-2"
                  aria-label="Navigate to the holiday activity camps page"
                >
                  About Our Camps
                </NuxtLink>
              </li>
              <li class="flex justify-items-center">
                <NuxtLink
                  to="/camps/upcoming"
                  class="hover:font-bold pb-2"
                  aria-label="Navigate to the holiday activity camps page"
                >
                  Our Upcoming Camps
                </NuxtLink>
              </li>
              <li class="flex justify-items-center">
                <NuxtLink
                  to="/camps/booking"
                  class="hover:font-bold pb-2"
                  aria-label="Navigate to the holiday activity camps page"
                >
                  Book our Camps
                </NuxtLink>
              </li>
            </ul>
          </li>
          <li class="dropdown" aria-haspopup="true">
            <span
              >Kids parties&nbsp;<font-awesome-icon
                :icon="['fas', 'angle-down']"
                class="text-secondary h-8 w-8 my-auto"
            /></span>
            <ul class="dropdown-content" aria-label="submenu">
              <li class="flex justify-items-center">
                <NuxtLink
                  to="/parties"
                  class="hover:font-bold pb-2"
                  aria-label="Navigate to the themed parties for kids page"
                >
                  About our Parties
                </NuxtLink>
              </li>
              <li class="flex justify-items-center">
                <NuxtLink
                  to="/parties/quote"
                  class="hover:font-bold pb-2"
                  aria-label="Navigate to the party quote form"
                >
                  Get A Quote
                </NuxtLink>
              </li>
            </ul>
          </li>
          <!-- HIDE UNTIL READY TO FINISH -->
          <!-- <li class="dropdown" aria-haspopup="true">
            <span
              >Football Academy&nbsp;<font-awesome-icon
                :icon="['fas', 'angle-down']"
                class="text-secondary h-8 w-8 my-auto"
            /></span>
            <ul class="dropdown-content" aria-label="submenu">
              <li class="flex justify-items-center">
                <NuxtLink
                  to="/football"
                  class="hover:font-bold pb-2"
                  aria-label="Navigate to the themed parties for kids page"
                >
                  About our Football Academy
                </NuxtLink>
              </li>

              <li class="flex justify-items-center">
                <NuxtLink
                  to="/football/meet-coach-tom"
                  class="hover:font-bold pb-2"
                  aria-label="Navigate to the party quote form"
                >
                  Meet Coach Tom
                </NuxtLink>
              </li>
              <li class="flex justify-items-center">
                <NuxtLink
                  to="/football/booking"
                  class="hover:font-bold pb-2"
                  aria-label="Navigate to the party quote form"
                >
                  Book our Football Academy
                </NuxtLink>
              </li>
            </ul>
          </li> -->
          <li class="flex items-center">
            <NuxtLink
              to="/contact"
              class="hover:font-bold pb-2"
              aria-label="Navigate to the contact page to send us a message using our message form"
            >
              Contact
            </NuxtLink>
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
          <button
            aria-label="close"
            class="absolute top-0 right-0 mt-4 mr-4"
            @click="isOpen = false"
          >
            <font-awesome-icon
              :icon="['fas', 'xmark']"
              class="text-secondary h-12 w12"
            />
          </button>
        </div>
        <span @click="isOpen = false" class="flex w-full items-center p-4">
          <NuxtImg
            provider="cloudinary"
            src="/webapp/logo.webp"
            alt="Logo"
            class="w-48"
            width="224"
          />
        </span>
        <ul
          id="menu"
          class="divide-y divide-secondary font-mulish text-secondary uppercase text-2xl"
        >
          <li class="flex items-center">
            <NuxtLink
              to="/"
              @click="isOpen = false"
              class="my-4 inline-block"
              aria-label="Navigate to the homepage"
            >
              Home</NuxtLink
            >
          </li>

          <li class="flex items-center">
            <NuxtLink
              to="/clubs"
              @click="isOpen = false"
              class="my-4 inline-block"
              aria-label="Navigate to the School Clubs page"
            >
              Our School Clubs</NuxtLink
            >
          </li>
          <li class="flex items-center">
            <NuxtLink
              to="/clubs/upcoming"
              @click="isOpen = false"
              class="my-4 inline-block"
              aria-label="Navigate to the upcoming clubs page"
            >
              View upcoming Clubs</NuxtLink
            >
          </li>
          <li class="flex items-center">
            <NuxtLink
              to="/clubs/booking"
              @click="isOpen = false"
              class="my-4 inline-block"
              aria-label="Navigate to clubs booking form"
            >
              Book upcoming Clubs</NuxtLink
            >
          </li>
          <li class="flex items-center">
            <NuxtLink
              to="/camps"
              @click="isOpen = false"
              class="my-4 inline-block"
              aria-label="Navigate to the holiday activity camps page"
            >
              Activity Camps</NuxtLink
            >
          </li>
          <li class="flex items-center">
            <NuxtLink
              to="/camps/upcoming"
              @click="isOpen = false"
              class="my-4 inline-block"
              aria-label="Navigate to the upcoming camps page"
            >
              View current &amp; upcoming Camps</NuxtLink
            >
          </li>
          <li class="flex items-center">
            <NuxtLink
              to="/camps/booking"
              @click="isOpen = false"
              class="my-4 inline-block"
              aria-label="Navigate to camps booking form"
            >
              Book upcoming Camps</NuxtLink
            >
          </li>
          <li class="flex items-center">
            <NuxtLink
              to="/parties"
              @click="isOpen = false"
              class="my-4 inline-block"
              aria-label="Navigate to the themed parties for kids page"
            >
              Kids Parties</NuxtLink
            >
          </li>
          <li class="flex items-center">
            <NuxtLink
              to="/parties/quote"
              @click="isOpen = false"
              class="my-4 inline-block"
              aria-label="Navigate party quote form"
            >
              Get a party quote</NuxtLink
            >
          </li>
          <!-- HIDE UNTIL SECTION IS READY TO START -->
          <!-- 
          <li class="flex items-center">
            <NuxtLink
              to="/football"
              @click="isOpen = false"
              class="my-4 inline-block"
              aria-label="Navigate to the football academy page"
            >
              Our Football Academy</NuxtLink
            >
          </li>

          <li class="flex items-center">
            <NuxtLink
              to="/football/meet-coach-Tom"
              @click="isOpen = false"
              class="my-4 inline-block"
              aria-label="Navigate to the football academy page"
            >
              Our Football Coach</NuxtLink
            >
          </li>
          <li class="flex items-center">
            <NuxtLink
              to="/football/booking"
              @click="isOpen = false"
              class="my-4 inline-block"
              aria-label="Navigate to the football academy page"
            >
              Book Football Coaching</NuxtLink
            >
          </li> -->
          <li class="flex items-center">
            <NuxtLink
              to="/contact"
              @click="isOpen = false"
              class="my-4 inline-block"
              aria-label="Navigate to the contact page to send us a message using our message form"
            >
              Contact</NuxtLink
            >
          </li>
        </ul>
        <div class="follow">
          <p class="font-mulish uppercase text-secondary text-2xl">connect:</p>
          <div class="social flex space-x-5 mt-4">
            <NuxtLink
              to="https://www.linkedin.com/in/ben-blakeley-b2600522b/"
              aria-label="Connect with us on linkedin"
            >
              <font-awesome-icon
                :icon="['fab', 'linkedin']"
                class="text-secondary h-12 w12"
              />
            </NuxtLink>
            <NuxtLink
              to="https://www.facebook.com/AbsoluteSport.AS"
              aria-label="Connect with us on facebook"
            >
              <font-awesome-icon
                :icon="['fab', 'facebook']"
                class="text-secondary h-12 w12"
              />
            </NuxtLink>
            <NuxtLink
              to="https://www.instagram.com/absolutesport2211/"
              aria-label="Connect with us on instagram"
            >
              <font-awesome-icon
                :icon="['fab', 'instagram']"
                class="text-secondary h-12 w12"
              />
            </NuxtLink>
            <NuxtLink
              to="https://api.whatsapp.com/send?phone=447540309658"
              aria-label="Connect with us on whatsapp chat"
            >
              <font-awesome-icon
                :icon="['fab', 'whatsapp']"
                class="text-secondary h-12 w12"
              />
            </NuxtLink>
          </div>
        </div>
      </aside>
    </div>
  </nav>
</template>

<style scoped>
.router-link-active,
.router-link-exact-active {
  border-bottom: solid 0.3rem rgb(248 132 37);
}
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: rgb(246 236 73);
  min-width: 295px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding: 12px 16px;
  z-index: 1;
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>
