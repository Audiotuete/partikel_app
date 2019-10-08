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
          <div @click.stop="showSectionDescription = true" class="flex item-center justify-between">
            <span>Problem</span>
            <q-icon class="add" name="info" size="1rem" color="grey-6" />
          </div>
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
    <q-dialog v-model="showPostItDialog">
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
          <q-btn class v-close-popup flat round color="red" icon="close" />
          <q-btn class @click="addSticker()" v-close-popup flat round color="green" icon="check" />

          <q-btn
            v-if="pendingStickerIndex >= 0"
            @click="deleteSticker()"
            v-close-popup
            flat
            round
            color="primary"
            icon="delete"
          />
        </q-card-actions>
        <div class="add-dialog-color-chooser-container">
          <q-btn
            v-for="(value, index) in stickerColors"
            :key="index"
            @click="setStickerColor(value)"
            class="add-dialog-color-chooser-btn"
            :color="value"
            size=".5rem"
            :class="{'add-dialog-color-chooser-btn__active': pendingStickerColor === value}"
          />
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showSectionDescription">
      <q-card class="dialog-card">

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
      problem: [{ name: "Peter", id: 1, color: "amber-1" }],
      zielgruppe: [],
      loesung: [],
      aktivitaeten: [],
      ressourcen: [],
      beteiligte: [],
      vorstellung: [],
      kanaele: [],
      kosten: [],
      einnahmen: [],

      showPostItDialog: false,
      showSectionDescription: false,
      isEdit: false,
      pendingList: null,
      pendingStickerIndex: -1,
      pendingStickerText: "",
      pendingStickerId: 0,
      pendingStickerColor: "",
      stickerColors: ["red-1", "amber-1", "green-1", "blue-1", "white"]
    };
  },
  apollo: {},
  methods: {
    openDialog(payload, list) {
      if (payload) {
        this.pendingStickerText = payload.name;
        this.pendingStickerColor = payload.color;
        this.pendingStickerId = payload.id;
        this.pendingList = list;

        let currentList = this.pendingList;
        this.pendingStickerIndex = currentList.findIndex(
          currentList => currentList.id === payload.id
        );

        this.showPostItDialog = !this.showPostItDialog;
      } else {
        this.pendingList = list;
        this.pendingStickerIndex = -1;
        this.pendingStickerText = "";
        this.pendingStickerColor = "";
        this.showPostItDialog = !this.showPostItDialog;
      }
    },
    addSticker() {
      if (this.pendingStickerIndex === -1 && this.pendingStickerText) {
        this.pendingList.push({
          name: this.pendingStickerText,
          id: this.generateUniqueID(),
          color: this.pendingStickerColor
        });
      } else if (this.pendingStickerText) {
        this.pendingList[
          this.pendingStickerIndex
        ].name = this.pendingStickerText;
      }
    },
    deleteSticker() {
      this.pendingList = this.pendingList.splice(this.pendingStickerIndex, 1);
      this.pendingList = null;
    },
    setStickerColor(color) {
      this.pendingStickerColor = color;
      if (this.pendingStickerIndex >= 0) {
        this.pendingList[this.pendingStickerIndex].color = color;
      }
      this.$refs.input.focus()
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

.add-dialog-color-chooser-container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  height: 2rem;
  margin: 1rem 0 1rem 0;
}

.add-dialog-color-chooser-btn {
  box-shadow: 0 1px 2px 0px rgba(0, 0, 0, 0.15);
  border-radius: 2px;

  &__active {
    box-sizing: border-box;
    box-shadow: inset 0px 0px 0px 1px #000;
  }
}
</style>