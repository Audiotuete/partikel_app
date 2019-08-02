<template>
  <q-page v-if="unitData" >
    <div v-show='leaveFullscreen' class="overlay-leaveFullscreen"></div>     
    <q-scroll-area style="width: 100vw; height: 100vh" :class="{'no-pointer-events' : isFullscreen}">
      <div class="flex column no-wrap">
        <q-img
          basic
          class='q-mb-lg'
          :src='unitData.thumbnail.rendition.url'
          style='width: 100%; max-height: 50vh'
        >
          <div class='absolute-bottom text-h6 text-left q-pa-sx'>
            {{unitData.title}}
          </div>
        </q-img>
        <div class='lesson-content-container q-mx-md q-mb-md' v-for='(element, index) in unitData.content' :key='index'>
          <span v-if="element.__typename == 'HeadingType'" v-html='element.value' class="lesson-heading"></span>
          <span v-else-if="element.__typename == 'ParagraphType'" v-html='element.value' class="text-body1 lesson-paragraph"></span>
          <q-img v-else-if="element.__typename == 'ImageType'" :src='element.imageData.rendition.url' class="lesson-image"></q-img>
          <div v-else-if="element.__typename == 'VideoType'" class="lesson-video-wrapper">
            <youtube id='video' :video-id='getYoutubeId(element.value)' :player-vars="playerVars" ref="youtube"></youtube>
          </div>
          <q-carousel v-else-if="element.__typename == 'GalleryType'"
            id='gallery'
            :class="{'fullscreen-gallery': isFullscreen}"
            arrows
            animated
            infinite
            swipeable
            v-model="slide"
            height="12rem"
          >

            <q-carousel-slide @click="toggleFullscreen()" class="lesson-image" v-for="(image, index) in element.galleryData" :key="index"  :name="index" :img-src="image.rendition.url">
              <base-custom-page-sticky v-show='isFullscreen' @click="toggleFullscreen()" :position="'top-left'" :offset="[16, 16]">
                <q-icon classf="nav-back-button-link" name="close" color="white" size="2rem"></q-icon>
              </base-custom-page-sticky> 
              <div class="absolute-bottom custom-caption">
                <div class="text-subtitle1 lesson-gallery-text">{{image.caption}}</div>
              </div>
            </q-carousel-slide>

          </q-carousel>
        </div>
        <div v-show='isFullscreen' style="height: 12rem">Placeholder to keep layout when carousel goes Fullscreen </div>


          <base-custom-page-sticky class="nav-back-button-container" :position="'top-left'" :offset="[16, 16]">
            <router-link  to="/overview" class="nav-back-button-link"><q-icon name="arrow_back" size="1.5rem"></q-icon></router-link>
          </base-custom-page-sticky>
          
          <q-btn v-if="!lessonsCompleted.includes(parseInt(unitData.id))" style="margin: 2rem 2rem 6rem 2rem" color='green' @click="markLessonCompleted(unitData.id, true)">Check</q-btn>
          <q-btn v-else style="margin: 2rem 2rem 6rem 2rem" color='white' text-color='black' @click="markLessonCompleted(unitData.id, false)">uncheck</q-btn>
      </div>
    </q-scroll-area>
  </q-page>
</template>


<script>
import UPDATE_USER_VIEWS from '../graphql/users/updateUserViews.gql'

export default {
  name: 'lesson-screen',
  props: ['unitData', 'lessonsCompleted'],
  data() {
    return {
      slide: 1,
      isFullscreen: false,
      leaveFullscreen: false,
      rootURL: process.env.ROOT_API,
      playerVars: {
        autoplay: 0,
        rel: 0,
        showinfo: 0,
        showsearch: 0,
        controls: 1,
        modestbranding: 1,
        cc_load_policy: 1,
        playsinline: 0,
      },
    }
  },
  computed: {
    player () {
      return this.$refs.youtube.player
    }
  },
  methods: {
    markLessonCompleted(id, completed) {
      let unitId = parseInt(id)
      if(!this.lessonsCompleted.includes(unitId) && completed){
        this.lessonsCompleted.push(unitId)
      } else {
        let idIndex = this.lessonsCompleted.indexOf(unitId)
        this.lessonsCompleted.splice(idIndex,1)
      }
      this.$router.push('/overview')
      this.$apollo.mutate({
        mutation: UPDATE_USER_VIEWS,
        variables: {
          challengeSectionUnitId: id,
          isCompleted: completed
        }
      }).then((data) => {
      }).catch((error) => {
        location.reload()
        // console.error(error)
      })
    },
    getYoutubeId(url){
      let ID = '';
      url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
      if(url[2] !== undefined) {
        ID = url[2].split(/[^0-9a-z_\-]/i);
        ID = ID[0];
      }
      else {
        ID = url;
      }
        return ID;
    },
    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen
      if(!this.isFullscreen) {
        this.leaveFullscreen = true
        setTimeout(() => {
          this.leaveFullscreen = false
        }, 100)
      }

    }

},
  mounted() {
    // setTimeout(() => window.scrollTo(0,0), 50)
    if (!this.$router.currentRoute.params.unitData) {
      this.$router.push('/overview')
    }
  },
  activated() {
    // setTimeout(() => window.scrollTo(0,0), 50)

    if (!this.$router.currentRoute.params.unitData) {
      this.$router.push('/overview')
    }
  }

}
</script>


<style lang='scss' scoped>

.lesson-content-container {
  max-width: 100vw;
  margin: 0 1.2rem 0.75rem 1.2rem;
}

.lesson-thumbnail {
  margin-bottom: 1.5rem;
}

.fullscreen-gallery{
  background: #121212;
  height: 100% !important;
  width: 100vw;
  position: fixed;
  z-index: 1000;
  left: 0;
  bottom: 0;
  pointer-events: all;
  opacity: 1;
  animation: 0.1s ease-out 0s 1 slideIn;
  
  @keyframes slideIn {
    0% {
      height: 12rem;
    }
    100% {
      height: 100%;
    }
  }

  // transition: height ease-in 0.3s;
}

.lesson-image {
  flex: 1;
  border-radius: 4px;
  overflow: hidden;
  background-size: cover !important;
  background-repeat: no-repeat;
}

@media (orientation: portrait) { 
  
  .lesson-image{
    max-height: 40vh;
  } 
}

.lesson-gallery-text{
  line-height: 1;
  font-size: 0.9rem;
}

.custom-caption {
  text-align: center;
  padding: 5px;
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
}

.lesson-video-wrapper {
  position: relative;
  padding-bottom: 56.5%; /* beWirken Ratio */
  height: 0;
  border-radius: 4px;
  overflow: hidden;
}

.overlay-leaveFullscreen {
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
  background-color: black; 
  z-index: 100; 
  /* Duration must be indentical to animation duration */
  animation: 0.1s ease-in 0s 1 fadeIn;
} 
@keyframes fadeIn {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}


</style>

