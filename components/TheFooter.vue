<script lang="ts" setup></script>

<template>
  <footer class="bg-dark text-light text-xl print:hidden" id="footer-container">
    <div
      class="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-4 w-full font-play"
    >
      <div class="mt-4 flex flex-col">
        <NuxtLink to="/" class=""
          ><img src="/img/logo.webp" alt="Logo" class="w-64" />
        </NuxtLink>
        <ul class="list-none">
          <li>ABSOLUTESPORT.AS LTD</li>
          <li>Company number: 11554323</li>
        </ul>
        <div id="copy-area">
          <h5>© 2023 AbsoluteSport</h5>
        </div>
      </div>
      <div id="connect-area" class="flex flex-col pt-2">
        <h5 class="mt-2 mb-4">CONNECT WITH US</h5>
        <NuxtLink to="tel:07540309658" class="py-2">Phone</NuxtLink>
        <NuxtLink to="sms:07540309658" class="py-2"> Text Message</NuxtLink>
        <NuxtLink :to="{ name: 'contact' }" class="py-2">Message Form</NuxtLink>
        <NuxtLink
          to="https://www.facebook.com/AbsoluteSport.AS"
          class="py-2"
          target="_blank"
          rel="noopener"
          >FaceBook
        </NuxtLink>
        <NuxtLink
          to="https://www.linkedin.com/in/ben-blakeley-b2600522b/"
          class="py-2"
          target="_blank"
          rel="noopener"
        >
          LinkedIn</NuxtLink
        >
        <NuxtLink
          to="https://www.instagram.com/absolutesport2211/"
          class="py-2"
          target="_blank"
          rel="nopener"
          >Instagram
        </NuxtLink>
        <NuxtLink to="/" class="py-2">About Us</NuxtLink>
      </div>

      <div id="links-area" class="flex flex-col pt-2">
        <h5 class="mt-2 mb-4">LINKS</h5>

        <NuxtLink :to="{ name: 'clubs' }" class="py-2">School Clubs</NuxtLink>
        <NuxtLink :to="{ name: 'clubs-booking' }" class="py-2"
          >Book School Clubs</NuxtLink
        >
        <NuxtLink :to="{ name: 'parties' }" class="py-2">Kids Parties</NuxtLink>
        <NuxtLink :to="{ name: 'parties-quote' }" class="py-2"
          >Request A Party Quote</NuxtLink
        >
        <NuxtLink :to="{ name: 'camps' }" class="py-2"
          >Holiday Activity Camps</NuxtLink
        >
        <NuxtLink :to="{ name: 'camps-booking' }" class="py-2"
          >Book Upcoming Camps</NuxtLink
        >

        <NuxtLink to="/faqs" class="py-2">FAQ's</NuxtLink>
      </div>

      <div id="legal-area" class="flex flex-col pt-2">
        <h5 class="mt-2 mb-4">LEGAL &#38; SITE MAP</h5>
        <NuxtLink
          to="https://docs.google.com/document/d/12DXvOXiAUBYBcFtsjq6ei398QyFPxPdn/edit?usp=sharing&ouid=105789957608846293341&rtpof=true&sd=true"
          target="_blank"
          rel="noopener"
          class="py-2"
          >Privacy Policy</NuxtLink
        >
        <NuxtLink :to="{ name: 'legal-disclaimer' }" class="py-2"
          >Disclaimer</NuxtLink
        >
        <NuxtLink :to="{ name: 'legal-terms' }" class="py-2"
          >T's &amp; C's</NuxtLink
        >
        <NuxtLink :to="{ name: 'legal-policies' }" class="py-2"
          >Policies &amp; Procedures</NuxtLink
        >
        <NuxtLink to="/" class="py-2">Site Map</NuxtLink>
      </div>
    </div>
    <div class="grid gap-4 justify-center">
      <div
        id="social-area"
        class="flex flex-row gap-x-4 justify-between items-center mt-8"
      >
        <!-- ToDO add fb share button -->
        <button class="btn-fb-share">
          <NuxtLink
            target="_blank"
            rel="noopener"
            to="https://www.facebook.com/sharer/sharer.php?u=https://www.facebook.com/AbsoluteSport.AS"
          >
            <font-awesome-icon
              :icon="['fab', 'facebook']"
              class="text-light w-8 h-8 mr-2"
            />Share
          </NuxtLink>
        </button>
        <!-- <button class="btn-fb-share">
          <NuxtLink to="#">
            <font-awesome-icon
              :icon="['fas', 'thumbs-up']"
              class="text-light w-8 h-8 mr-2"
            />
            Like</NuxtLink
          >
        </button> -->
        <div id="social-icons" class="flex flex-row gap-x-4 justify-between">
          <NuxtLink
            to="https://www.instagram.com/absolutesport2211/"
            target="_blank"
            rel="noopener"
          >
            <font-awesome-icon
              :icon="['fab', 'instagram']"
              class="text-accent w-12 h-12"
          /></NuxtLink>
          <NuxtLink
            to="https://www.facebook.com/AbsoluteSport.AS"
            target="_blank"
            rel="noopener"
          >
            <font-awesome-icon
              :icon="['fab', 'facebook']"
              class="text-accent w-12 h-12"
          /></NuxtLink>
          <NuxtLink
            to="https://www.linkedin.com/in/ben-blakeley-b2600522b/"
            target="_blank"
            rel="noopener"
          >
            <font-awesome-icon
              :icon="['fab', 'linkedin']"
              class="text-accent w-12 h-12"
          /></NuxtLink>
        </div>
      </div>
      <div id="recog-area" class="text-center my-8">
        <a href="https://designdevelophost.co.uk" target="_blank" rel="noopener"
          >Website By Design Develop Host
        </a>
      </div>
    </div>
  </footer>
</template>
