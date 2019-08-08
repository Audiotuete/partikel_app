<template>
  <q-page class="flex column no-wrap">
    <q-scroll-area v-if="impressumData" style="width: 100vw; height: 100vh;">
      <div
        class="impressum-content-container q-mx-md q-mb-md"
        v-for="(element, index) in impressumData.data"
        :key="index"
      >
        <span
          v-if="element.__typename == 'HeadingType'"
          v-html="element.value"
          class="impressum-heading"
        ></span>
        <span
          v-else-if="element.__typename == 'ParagraphType'"
          v-html="element.value"
          class="text-body2 impressum-paragraph"
        ></span>
        <q-img
          v-else-if="element.__typename == 'ImageType'"
          :src="element.imageData.rendition.url"
          class="impressum-image"
        ></q-img>
        <div v-else-if="element.__typename == 'VideoType'" class="impressum-video-wrapper">
          <youtube :video-id="getYoutubeId(element.value)" :player-vars="playerVars" ref="youtube"></youtube>
        </div>

        <q-carousel
          v-else-if="element.__typename == 'GalleryType'"
          class="gallery"
          arrows
          animated
          infinite
          v-model="slide"
          height="32vh"
        >
          <q-carousel-slide
            class="impressum-image"
            v-for="(image, index) in element.galleryData"
            :key="index"
            :name="index"
            :img-src="image.rendition.url"
          >
            <div class="absolute-bottom custom-caption">
              <div class="text-subtitle1 lesson-gallery-text">{{image.caption}}</div>
            </div>
          </q-carousel-slide>
        </q-carousel>
      </div>
    </q-scroll-area>
    <base-custom-page-sticky
      class="nav-back-button-container"
      :position="'top-left'"
      :offset="[16, 16]"
    >
      <router-link to="/overview" class="nav-back-button-link">
        <q-icon name="arrow_back" size="1.5rem"></q-icon>
      </router-link>
    </base-custom-page-sticky>
  </q-page>
</template>

<script>
import IMPRESSUM_DATA from "../graphql/impressum/impressumData.gql";

export default {
  name: "impressum-screen",
  data() {
    return {};
  },
  apollo: {
  impressumData: {
    query: IMPRESSUM_DATA,
    fetchPolicy: "cache-and-network",
    variables: {
      challengeSlug: process.env.CHALLENGE_SLUG
    },
    // update(data) {
    //   console.log(data)
    //   return data
    // }
  }
  },

  // mounted() {
  //   if (!this.$router.currentRoute.params.impressumData) {
  //     this.$router.push("/overview");
  //   }
  // },
  // activated() {
  //   if (!this.$router.currentRoute.params.impressumData) {
  //     this.$router.push("/overview");
  //   }
  // }
};
</script>

<style lang='scss' scoped>
.impressum-content-container {
  margin: 0 1.6rem 0.5rem 1.6rem;

  &:first-child {
    padding-top: 4rem;
  }
  &:last-child {
    padding-bottom: 4rem;
  }
}

.impressum-heading > h2 {
  font-size: 1.2rem;
}
</style>

