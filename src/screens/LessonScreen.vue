<template>
  <q-page class='flex column no-wrap'>
    <q-img
      :src='rootURL + data.thumbnail.rendition.url'
      style='width: 100%'
    >
      <div class='absolute-bottom text-h6 text-left q-pa-xs'>
        {{data.title}}
      </div>
    </q-img>
    <router-link to='/'>back</router-link>
    <div class='content-container' v-for='(element, index) in data.content' :key='index'>
      <span v-if="element.__typename == 'HeadingType'" v-html='element.value'></span>
      <q-img class="lesson-image" v-else-if="element.__typename == 'ImageType'" :src='rootURL + element.imageData.rendition.url'></q-img>
      <p class="text-body1" v-else-if="element.__typename == 'ParagraphType'" v-html='element.value'></p>
      <div v-else-if="element.__typename == 'VideoType'" class="video-wrapper">
        <youtube :video-id='getYoutubeId(element.value)' :player-vars="playerVars" ref="youtube"></youtube>
      </div>
    </div>
  </q-page>
</template>


<script>

export default {
  name: 'lesson-screen',
  props: ['data'],
  data() {
    return {
      currentUser: {},
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
    console.log(this.data.content)
    // for (var item in this.data.content) {
    //   console.log(item)
    // }
  }
}
</script>


<style lang='scss' scoped>
.content-container {
  max-width: 100vw;
  margin: 0 1.2rem 0 1.2rem;
  
}

.lesson-image {
  border-radius: 4px;
  overflow: hidden;
}

.video-wrapper {
  position: relative;
  padding-bottom: 56.5%; /* beWirken Ratio */
  height: 0;
  border-radius: 4px;
  overflow: hidden;
} 


</style>

