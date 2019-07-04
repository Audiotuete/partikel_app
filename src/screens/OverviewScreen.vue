<template>
  <q-page v-if='currentUser' class="flex column justify-around">
    <div class="overlay-loading-long" v-if="$apollo.queries.currentUser.loading || isLoading">
      <q-spinner-ios color="grey-10" size="4em"/>
    </div>
    <div v-for="section in currentUser.currentChallenge.challengesectionSet.slice().reverse()" :key="section.id" class="">
      <span class="text-h4 text-weight-light q-mx-md">{{section.title}}</span>
      <q-scroll-area
        horizontal
        ref='scrollbars'
        style="width: 100vw;"
        class="bg-white-1 vertical-scroll-area"
      >
        <div class="row no-wrap card-container">
          <q-card 
          @click="goToLesson(unit)" 
          v-for="unit in section.challengesectionunitSet" 
          :key="unit.id"
          class="my-card"
          >
            <div class="overlay-not-viewed" v-if="!lessonsViewed.includes(parseInt(unit.id)) && !lessonsCompleted.includes(parseInt(unit.id))">
              <q-icon name="fas fa-lock-open" class="overlay-not-viewed-icon"></q-icon>
            </div>
            <q-icon name="fas fa-check" class="overlay-completed" v-if="lessonsCompleted.includes(parseInt(unit.id))"></q-icon>

            <img class='thumbnail' :src="unit.thumbnail.rendition.url">
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
    <!-- <q-page-sticky class='raise-it'  position="top-right" :offset="[18, 18]">
      <q-fab
        icon="add"
        direction="down"
        color="primary"
      >
        <q-fab-action @click="onClick()" color="primary" icon="person_add" />
        <q-fab-action @click="onClick()" color="primary" icon="mail" />
      </q-fab>
    </q-page-sticky> -->
  </q-page>
</template>


<script>
import CURRENT_USER from '../graphql/users/currentUser.gql'
import CHECK_CURRENT_USER from '../graphql/users/checkCurrentUser.gql'

import { setTimeout } from 'timers';


export default {
  name: 'overview-screen',
  data() {
    return {
      currentUser: {
        currentChallenge: {
          challengesectionSet: []
        }
      },
      tempLessonsViewed: [],
      rootURL: process.env.ROOT_API,
      isLoading: false,
      lessonsViewed: []
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
  computed: {
    lessonsCompleted(){
      return this.currentUser.lessonsCompleted

    }
  },
  methods: {
    goToLesson(unit) {
      this.getScrollPostitions()
      this.markLessonViewed(unit.id)

      this.$router.push({name: 'LessonScreen', params: {id: unit.id, unitData: unit, lessonsCompleted: this.currentUser.lessonsCompleted} })
    },
    onClick() {

    },
    markLessonViewed(id) {
      if (this.lessonsViewed) {
        if(!this.lessonsViewed.includes(parseInt(id))) {
          this.lessonsViewed.push(parseInt(id))
          localStorage.setItem('lessons_viewed', JSON.stringify(this.lessonsViewed))
        }
      } else {
        this.lessonsViewed.push(parseInt(id))
        return localStorage.setItem('lessons_viewed', JSON.stringify([parseInt(id)]))
      }
    },
    getScrollPostitions() {
      let scrollPositionsHorizontal = []
      for (let [index, scrollbar] of this.$refs.scrollbars.entries()) {
        scrollPositionsHorizontal.push(scrollbar.getScrollPosition())
      }
      localStorage.setItem('scroll_positions', JSON.stringify({
        scrollPositionVertical: window.pageYOffset, 
        scrollPositionsHorizontal: scrollPositionsHorizontal}))
    },
    resetScrollPostions() {
      let scrollPositions = JSON.parse(localStorage.getItem('scroll_positions'))
      if (scrollPositions) {
        setTimeout(() => window.scrollTo(0,scrollPositions.scrollPositionVertical), 0)
        setTimeout(() => {
          for (let [index, position] of scrollPositions.scrollPositionsHorizontal.entries()) {
            try {
              this.$refs.scrollbars[index].setScrollPosition(position)
            } catch (err) {
              // Ignore
            }
          }
        }, 0)
      } else {
        setTimeout(() => window.scrollTo(0,document.body.scrollHeight), 0)
      }
    },
  },
  created() {
    this.$apollo.query({
      query: CHECK_CURRENT_USER,
      fetchPolicy: 'no-cache',
    }).then((data) => {
        // Do nothing
    }).catch((error) => {
      // localStorage.removeItem(process.env.TOKEN_ID);
      localStorage.clear()
      location.reload()
    })
  },
  mounted() {
    this.isLoading = true
    setTimeout(() => {
      this.isLoading = false
    }, 1500)

    let tempLessonsViewed = JSON.parse(localStorage.getItem('lessons_viewed'))
    if (tempLessonsViewed) {
      this.lessonsViewed = tempLessonsViewed
    }
  },
  updated() {
    this.resetScrollPostions()
  },
  activated() {
    this.resetScrollPostions()
  },
  // deactivated() {
  //   setTimeout(() => window.scrollTo(0, 0), 100)
  // }

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

  .overlay-loading-long {
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
    background-color: white; 
    z-index: 3; 
    /* Duration must be indentical to animation duration */
    animation: 1.5s cubic-bezier(1,0,.25,.5) 0s 1 fadeIn;
  } 
  @keyframes fadeIn {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
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

  .overlay-not-viewed {
    position: absolute;
    display: flex;
    justify-content: center;
    // z-index: 0;
    min-width: 18rem;
    max-width: 18rem;
    height: 100%;
    background: rgba(0,0,0,0.6);

    .overlay-not-viewed-icon{
      top: 20%;
      color: rgba(255, 255, 255, 0.5);
      font-size: 4rem;
    }
  }


  .overlay-completed {
    z-index: 2;
    position: absolute;
    right: 5%;
    bottom: 18%;
    // FlatUI Dutch Palette
    color: #A3CB38; // Android Green
    font-size: 4rem;
    text-shadow: 0 0px 4px rgba(0, 148, 50, 0.7); // Pixelated Grass
    // animation-name: pulse;
    // animation-duration: 1s;
    // animation-iteration-count: 1;

    // @keyframes pulse {
    //   from { transform: scale(1); }
    //   50% { transform: scale(0.85); }
    //   to { transform: scale(1); }
    // }
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

