<template>
  <q-page class="flex column justify-around">
    {{lessonsViewed}}
    <div v-for="section in currentUser.currentChallenge.challengesectionSet.slice().reverse()" :key="section.id" class="">
      <span class="text-h4 text-weight-light q-mx-md">{{section.title}}</span>
      <q-scroll-area
        horizontal
        ref='scrollbars'
        style="width: 100vw;"
        class="bg-white-1 vertical-scroll-area"
      >
        <div class="row no-wrap card-container">
          <q-card @click="goToLesson(unit)" v-for="unit in section.challengesectionunitSet" :key="unit.id" class="my-card ">
            <div class="overlay-viewed" v-if="!lessonsViewed.includes(parseInt(unit.id))"></div>
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
import UPDATE_USER_VIEWS from '../graphql/users/updateUserViews.gql'
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

      this.$router.push({name: 'LessonScreen', params: {id: unit.id, data: unit} })
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
    // markLessonCompleted(unit, completed=false) {
    //   if(!this.lessonsViewed.includes(parseInt(unit.id))) {
    //     this.lessonsViewed.push(parseInt(unit.id))
    //     // localStorage.setItem('lessons_viewed', JSON.stringify(this.lessonsViewed))
    //     this.$apollo.mutate({
    //       mutation: UPDATE_USER_VIEWS,
    //       variables: {
    //         challengeSectionUnitId: unit.id,
    //         isCompleted: completed
    //       }
    //     }).then((data) => {

    //     }).catch((error) => {
    //       // Error
    //       console.error(error)
    //     })
    //   }
    // },
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

