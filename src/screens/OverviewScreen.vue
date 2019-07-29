<template>
  <q-page v-if='currentUser' class="flex">

    <div class="overlay-loading-long" v-if="$apollo.queries.currentUser.loading || isLoading">
      <q-spinner-tail color="primary" size="4em"/>
    </div>

    <div 
      class="top-bar raise-it" 
      v-touch-swipe.mouse.down="toggleSectionOverview"
    />

    <q-stepper
      v-model="currentStep"
      animated
      header-nav
      keep-alive
      contracted
      swipeable
      @input="getScrollPositions()"
    >
      
      <q-step v-for="(section, index) in activeChallengeSections" :key="section.id"
        title=""
        :name="index"
      >

        <q-scroll-area
          ref='scrollareas'
          :style="{width: '100vw', height: scrollAreaHeight + 'px'}"
          class=""
        >
          <div v-if="!isLocked(section.hardlockDuration)" class="card-container">
            <q-card
              @click="goToLesson(unit)" 
              v-for="unit in section.challengesectionunitSet" 
              :key="unit.id"
              class="my-card"
            >
              <div v-if="!lessonsViewed.includes(parseInt(unit.id)) && !lessonsCompleted.includes(parseInt(unit.id))" class="overlay-not-viewed">
                <!-- gem, eye, carrot, brain, concierge-bell, ice-cream, mask, bolt, paw, parachute-box, seedling  -->
                <q-icon name="fas fa-seedling" class="overlay-not-viewed-icon"></q-icon>
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
          <q-scroll-observer debounce="250" @scroll="setScrollPositions" />
        </q-scroll-area> 
      </q-step>
    </q-stepper>

    <base-custom-page-sticky class="raise-it" :position="'top-left'" :offset="[14, 24]">
      <q-btn-group rounded>
        <q-btn 
          @click="showSectionOverview = true"
          v-touch-swipe.mouse.down="toggleSectionOverview"
          style="font-weight: bold" 
          color="primary" 
          text-color="white"
          rounded 
          :label="'Woche ' + parseInt(currentStep + 1)" 
        />
      </q-btn-group>
    </base-custom-page-sticky>

    <q-dialog v-model="showSectionOverview" position="top">
      <q-card class="dialog-card" v-touch-swipe.mouse="toggleSectionOverview">
        <q-card-section style="padding-top: 2rem">
          <div class="text-h6 text-center">Wochenübersicht</div>
        </q-card-section>

        <q-card-section class="dialog-button-container">
          <q-btn 
            v-for="(section, index) in activeChallengeSections" :key="section.id"
            :label="isLocked(section.hardlockDuration) ? '' : index + 1"
            :icon="isLocked(section.hardlockDuration) ? 'fas fa-lock' : ''"
            :size="isLocked(section.hardlockDuration) ? '4vw' : '5vw'"
            :color="isLocked(section.hardlockDuration) ? 'grey-6' : 'primary'"
            :text-color="isLocked(section.hardlockDuration) ? 'grey-2' : 'white'"
            @click="selectSection(section, index)"
            class="dialog-buttons"
            push
            v-close-popup
            >
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
    <base-custom-page-sticky class="raise-it"  :position="'top-right'" :offset="[18, 14]">
      <q-fab
        icon="menu"
        direction="down"
        color="primary"
        text-color="white"
      >
        <q-fab-action @click="goToImpressum()" color="primary" text-color="white" icon="info" />
        <!-- <q-fab-action @click="onClick()" color="primary" text-color="white" icon="mail" /> -->
      </q-fab>
    </base-custom-page-sticky>

  </q-page>
</template>


<script>

import CURRENT_USER from '../graphql/users/currentUser.gql'
import CHECK_CURRENT_USER from '../graphql/users/checkCurrentUser.gql'

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
      showSectionOverview: false,
      lessonsViewed: [],
      currentStep: 0,
      scrollPositionsHorizontal: {},
      scrollAreaHeight: 0,
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
    processMode() {
      return process.env.MODE
    },
    activeChallengeSections() {
      return this.currentUser.currentChallenge.challengesectionSet.slice().filter((section) => {
        return section.isPublic
      })
  
    },
    lessonsCompleted() {
      return this.currentUser.lessonsCompleted
    },

  },
  methods: {
    goToLesson(unit) {
      this.markLessonViewed(unit.id)
      this.$router.push({name: 'LessonScreen', params: {id: unit.id, unitData: unit, lessonsCompleted: this.currentUser.lessonsCompleted} })
    },
    goToImpressum() {
      this.$router.push({name: 'ImpressumScreen', params: {impressumData: this.currentUser.currentChallenge.impressum} })
    },
    toggleSectionOverview(event) {
      this.showSectionOverview = !this.showSectionOverview 
    },
    selectSection(section, index) {
      this.currentStep = index
      this.getScrollPositions()

      // if (this.isLocked(section.hardlockDuration)) {
      //   alert('Is still locked')
      // }

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
        }, 10)
    },
    isLocked(days) {
      // 24 * 60 * 60 * 1000 = 86400000
      if ((Date.parse(this.currentUser.dateJoined) + (days * 86400000) - Date.now()) <= 0) {
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

    this.scrollAreaHeight = document.querySelector('.q-stepper__content').offsetHeight + 1
  },
  updated() {

  },
  activated() {
    this.scrollAreaHeight = document.querySelector('.q-stepper__content').offsetHeight + 1
    this.getScrollPositions()
  },
  deactivated() {
  }

}
</script>

<style lang="scss" scoped>

  .top-bar {
    min-height: 2.5rem;
    width: 100%;
    position: fixed;
    background: #ffffff;
    box-shadow: 0 4px 2px -2px rgba(0, 0, 0, .35);
  }

  .card-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    &::before {
      content: '-';
      height: 5rem;
      color: transparent;
    }
    &::after {
      content: '-';
      height: 4rem;
      color: transparent;
    }

  }

    .dialog-card {
      min-width: 95vw;
      max-width: 95vw;
      padding: 6vh 5vw 2.5vh 5vw;
    }

    .dialog-button-container {
      display: grid;
      grid-template-columns: 25% 25% 25% 25%;
    }

    .dialog-buttons {
      width: 14vw;
      height: 14vw;
      // font-size: 4.25vw;
      font-weight: 900;
      margin: 2.25vw;

      // :nth-child(2) {
      //   line-height: 0;
      // }
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
    z-index: 100; 
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
    z-index: 10;
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

