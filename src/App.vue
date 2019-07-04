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

</style>
