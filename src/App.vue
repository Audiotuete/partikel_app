<template>
  <div id="q-app">
    <router-view v-if="isOnline" />
    <OfflineWarning v-else />
  </div>
</template>

<script>
import OfflineWarning from "./components/pages/OfflineWarning";
import { setTimeout } from "timers";

export default {
  name: "App",
  components: { OfflineWarning },
  data() {
    return {
      isOnline: true
    };
  },
  created() {
    if (process.env.MODE == "cordova") {
      this.isOnline = navigator.connection.type != "none";
    }
  }
};
</script>

<style lang='scss'>
html,
body {
  overflow: hidden;
  position: relative;
  height: 100%;
  background: transparent;
}

h2 {
  font-size: 1.1rem;
  padding: 0;
  margin: 0.75rem 0 0 0;
  font-weight: 500;
  line-height: 1.3;
}

p {
  margin: 0;
}

p + p {
  margin-top: 0.75rem;
}

a {
  outline: none!important;
  text-decoration: none;
  color: #e94f35;
}

iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}



// Q-Diaglog costumisation

.fixed-top {
  top: -1.5rem;
}

// Q-Img costumisation

.q-img__content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
}

// Q-Stepper costumisation

.q-stepper {
  display: flex;
  flex-direction: column;
  max-width: 100vw;
  border-radius: 0;
  box-shadow: none;
  background: #fff;
}

.q-stepper__header {
  // flex: 1.5;
  display: none;
  // z-index: 1;
  // min-height: 2.5rem !important;
  // border: none;
  // box-shadow: 0 0px 4px rgba(0, 0, 0, .35);
  // width: 200vw;
  // flex-wrap: nowrap;
  // overflow-x: scroll;
  // overflow-y: hidden;
  // justify-content: space-between;
  //  padding: 0 10%;
  // -webkit-overflow-scrolling: touch;

  // &::-webkit-scrollbar {
  //   display: none;
  // }
}
.q-stepper__content {
  flex: 1;
  // border-bottom: 1px solid rgba(0, 0, 0, 0.75)
}

.q-stepper__tab {
  display: none;
  // min-width: 24% !important;
  // padding: 0 !important;

  // &:last-child {
  //   padding-right:
  //   .5vw !important;
  // }
  // &:first-child {
  //   padding-left:
  //   .5vw !important;
  // }
}

.q-stepper__dot {
  height: 2rem;
  width: 2rem;
  font-size: 1rem;
}

.q-stepper--horizontal .q-stepper__step-inner {
  padding: 0;
}

// QCarousel - Pannel Cusomisation

.q-panel {
  display: flex;
  align-items: center;
}
</style>
