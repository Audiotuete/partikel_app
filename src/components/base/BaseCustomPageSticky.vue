<template>
  <q-page-sticky :class="{'top-sticky': processMode == 'cordova'}" :position=position :offset=offset>
    <slot></slot>
  </q-page-sticky>
</template>

<script>
export default {
  name: 'custom-page-sticky',
  props: ['offset', 'position'],
  computed: {
    processMode() {
      return process.env.MODE 
    }
  }
}
</script>

<style lang="scss" scoped>
.top-sticky {
  top: 1.5rem
}
</style>

