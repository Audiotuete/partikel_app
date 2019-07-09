<template>

  <q-page v-if='currentUser' class="flex column">
    <div class="overlay-loading-long" v-if="$apollo.queries.currentUser.loading || isLoading">
      <q-spinner-ios color="grey-10" size="4em"/>
    </div>

    <q-stepper
      v-model="currentStep"
      animated
      header-nav
      keep-alive
      contracted
      @input="getScrollPositions()"
    >
 
      
      <q-step v-for="(section, index) in currentUser.currentChallenge.challengesectionSet.slice()" :key="section.id"
        title=""
        :name="index"
        :active-icon="isLocked(section.hardlockDuration) ? 'fas fa-lock' : 'filter_' + (index+1) "
        :icon="isLocked(section.hardlockDuration) ? 'fas fa-lock' : 'filter_' + (index+1)"
      >


        <q-scroll-area
          horizontal
          ref='scrollareas'
          style="width:100vw;"
   
        >
        <div v-if="!isLocked(section.hardlockDuration)" class="row no-wrap card-container">
            <q-card
            @click="goToLesson(unit)" 
            v-for="unit in section.challengesectionunitSet" 
            :key="unit.id"
            class="my-card"
            >
              <div v-if="!lessonsViewed.includes(parseInt(unit.id)) && !lessonsCompleted.includes(parseInt(unit.id))" class="overlay-not-viewed">
                <q-icon name="fas fa-lock-open" class="overlay-not-viewed-icon"></q-icon>
              </div>
              <q-icon name="fas fa-check" class="overlay-completed" v-if="lessonsCompleted.includes(parseInt(unit.id))"></q-icon>

              <img class='thumbnail' :src="unit.thumbnail.rendition.url">

              <q-card-section class="card-section" align="around">
                <div class="text-body1 text-left">{{unit.title}}</div>
              </q-card-section>
      
    
            </q-card>
          </div>
          <div v-else class="row no-wrap card-container">
            <q-card
            v-for="unit in section.challengesectionunitSet" 
            :key="unit.id"
            class="my-card"
            >
              <div class="overlay-locked">
                <q-icon name="fas fa-lock" class="overlay-locked-icon"></q-icon>
              </div>

              <div class='thumbnail'></div>

              <q-card-section class="card-section" align="around">
                <div class="text-body1 text-left">{{unit.title}}</div>
              </q-card-section>
      
    
            </q-card>
          </div>
          <q-scroll-observer horizontal debounce="250" @scroll="setScrollPositions" />
        </q-scroll-area> 
      </q-step>
    </q-stepper>

    <q-page-sticky class='raise-it'  position="bottom-right" :offset="[18, 18]">
      <q-fab
        icon="menu"
        direction="up"
        color="primary"
        text-color="white"
      >
        <q-fab-action @click="onClick()" color="primary" text-color="white" icon="person_add" />
        <q-fab-action @click="onClick()" color="primary" text-color="white" icon="mail" />
      </q-fab>
    </q-page-sticky>
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
      rootURL: process.env.ROOT_API,
      isLoading: false,
      lessonsViewed: [],
      currentStep: 0,
      scrollPositionsHorizontal: {},
      // activeScrollIndicators: {left: false, right: false}
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
    },
  },
  methods: {
    goToLesson(unit) {
      this.markLessonViewed(unit.id)
      this.$router.push({name: 'LessonScreen', params: {id: unit.id, unitData: unit, lessonsCompleted: this.currentUser.lessonsCompleted} })
    },
    onClick(value) {

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

    setScrollPositions(event) {        

      for (let [index, scrollarea] of this.$refs.scrollareas.entries()) {
        if(!scrollarea._inactive) {
          this.scrollPositionsHorizontal[scrollarea._uid] = event.position
        }
      }
    // Only Userfull with reload (when Vue Instance is destroyed)
      // localStorage.setItem('nav_positions', JSON.stringify({
      //   scrollPositionsHorizontal: this.scrollPositionsHorizontal}))
    },
    getScrollPositions() {
      // Only Userfull with reload (when Vue Instance is destroyed)
      // let navPositions = JSON.parse(localStorage.getItem('nav_positions'))
        setTimeout(() => {
          for (const [index, position] of Object.entries(this.scrollPositionsHorizontal)) {
            try {
              this.$refs.scrollareas.find(bar => { return bar._uid == index}).setScrollPosition(position)
            } catch (err) {
              // console.log(err)
              // Ignore
            }
          }
        }, 100)
    },
    isLocked(days) {
      if ((Date.parse(this.currentUser.dateJoined) + (days * 24 * 60 * 60 * 1000) - Date.now()) <= 0) {
        return false 
      } else {
        return true
      }
    },
    
  },
  created() {
    this.$apollo.query({
      query: CHECK_CURRENT_USER,
      fetchPolicy: 'no-cache',
    }).then((data) => {


    }).catch((error) => {
      localStorage.clear()
      location.reload()
    })

  },
  mounted() {
    localStorage.removeItem('nav_positions')
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

  },
  activated() {
    this.getScrollPositions()
  },
  deactivated() {
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
    animation: 1.5s ease-in 0s 1 fadeIn;
  } 
  @keyframes fadeIn {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  

  .raise-it{
    z-index: 100;
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


  .overlay-locked {
    position: absolute;
    display: flex;
    justify-content: center;
    z-index: 3;
    min-width: 18rem;
    max-width: 18rem;
    height: 100%;
    background: rgba(0,0,0,0.85);

    .overlay-locked-icon{
      top: 25%;
      color: rgba(255, 255, 255, 0.3);
      font-size: 4rem;
    }
  }

  .overlay-not-viewed {
    position: absolute;
    display: flex;
    justify-content: center;
    // z-index: 0;
    min-width: 18rem;
    max-width: 18rem;
    height: 100%;
    background: rgba(0,0,0,0.5);

    .overlay-not-viewed-icon{
      top: 20%;
      color: rgba(255, 255, 255, 0.75);
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
    text-shadow: 0 0px 4px rgba(0, 148, 49, 0.5); // Pixelated Grass
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
    min-height: 10rem;
    object-fit: cover;
    background: #000;
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
 }
  
</style>

