<template>
  <q-layout view="lHh lpr lFf">
    <q-page-container>
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
</style>
