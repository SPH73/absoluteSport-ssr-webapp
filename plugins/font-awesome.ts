import { library, config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons'

export default defineNuxtPlugin((nuxtApp) => {
  library.add(faBars, faXmark, faFacebook, faInstagram, faLinkedin)
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
 })
