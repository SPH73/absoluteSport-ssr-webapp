<script lang="ts" setup>
const year = new Date().getFullYear();
</script>

<template>
  <footer
    class="bg-dark text-light text-2xl print:hidden"
    id="footer-container"
  >
    <div
      class="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-4 w-full font-play"
    >
      <div class="mt-4 flex flex-col">
        <NuxtLink to="/" class=""
          ><NuxtImg
            provider="cloudinary"
            src="/webapp/logo.webp"
            alt="Logo"
            width="256px"
            class="w-64"
          />
        </NuxtLink>
        <ul class="list-none">
          <li>ABSOLUTESPORT.AS LTD</li>
          <li>Company number: 11554323</li>
        </ul>
        <div id="copy-area">
          <h4>
            © <span>{{ year }}</span> AbsoluteSport
          </h4>
        </div>
      </div>
      <div id="connect-area" class="flex flex-col pt-2">
        <h5 class="mt-2 mb-4 text-accent">CONNECT WITH US</h5>
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
        <NuxtLink to="/#about" :external="false" class="py-2"
          >About Us</NuxtLink
        >
      </div>

      <div id="links-area" class="flex flex-col pt-2">
        <h5 class="mt-2 mb-4 text-accent">LINKS</h5>

        <NuxtLink
          :to="{ name: 'clubs' }"
          class="py-2"
          aria-label="navigate to school clubs page"
          >School Clubs</NuxtLink
        >
        <NuxtLink
          :to="{ name: 'clubs-booking' }"
          class="py-2"
          aria-label="navigate to clubs booking form"
          >Book School Clubs</NuxtLink
        >
        <NuxtLink
          :to="{ name: 'parties' }"
          class="py-2"
          aria-label="navigate to themed kids parties page"
          >Kids Parties</NuxtLink
        >
        <NuxtLink
          :to="{ name: 'parties-quote' }"
          class="py-2"
          aria-label="navigate to party quote form"
          >Request A Party Quote</NuxtLink
        >
        <NuxtLink
          :to="{ name: 'camps' }"
          class="py-2"
          aria-label="navigate to holiday activty camps page"
          >Holiday Activity Camps</NuxtLink
        >
        <NuxtLink
          :to="{ name: 'camps-booking' }"
          class="py-2"
          aria-label="navigate to camp booking form"
          >Book Upcoming Camps</NuxtLink
        >

        <NuxtLink to="/faqs" class="py-2" aria-label="navigate to faq's page"
          >FAQ's</NuxtLink
        >
      </div>

      <div id="legal-area" class="flex flex-col pt-2">
        <h5 class="mt-2 mb-4 text-accent">LEGAL</h5>
        <NuxtLink
          to="https://docs.google.com/document/d/12DXvOXiAUBYBcFtsjq6ei398QyFPxPdn/edit?usp=sharing&ouid=105789957608846293341&rtpof=true&sd=true"
          target="_blank"
          rel="noopener"
          class="py-2"
          aria-label="go to our privacy policy"
          >Privacy Policy</NuxtLink
        >
        <NuxtLink
          to="https://drive.google.com/file/d/1QTrpRtfwlY5G-23Oj6donEVr_-3Dnno8/view?usp=share_link"
          class="py-2"
          aria-label="go to our disclaimer policy"
          >Disclaimer</NuxtLink
        >
        <NuxtLink
          to="https://drive.google.com/file/d/1PuZYI5EWZAS5eQCnE8PcAyAYEK-XZC0x/view?usp=share_link"
          class="py-2"
          aria-label="go to our term's &amp; conditions"
          >T's &amp; C's</NuxtLink
        >
        <NuxtLink
          :to="{ name: 'legal-policies' }"
          class="py-2"
          aria-label="navigate to our list of policies &amp; procedures"
          >Policies &amp; Procedures</NuxtLink
        >
      </div>
    </div>
    <div class="grid gap-4 justify-center">
      <div
        id="social-area"
        class="flex flex-row gap-x-4 justify-between items-center mt-8"
      >
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
        <div id="social-icons" class="flex flex-row gap-x-4 justify-between">
          <NuxtLink
            to="https://www.instagram.com/absolutesport2211/"
            target="_blank"
            rel="noopener"
            aria-label="connect with us on instagram"
          >
            <font-awesome-icon
              :icon="['fab', 'instagram']"
              class="text-accent w-12 h-12"
          /></NuxtLink>
          <NuxtLink
            to="https://www.facebook.com/AbsoluteSport.AS"
            target="_blank"
            rel="noopener"
            aria-label="connect with us on facebook"
          >
            <font-awesome-icon
              :icon="['fab', 'facebook']"
              class="text-accent w-12 h-12"
          /></NuxtLink>
          <NuxtLink
            to="https://www.linkedin.com/in/ben-blakeley-b2600522b/"
            target="_blank"
            rel="noopener"
            aria-label="connect with us on linkedin"
          >
            <font-awesome-icon
              :icon="['fab', 'linkedin']"
              class="text-accent w-12 h-12"
          /></NuxtLink>
        </div>
      </div>
      <div id="recog-area" class="text-center my-8">
        <NuxtLink
          to="https://designdevelophost.co.uk"
          target="_blank"
          rel="noopener"
          aria-label="go to our web developer"
          >Website By Design Develop Host
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>
