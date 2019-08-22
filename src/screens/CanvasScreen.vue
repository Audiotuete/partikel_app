<template>
  <q-page>
    <q-scroll-area vertical>
      <div class="canvas-container">
        <!-- <CanvasSection
          v-for="(section, index) in canvas"
          :key="index"
          :list="section[Object.keys(section)[1]]"
          group="projekt-canvas"
          :class="'canvas-section canvas-section__' + Object.keys(section)[1]"
        >
          <div>
            {{section[Object.keys(section)[0]]}}
            <q-icon @click="addSticker(promblem)" name="add" />
          </div>
        </CanvasSection>-->
        <CanvasSection
          :list="problem"
          group="projekt-canvas"
          class="canvas-section canvas-section__problem"
        >
          Problem
          <q-icon class="add-icon" @click="openAddDialog(problem)" name="add" />
        </CanvasSection>
        <CanvasSection
          :list="zielgruppe"
          group="projekt-canvas"
          class="canvas-section canvas-section__zielgruppe"
        >Zielgruppe</CanvasSection>
        <CanvasSection
          :list="loesung"
          group="projekt-canvas"
          class="canvas-section canvas-section__loesung"
        >Lösung</CanvasSection>
        <CanvasSection
          :list="aktivitaeten"
          group="projekt-canvas"
          class="canvas-section canvas-section__aktivitaeten"
        >Aktivitäten</CanvasSection>
        <CanvasSection
          :list="ressourcen"
          group="projekt-canvas"
          class="canvas-section canvas-section__ressourcen"
        >Ressourcen</CanvasSection>
        <CanvasSection
          :list="beteiligte"
          group="projekt-canvas"
          class="canvas-section canvas-section__beteiligte"
        >Beteiligte</CanvasSection>
        <CanvasSection
          :list="vorstellung"
          group="projekt-canvas"
          class="canvas-section canvas-section__vorstellung"
        >Vorstellung</CanvasSection>
        <CanvasSection
          :list="kanaele"
          group="projekt-canvas"
          class="canvas-section canvas-section__kanaele"
        >Kanäle</CanvasSection>
        <CanvasSection
          :list="kosten"
          group="projekt-canvas"
          class="canvas-section canvas-section__kosten"
        >Kosten</CanvasSection>
        <CanvasSection
          :list="einnahmen"
          group="projekt-canvas"
          class="canvas-section canvas-section__einnahmen"
        >Einnahmen</CanvasSection>
      </div>
    </q-scroll-area>
    <q-dialog v-model="showAddDialog">
      <q-card class="dialog-card">
        <q-input
          autofocus
          ref="input"
          v-model="pendingStickerText"
          bottom-slots
          counter
          maxlength="40"
          borderless
          autogrow
        ></q-input>
        <q-card-actions align="around">
          <q-btn v-close-popup flat round color="red" icon="close" />
          <q-btn @click="addSticker()" v-close-popup flat round color="green" icon="check" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>



<script>
import CanvasSection from "../components/canvas/CanvasSection";
import { setTimeout } from "timers";

export default {
  components: {
    CanvasSection
  },
  name: "canvas-screen",
  data() {
    return {
      problem: [{ name: "Peter", id: 1 }],
      zielgruppe: [],
      loesung: [],
      aktivitaeten: [],
      ressourcen: [],
      beteiligte: [],
      vorstellung: [],
      kanaele: [],
      kosten: [],
      einnahmen: [],

      showAddDialog: false,
      pendingStickerList: [],
      pendingStickerText: ""
    };
  },
  apollo: {},
  methods: {
    openAddDialog(list) {
      this.pendingStickerText = "";
      this.pendingStickerList = list;
      this.showAddDialog = !this.showAddDialog;
    },
    addSticker() {
      if (this.pendingStickerText) {
        this.pendingStickerList.push({ name: this.pendingStickerText, id: 30 });
      }
    },
    removeItem() {
      console.log("Hello");
    },
    navigateBack() {
      this.$router.go(-1);
    }
  },
  mounted() {
    console.log(this.canvas);
  }
};
</script>

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
  position: relative;
  padding: 0.75rem 0.5rem;
  background: #f1f1f1;
  overflow: hidden;
  border-radius: 3px;
  border: 1px solid #333;

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
    max-height: 30vh;
    grid-area: kosten;
  }
  &__einnahmen {
    max-height: 30vh;
    grid-area: einnahmen;
  }
}

.add-icon {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
}

.dialog-card {
  min-width: 16rem;
  max-width: 16rem;
  padding: 0.5rem 1.25rem 0.75rem 1.25rem;
}
</style>