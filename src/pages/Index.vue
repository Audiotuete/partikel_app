<template>
  <q-page class="flex column justify-around">
    <div v-for="n in 4" :key="n" class="">
      <span class="text-h4 text-weight-light">Hello</span>
      <q-scroll-area
      horizontal
      style="width: 100vw;"
      class="bg-white-1 vertical-scroll-area"
      >
        <div class="row no-wrap card-container">
          <q-card v-for="n in 2" :key="n" class="my-card ">
            <img src="http://www.elementsofstyleblog.com/wp-content/uploads/2010/02/600x400-princeville-sunset.jpg">
            <q-card-actions align="around">
              <q-btn flat round color="red" icon="favorite" />
              <q-btn flat round color="teal" icon="bookmark" />
              <q-btn flat round color="primary" icon="share" />
            </q-card-actions>
          </q-card>
        </div>
      </q-scroll-area>
      <!-- <q-header>
        <q-tabs
          v-model="tab"
          align="justify"
          class="text-white bg-gray-1"
        >
          <q-tab :ripple="{ color: 'orange' }" name="mails" icon="mail" label="Mails" />
          <q-tab :ripple="{ color: 'orange' }" name="alarms" icon="alarm" label="Alarms" />
          <q-tab :ripple="{ color: 'orange' }" name="movies" icon="movie" label="Movies" />
        </q-tabs>
    </q-header> -->
    </div>
    <q-page-sticky position="top-right" :offset="[18, 18]">
      <q-fab
        icon="add"
        direction="down"
        color="primary"
      >
        <q-fab-action @click="onClick" color="primary" icon="person_add" />
        <q-fab-action @click="onClick" color="primary" icon="mail" />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>


<script>
export default {
  name: 'PageIndex',
  data() {
    return {
      tab: ''
    }
  },
  methods: {
    onClick() {
      console.log('Hello')
    }
  }
}
</script>


<style lang="scss" scoped>
 .card-container {
   &::before {
     content: 'W';
     color: transparent;
   }
   &::after {
     content: 'W';
     color: transparent;
   }
 }



 .my-card {
  margin: 0.5rem;
  /* margin-bottom: 1rem; */
  min-width: 80vw;
 }
</style>

