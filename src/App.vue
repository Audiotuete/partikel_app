<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
} 
</script>

<style lang='scss'>

// body {
//   position: fixed;
//   top: 0;
//   bottom: 0;
//   left: 24px;
//   right: 24px;
// }

h2 {
  font-size: 1.1rem;
  padding: 0;
  margin: 0.75rem 0 0 0 ;
  font-weight: 500;
  line-height: 1.3;
}

p {
  margin: 0
}

p + p {
  margin-top: 0.75rem
}

a {
  text-decoration: none
}

iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

// Q-Stepper costumisation

.q-stepper {
  display: flex;
  flex-direction: column;
  max-width: 100vw;
  border-radius: 0;
  box-shadow: none;
  background: transparent
}

.q-stepper__header {
  flex: 1;
  /* width: 200vw; */
  /* float:left; */
  // min-height: 72px !important;
  flex-wrap: nowrap;
  overflow-x: scroll;
  overflow-y: hidden;

  // justify-content: space-between;
  /* padding: 0 10%; */
  -webkit-overflow-scrolling: touch;

  // &::-webkit-scrollbar {
  //   display: none;
  // }
}
.q-stepper__content {
  flex: 7;
  border-bottom: 1px solid rgba(0,0,0,0.12)
}

.q-stepper__tab {
  // display: flex;
  min-width: 24% !important;
  padding: 0 !important; 


  &:last-child {
    padding-right: 
    .5vw !important;
  }
  &:first-child {
    padding-left: 
    .5vw !important;
  }
}

.q-stepper__dot {
  height: 2rem;
  width: 2rem;
  font-size: 1rem;
}

.q-stepper--horizontal .q-stepper__step-inner {
  padding: 0;
}

// Custom nav back button

.nav-back-button-container {
  height: 3em;
  width: 3em;
  min-width: 3em;
  min-height: 3em;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
}

.nav-back-button-link {
  padding: 1.5rem 0.6rem;
  text-decoration: none;
  color: #000000;
}




</style>
