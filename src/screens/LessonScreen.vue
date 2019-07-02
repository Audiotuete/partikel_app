<template>
  <q-page class='flex column no-wrap'>
    <q-img v-if="data.thumbnail.rendition.url"
      basic
      class='q-mb-lg'
      :src='data.thumbnail.rendition.url'
      style='width: 100%'
    >
      <div class='absolute-bottom text-h6 text-left q-pa-xs'>
        {{data.title}}
      </div>
    </q-img>
    <div class='lesson-content-container q-mx-md q-mb-md' v-for='(element, index) in data.content' :key='index'>
      <span v-if="element.__typename == 'HeadingType'" v-html='element.value' class="lesson-heading"></span>
      <span v-else-if="element.__typename == 'ParagraphType'" v-html='element.value' class="text-body1 lesson-paragraph"></span>
      <q-img v-else-if="element.__typename == 'ImageType'" :src='element.imageData.rendition.url' class="lesson-image"></q-img>
      <div v-else-if="element.__typename == 'VideoType'" class="lesson-video-wrapper">
        <youtube :video-id='getYoutubeId(element.value)' :player-vars="playerVars" ref="youtube"></youtube>
      </div>
      
      <q-carousel v-else-if="element.__typename == 'GalleryType'"
        class="gallery"
        arrows
        animated
        infinite
        v-model="slide"
        height="32vh"
      >
        <q-carousel-slide class="lesson-image" v-for="(image, index) in element.galleryData" :key="index"  :name="index" :img-src="image.rendition.url">
          <div class="absolute-bottom custom-caption">
            <div class="text-subtitle1 lesson-gallery-text">{{image.caption}}</div>
          </div>
        </q-carousel-slide>

      </q-carousel>
    </div>
    <q-btn to="/overview" class="lesson-back-button" round color="white" text-color="black" icon="arrow_back" />
  </q-page>
</template>


<script>

export default {
  name: 'lesson-screen',
  props: ['data'],
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
    if (!this.$router.currentRoute.params.data) {
      this.$router.push('/overview')
    }
  }
}
</script>


<style lang='scss' scoped>
.lesson-back-button {
  position: absolute;
  top: 1rem;
  left: 1rem;
}

.lesson-content-container {
  max-width: 100vw;
  margin: 0 1rem 0.75rem 1rem;
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

