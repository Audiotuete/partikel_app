<template>
  <q-page v-if="unitData" class='flex column no-wrap'>
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
        <youtube id='video-player' :video-id='getYoutubeId(element.value)' :player-vars="playerVars" ref="youtube"></youtube>
      </div>
      
      <q-carousel v-else-if="element.__typename == 'GalleryType'"
        class="gallery"
        arrows
        animated
        infinite
        v-model="slide"
        height="12rem"
      >
        <q-carousel-slide class="lesson-image" v-for="(image, index) in element.galleryData" :key="index"  :name="index" :img-src="image.rendition.url">
          <div class="absolute-bottom custom-caption">
            <div class="text-subtitle1 lesson-gallery-text">{{image.caption}}</div>
          </div>
        </q-carousel-slide>

      </q-carousel>
    </div>
      <q-page-sticky class='nav-back-button-container'  position="top-left" :offset="[16, 36]">
        <router-link  to="/overview" class="nav-back-button-link"><q-icon name="arrow_back" size="1.5rem"></q-icon></router-link>
      </q-page-sticky>
    <q-btn v-if="!lessonsCompleted.includes(parseInt(unitData.id))" style="margin:  2rem 2rem 4rem 2rem" color='green' @click="markLessonCompleted(unitData.id, true)">Check</q-btn>
    <q-btn v-else style="margin: 2rem 2rem 4rem 2rem" color='white' text-color='black' @click="markLessonCompleted(unitData.id, false)">uncheck</q-btn>

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
      rootURL: process.env.ROOT_API,
      playerVars: {
        autoplay: 0,
        rel: 0,
        showinfo: 0,
        showsearch: 0,
        controls: 1,
        modestbranding: 1,
        cc_load_policy: 1
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
        this.$apollo.mutate({
          mutation: UPDATE_USER_VIEWS,
          variables: {
            challengeSectionUnitId: id,
            isCompleted: completed
          }
        }).then((data) => {
          this.$router.push('/overview')
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
// .lesson-back-button-container {
//   height: 3em;
//   width: 3em;
//   min-width: 3em;
//   min-height: 3em;
//   border-radius: 50%;
//   background: white;
//   box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
// }

// .lesson-back-button-link {
//   padding: 1.5rem 0.6rem;
//   text-decoration: none;
//   color: #000000;
// }

.lesson-content-container {
  max-width: 100vw;
  margin: 0 1.2rem 0.75rem 1.2rem;
}

.lesson-thumbnail {
  margin-bottom: 1.5rem;
}

.lesson-image {
  border-radius: 4px;
  overflow: hidden;
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


</style>

