<template>
  <q-page>
    <q-scroll-area vertical>
      <div class="canvas-container">
        <CanvasSection
          @add-sticker="openDialog(null, problem)"
          @edit-sticker="openDialog($event, problem)"
          :list="problem"
          group="projekt-canvas"
          class="canvas-section canvas-section__problem"
        >
          Problem
          <!-- <q-icon class="add-icon" @click="openAddDialog(problem)" name="add" /> -->
        </CanvasSection>
        <CanvasSection
          @add-sticker="openDialog(null, zielgruppe)"
          @edit-sticker="openDialog($event, zielgruppe)"
          :list="zielgruppe"
          group="projekt-canvas"
          class="canvas-section canvas-section__zielgruppe"
        >Zielgruppe</CanvasSection>
        <CanvasSection
          @add-sticker="openDialog(null, loesung)"
          @edit-sticker="openDialog($event, loesung)"
          :list="loesung"
          group="projekt-canvas"
          class="canvas-section canvas-section__loesung"
        >Lösung</CanvasSection>
        <CanvasSection
          @add-sticker="openDialog(null, aktivitaeten)"
          @edit-sticker="openDialog($event, aktivitaeten)"
          :list="aktivitaeten"
          group="projekt-canvas"
          class="canvas-section canvas-section__aktivitaeten"
        >Aktivitäten</CanvasSection>
        <CanvasSection
          @add-sticker="openDialog(null, ressourcen)"
          @edit-sticker="openDialog($event, ressourcen)"
          :list="ressourcen"
          group="projekt-canvas"
          class="canvas-section canvas-section__ressourcen"
        >Ressourcen</CanvasSection>
        <CanvasSection
          @add-sticker="openDialog(null, beteiligte)"
          @edit-sticker="openDialog($event, beteiligte)"
          :list="beteiligte"
          group="projekt-canvas"
          class="canvas-section canvas-section__beteiligte"
        >Beteiligte</CanvasSection>
        <CanvasSection
          @add-sticker="openDialog(null, vorstellung)"
          @edit-sticker="openDialog($event, vorstellung)"
          :list="vorstellung"
          group="projekt-canvas"
          class="canvas-section canvas-section__vorstellung"
        >Vorstellung</CanvasSection>
        <CanvasSection
          @add-sticker="openDialog(null, kanaele)"
          @edit-sticker="openDialog($event, kanaele)"
          :list="kanaele"
          group="projekt-canvas"
          class="canvas-section canvas-section__kanaele"
        >Kanäle</CanvasSection>
        <CanvasSection
          @add-sticker="openDialog(null, kosten)"
          @edit-sticker="openDialog($event, kosten)"
          :list="kosten"
          group="projekt-canvas"
          class="canvas-section canvas-section__kosten"
        >Kosten</CanvasSection>
        <CanvasSection
          @add-sticker="openDialog(null, einnahmen)"
          @edit-sticker="openDialog($event, einnahmen)"
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
      pendingList: null,
      pendingStickerIndex: -1,
      pendingStickerText: "",
      pendingStickerId: 0,
    };
  },
  apollo: {},
  methods: {
    openDialog(payload, list) {
      if (payload) {
        this.pendingStickerText = payload.name;
        this.pendingStickerId = payload.id
        this.pendingList = list;

        let currentList = this.pendingList;
        this.pendingStickerIndex = currentList.findIndex(
          currentList => currentList.id === payload.id
        );

        this.showAddDialog = !this.showAddDialog;
      } else {
        this.pendingList = list;
        this.pendingStickerIndex = -1;
        this.pendingStickerText = "";
        this.showAddDialog = !this.showAddDialog;
      }
    },
    addSticker() {
      if (this.pendingStickerIndex === -1 && this.pendingStickerText) {
        this.pendingList.push({
          name: this.pendingStickerText,
          id: this.generateUniqueID()
        });
      } else if (this.pendingStickerText) {
        this.pendingList[this.pendingStickerIndex] = {
          name: this.pendingStickerText,
          id: this.pendingStickerId
        };
      }
    },
    removeItem() {
      console.log("Hello");
    },
    generateUniqueID() {
      let currentList = this.pendingList;
      let index = 0;
      let generatedId = 0;

      while (index !== -1) {
        generatedId = Math.floor(Math.random() * 1000) + 1;
        index = currentList.findIndex(
          currentList => currentList.id === generatedId
        );
      }
      return generatedId;
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
  background: #f1f1f1;
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
  background: #fff;
  overflow: hidden;
  border-radius: 3px;
  border: 1px solid #eeeeee;

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