<template>
  <div id="q-app">

    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isLoading: false
    }
  },

} 
</script>

<style>
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

iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

  .q-stepper {
    max-width: 100vw;
    border-radius: 0;
    box-shadow: none;
    background: transparent
  }

  .q-stepper__dot {
    height: 2rem;
    width: 2rem;
    font-size: 1rem;
  }

.q-stepper--horizontal .q-stepper__step-inner {
  padding: 0;
}


</style>
