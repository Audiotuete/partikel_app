<template>
  <div @click="$emit('add-sticker')" style="height: 100%">
  <slot></slot>
  <draggable  class="canvas-sticker-dragger" :list="list" :group="group">
    <q-card @click.stop="$emit('edit-sticker', element)" class="canvas-sticker" v-for="element in list" :key="element.id">
      <div class="canvas-sticker-text">{{element.name}}</div>
    </q-card>
  </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "canvas-sticker",
  props: ["label", "list", "group"],
  components: { draggable },
  methods: {
    editSticker() {
      console.log('Hi there')
    },
    addSticker() {
      this.$parent.openAddDialog()
    }
  }
};
</script>

<style lang="scss">
.canvas-sticker {
  display: flex;
  z-index: 1000;
  // align-self: flex-start;
  background: #fff;
  margin: 0.3rem 0.25rem;
  min-width: 48vw;
  max-width: 65vw;
}

.canvas-sticker-text {
  padding: 0.25rem 0.5rem;
}

.canvas-sticker-dragger {
  display: flex;
  flex: 1;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  height: 95%;
  max-height: 95%;
}
</style>