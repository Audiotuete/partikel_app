<template>
  <q-page>
    <q-scroll-area>
      <div class="canvas-container">
        <div class="canvas-section canvas-section__problem"></div>
        <div class="canvas-section canvas-section__zielgruppe"></div>
        <div class="canvas-section canvas-section__loesung"></div>
        <div class="canvas-section canvas-section__aktivitaeten"></div>
        <div class="canvas-section canvas-section__ressourcen"></div>
        <div class="canvas-section canvas-section__beteiligte"></div>
        <div class="canvas-section canvas-section__vorstellung"></div>
        <div class="canvas-section canvas-section__kanaele"></div>
        <div class="canvas-section canvas-section__kosten"></div>
        <div class="canvas-section canvas-section__einnahmen"></div>
      </div>
    </q-scroll-area>
  </q-page>
</template>


<style lang='scss' scoped>
.canvas-container {
  display: grid;
  padding: 0.5rem;
  height: 100vh;
  width: 300vw;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: 4fr 4fr 3fr;
  grid-template-areas:
    "problem  problem   zielgruppe  zielgruppe  aktivitaeten  aktivitaeten  ressourcen  ressourcen  vorstellung   vorstellung"
    "problem  problem   loesung     loesung     aktivitaeten  aktivitaeten  beteiligte  beteiligte  kanaele       kanaele"
    "kosten   kosten    kosten      kosten      kosten        einnahmen     einnahmen   einnahmen   einnahmen     einnahmen";
  grid-gap: 0.5rem;
}
.canvas-section {
  background: #333;
  // border-radius: 3px;

  &__problem {
    grid-area: problem;
  }
  &__zielgruppe {
    grid-area: zielgruppe;
  }
  &__loesung {
    grid-area: loesung;
  }
  &__aktivitaeten {
    grid-area: aktivitaeten;
  }
  &__ressourcen {
    grid-area: ressourcen;
  }
  &__beteiligte {
    grid-area: beteiligte;
  }
  &__vorstellung {
    grid-area: vorstellung;
  }
  &__kanaele {
    grid-area: kanaele;
  }
  &__kosten {
    grid-area: kosten;
  }
  &__einnahmen {
    grid-area: einnahmen;
  }
}
</style>

<script>
export default {
  name: "canvas-screen",
  data() {
    return {};
  },
  apollo: {},
  methods: {
    navigateBack() {
      this.$router.go(-1);
    }
  }
};
</script>


