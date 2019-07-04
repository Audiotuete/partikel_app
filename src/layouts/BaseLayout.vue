<template>
  <q-layout view="lHh lpr lFf">
    <q-page-container>
      <div v-show='isLoading' class="overlay-loading">        
        <q-spinner-puff color="grey-10" size="30em"/>
      </div>
      <keep-alive :max="10">
      <!-- <DesktopWarning v-if='!isMobile'><BaseButton style='width: 16rem' @click='openMobileWindow()'>Mobile Ansicht öffnen</BaseButton></DesktopWarning> -->
        <router-view id='router-view' :key="$route.fullPath" v-show='isPortrait'></router-view>
      </keep-alive>

      <!-- Shown when phone is in landscape mode -->
      <LandscapeWarning v-show='!isPortrait'></LandscapeWarning>
    </q-page-container>
  </q-layout>
</template>



<script>
import LandscapeWarning from '../components/pages/LandscapeWarning'
// import DesktopWarning from '../components/pages/DesktopWarning'

import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
  components: {LandscapeWarning},
  data () {
    return {
      allUsers: [],
      isPortrait: true,
      isMobile: false,
      isLoading: false,
    }
  },
  watch:{
    $route(to, from) {
      this.isLoading = true
      setTimeout(() => {
        this.isLoading = false
        }, 500)
    }
  }, 
  methods: {
    checkWindow() {
      if(Math.abs(window.orientation) === 90) {
        this.isPortrait = false
      } else {
        this.isPortrait = true
      }
    },
    openMobileWindow() {
      window.open(window.location.href, "", "width=400, height=720") // Opens a new window
    }
  },
  created() {
    window.addEventListener('orientationchange', () => this.checkWindow(), false)
    window.addEventListener("resize", () => this.checkWindow(), false)
    
    if(navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
      || window.innerWidth < 1024) {
        this.isMobile = true
      }
    // else if( navigator.userAgent.match(/Windows/i) 
    //   || navigator.userAgent.match(/X11/i)
    //   || navigator.userAgent.match(/Macintosh/i)
    //   || navigator.userAgent.match(/Mac/i)
    //   || navigator.userAgent.match(/Ubuntu/i)
    //   || navigator.userAgent.match(/CrOS/i)) {
    //     console.log("false")
    //     this.isMobile = false
    //   }
  },

  destroyed() {
    window.removeEventListener('orientationchange', () => this.checkWindow(), false)
    window.removeEventListener("resize", () => this.checkWindow(), false) 
  },
}
</script>

<style>

.overlay-loading {
  position: fixed; /* Sit on top of the page content */
  display: flex; 
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%; 
  top: 0; 
  left: 0;
  right: 0;
  bottom: 0;
  background-color: black; 
  z-index: 2; 
  /* Duration must be indentical to animation duration */
  animation: 0.5s ease-in 0s 1 fadeIn;
} 
@keyframes fadeIn {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

</style>
