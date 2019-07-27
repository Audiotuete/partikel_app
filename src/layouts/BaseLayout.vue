<template>
  <q-layout view="lHh lpr lFf">
    <q-page-container >
      <div v-if="processMode == 'cordova'" class="statusbar-spacer"></div>
      <div v-show='isLoading' class="overlay-loading">        
        <q-spinner-puff color="grey-10" size="30em"/>
      </div>
      <keep-alive :max="10">
        <DesktopWarning v-if='(!$q.platform.is.mobile) && ($q.screen.width > 1024)'><QBtn color="primary" style='width: 16rem; margin-top: 1rem;' @click='openMobileWindow()'>Mobile Ansicht öffnen</QBtn></DesktopWarning>
        <router-view v-else id='router-view' :key="$route.fullPath" v-show="isPortrait || hasIframe"></router-view>
      </keep-alive>

      <!-- Shown when phone is in landscape mode -->
      <LandscapeWarning v-show='!isPortrait && !hasIframe'></LandscapeWarning>
    </q-page-container>
  </q-layout>
</template>



<script>
import LandscapeWarning from '../components/pages/LandscapeWarning'
import DesktopWarning from '../components/pages/DesktopWarning'

import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
  components: {LandscapeWarning, DesktopWarning},
  data () {
    return {
      allUsers: [],
      isPortrait: true,
      isMobile: false,
      isLoading: false,
      hasIframe: false,
      processMode: process.env.MODE
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
  updated() {
    if(document.getElementById('video-player')){
      this.hasIframe = true
    } else {
      this.hasIframe = false
    }
  },
  created() {
    window.addEventListener('orientationchange', () => this.checkWindow(), false)
    window.addEventListener("resize", () => this.checkWindow(), false)

  },
  mounted() {
    if(process.env.MODE == 'cordova') {
      StatusBar.overlaysWebView(true)
      StatusBar.backgroundColorByHexString("#000")
    }
  },
  destroyed() {
    window.removeEventListener('orientationchange', () => this.checkWindow(), false)
    window.removeEventListener("resize", () => this.checkWindow(), false) 
  },
}
</script>

<style>

.statusbar-spacer {
  min-height: 1.5rem;
  background: #ffffff;
  box-shadow: 0 0px 4px rgba(0, 0, 0, .35);
}

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
  z-index: 100; 
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
