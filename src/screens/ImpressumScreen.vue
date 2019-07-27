<template>
  <q-page style="padding: 4rem 0 2.25rem 0" class='flex column no-wrap'>
    <div class='impressum-content-container q-mx-md q-mb-md' v-for='(element, index) in impressumData' :key='index'>
      <span v-if="element.__typename == 'HeadingType'" v-html='element.value' class="impressum-heading"></span>
      <span v-else-if="element.__typename == 'ParagraphType'" v-html='element.value' class="text-body2 impressum-paragraph"></span>
      <q-img v-else-if="element.__typename == 'ImageType'" :src='element.imageData.rendition.url' class="impressum-image"></q-img>
      <div v-else-if="element.__typename == 'VideoType'" class="impressum-video-wrapper">
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
        <q-carousel-slide class="impressum-image" v-for="(image, index) in element.galleryData" :key="index"  :name="index" :img-src="image.rendition.url">
          <div class="absolute-bottom custom-caption">
            <div class="text-subtitle1 lesson-gallery-text">{{image.caption}}</div>
          </div>
        </q-carousel-slide>

      </q-carousel>
    </div>
    <base-custom-page-sticky class='nav-back-button-container'  :position="'top-left'" :offset="[16, 16]">
      <router-link  to="/overview" class="nav-back-button-link"><q-icon name="arrow_back" size="1.5rem"></q-icon></router-link>
    </base-custom-page-sticky>
  </q-page>
</template>

<script>
export default {
  name: 'impressum-screen',
  props: ['impressumData'],
  data() {
    return {
      
    }
  },
  mounted() {
    if (!this.$router.currentRoute.params.impressumData) {
      this.$router.push('/overview')
    }
  },
  activated() {
    if (!this.$router.currentRoute.params.impressumData) {
      this.$router.push('/overview')
    }
  }
}
</script>

<style>
.impressum-content-container {
  max-width: 100vw;
  margin: 0 1.6rem 0.5rem 1.6rem;
}

.impressum-heading > h2 {
  font-size: 1.2rem;
}
</style>

