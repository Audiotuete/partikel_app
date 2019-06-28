<template>
  <q-page class="flex column justify-around">
    <div v-for="section in currentUser.currentChallenge.challengesectionSet.slice().reverse()" :key="section.id" class="">
      <span class="text-h4 text-weight-light">{{section.title}}</span>
      <q-scroll-area
      horizontal
      style="width: 100vw;"
      class="bg-white-1 vertical-scroll-area"
      >
        <div class="row no-wrap card-container">
          <q-card @click="goToLesson(unit)" v-for="unit in section.challengesectionunitSet" :key="unit.id" class="my-card ">
            <!-- <div class="overlay-viewed" v-if="currentUser.lessonsViewed.includes(parseInt(unit.id))"></div> -->
            <img class='thumbnail' :src="rootURL + unit.thumbnail.rendition.url">
              <!-- <div class="absolute-bottom text-subtitle2 text-center">
                Title
              </div> -->
            
            <q-card-section class="card-section" align="around">
              <div class="text-body1 text-left">{{unit.title}}</div>
            </q-card-section>
   
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
    <q-page-sticky class='raise-it'  position="top-right" :offset="[18, 18]">
      <q-fab
        icon="add"
        direction="down"
        color="primary"
      >
        <q-fab-action @click="onClick()" color="primary" icon="person_add" />
        <q-fab-action @click="onClick()" color="primary" icon="mail" />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>


<script>
import CURRENT_USER from '../graphql/users/currentUser.gql'

export default {
  name: 'overview-screen',
  data() {
    return {
      currentUser: {
        currentChallenge: {
          challengesectionSet: []
        }
      },
      rootURL: process.env.ROOT_API
    }
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER,
      fetchPolicy: 'cache-and-network',
      // update(data) {
      //   return data.currentUser
      // }
    }
  },
  methods: {
    goToLesson(unit) {
      this.$router.push({name: 'LessonScreen', params: {id: unit.id, data: unit} })
    },
    onClick() {
      console.log(this.currentUser)
    }
  },
  updated() {
    window.scrollTo(0,document.body.scrollHeight);
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
  min-width: 18rem;
  max-width: 18rem;
  min-height: 14rem;
  // min-width: 80vw;
  // max-width: 80vw;
  overflow: hidden;

  .overlay-viewed {
    position: absolute;
    // z-index: 0;
    min-width: 18rem;
    max-width: 18rem;
    height: 100%;
    background: rgba(0,0,0,0.5)
  }

  .thumbnail {
    max-height: 10rem;
    object-fit: cover;
  }

  .card-section {
    // z-index: 0;
    background: #fff;
    display: flex;
    // justify-content: center;
    align-items: center;
    min-height: 4rem;
    padding: 0 1rem;
  }

  .raise-it{
    position: absolute;
    z-index: 1 !important;
  }
 }
</style>

