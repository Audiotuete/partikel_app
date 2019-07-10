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

html, body {
  // &::-webkit-scrollbar {
  //   display: none;
  // }
}

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

    &::-webkit-scrollbar {
      display: none;
    }
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

.scroll {
  &::-webkit-scrollbar {
    display: none;
  }
}


</style>
