<template>
  <q-page-sticky :class="{'top-sticky': displayedInIOS}" :position=position :offset=offset>
    <slot></slot>
  </q-page-sticky>
</template>

<script>
export default {
  name: 'custom-page-sticky',
  props: ['offset', 'position'],
  computed: {
    displayedInIOS() {
      if (process.env.MODE == "cordova") {
        return device.platform == "iOS";
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.top-sticky {
  top: 1.5rem
}
</style>

