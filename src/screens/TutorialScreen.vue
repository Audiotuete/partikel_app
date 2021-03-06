<template>
  <q-page v-if="currentUser" class="flex">
    <div class="overlay-loading-long" v-if="$apollo.queries.currentUser.loading || isLoading">
      <q-spinner-tail color="primary" size="4em" />
    </div>

    <div
      class="top-bar raise-it"
      @click="toggleSectionOverview()"
      v-touch-swipe.mouse.down="toggleSectionOverview"
    />

    <q-stepper
      v-model="currentStep"
      animated
      header-nav
      keep-alive
      contracted
      swipeable
      @input="getScrollPositions()"
    >
      <q-step
        v-for="(section, index) in activeChallengeSections"
        :key="section.id"
        title
        :name="index"
      >
        <q-scroll-area
          ref="scrollareas"
          :class="{'main-container': true, 'no-pointer-events' : showSectionOverview}"
        >
          <div v-if="!isLocked(section.hardlockDuration)" class="card-container">
            <q-card
              @click="goToLesson(unit)"
              v-for="unit in section.challengesectionunitSet"
              :key="unit.id"
              class="my-card"
            >
              <div
                v-if="!lessonsViewed.includes(parseInt(unit.id)) && !lessonsCompleted.includes(parseInt(unit.id))"
                class="overlay-not-viewed"
              >
                <!-- gem, eye, carrot, brain, concierge-bell, ice-cream, mask, bolt, paw, parachute-box, seedling  -->
                <q-icon name="fas fa-seedling" class="overlay-not-viewed-icon"></q-icon>
              </div>
              <q-icon
                name="fas fa-check"
                class="overlay-completed"
                v-if="lessonsCompleted.includes(parseInt(unit.id))"
              />

              <img class="thumbnail" :src="unit.thumbnail.rendition.url" />
              <div class="card-categories-container">
                <!-- :style="{background: categorie.active ? 'rgba(0,0,0,0.55) ': 'rgba(0,0,0,0.55) '}" -->
                <div
                  v-for="(categorie, index) in activeCategories(unit.categories)"
                  :key="index"
                  class="card-categories"
                >
                  <q-icon
                    :name="'fas fa-' + categorie.icon"
                    size="12px"
                    :style="{color: categorie.active ? categorie.color + 'cc' : 'rgba(255,255,255,0.25)', width: '102%'}"
                  />
                </div>
              </div>

              <q-card-section class="card-section" align="around">
                <div></div>
                <div class="text-body1 text-left">{{unit.title}}</div>
              </q-card-section>
            </q-card>
          </div>

          <div v-else class="row no-wrap card-container">
            <q-card v-for="unit in section.challengesectionunitSet" :key="unit.id" class="my-card">
              <div class="overlay-locked">
                <q-icon name="fas fa-lock" class="overlay-locked-icon"></q-icon>
              </div>

              <img class="thumbnail" :src="unit.thumbnail.rendition.url" />

              <q-card-section class="card-section" align="around">
                <div class="text-body1 text-left">{{unit.title}}</div>
              </q-card-section>
            </q-card>
          </div>
          <q-scroll-observer debounce="250" @scroll="setScrollPositions" />
        </q-scroll-area>
      </q-step>
    </q-stepper>

    <base-custom-page-sticky class="raise-it" :position="'top-left'" :offset="[14, 24]">
      <q-btn
        @click="showSectionOverview = true"
        v-touch-swipe.mouse.down="toggleSectionOverview"
        style="font-weight: bold"
        color="primary"
        text-color="white"
        rounded
        :label="'Woche ' + parseInt(currentStep + 1)"
      />
    </base-custom-page-sticky>

    <base-custom-page-sticky class="raise-it" :position="'top-left'" :offset="[14, 24]">
      <q-btn
        @click="showSectionOverview = true"
        v-touch-swipe.mouse.down="toggleSectionOverview"
        style="font-weight: bold"
        color="primary"
        text-color="white"
        rounded
        :label="'Tutorial'"
      />
    </base-custom-page-sticky>

    <base-custom-page-sticky class="raise-it" :position="'bottom'" :offset="[14, 24]">
      <q-btn
        @click="$router.push('/overview')"
        style="font-weight: bold"
        color="primary"
        text-color="white"
        :label="'Tutorial beenden'"
      />
    </base-custom-page-sticky>

    <q-dialog v-model="showSectionOverview" position="top">
      <q-card class="dialog-card" v-touch-swipe.mouse="toggleSectionOverview">
        <q-card-section style="padding-top: 2rem">
          <div class="text-h6 text-center">Wochenübersicht</div>
        </q-card-section>

        <q-card-section class="dialog-button-container">
          <q-btn
            v-for="(section, index) in activeChallengeSections"
            :key="section.id"
            :label="isLocked(section.hardlockDuration) ? '' : index + 1"
            :icon="isLocked(section.hardlockDuration) ? 'fas fa-lock' : ''"
            :size="isLocked(section.hardlockDuration) ? '4vw' : '5vw'"
            :color="isLocked(section.hardlockDuration) ? 'grey-7' : 'primary'"
            :text-color="isLocked(section.hardlockDuration) ? 'grey-3' : 'amber-' + (index + 1)"
            @click="selectSection(section, index)"
            class="dialog-buttons"
            push
            v-close-popup
          ></q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>


<script>
import CURRENT_USER from "../graphql/users/currentUser.gql";
import CHECK_CURRENT_USER from "../graphql/users/checkCurrentUser.gql";

export default {
  name: "overview-screen",
  data() {
    return {
      currentUser: {
        currentChallenge: {
          challengesectionSet: []
        }
      },
      rootURL: process.env.ROOT_API,
      isLoading: false,
      showSectionOverview: false,
      lessonsViewed: [],
      currentStep: 0,
      scrollPositionsHorizontal: {}
      // scrollAreaHeight: 0,
      // activeScrollIndicators: {left: false, right: false}
    };
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER,
      fetchPolicy: "cache-and-network"
      // update(data) {
      //   return data.currentUser
      // }
    }
  },
  computed: {
    processMode() {
      return process.env.MODE;
    },
    activeChallengeSections() {
      return this.currentUser.currentChallenge.challengesectionSet.slice(0,2)
    },
    lessonsCompleted() {
      return this.currentUser.lessonsCompleted;
    }
  },
  methods: {
    goToLesson(unit) {
      this.markLessonViewed(unit.id);
      this.$router.push({
        name: "LessonScreen",
        params: {
          id: unit.id,
          unitData: unit,
          lessonsCompleted: this.currentUser.lessonsCompleted
        }
      });
    },
    goToImpressum() {
      this.$router.push({
        name: "ImpressumScreen",
      });
    },
    toggleSectionOverview(event) {
      this.showSectionOverview = !this.showSectionOverview;
    },
    activeCategories(categories) {
      let activeCategoriesArray = {
        0: {
          icon: "users",
          color: "#5DC1EC",
          active: false
        },
        1: {
          icon: "tools",
          color: "#28C93F",
          active: false
        },
        2: {
          icon: "exchange-alt",
          color: "#F9BE2F",
          active: false
        },
        3: {
          icon: "bullhorn",
          color: "#F96058",
          active: false
        }
      };
      categories.forEach(categorie => {
        switch (categorie.slug) {
          case "team":
            activeCategoriesArray[0].active = true;
            break;
          case "projektstruktur-werkzeuge":
            activeCategoriesArray[1].active = true;
            break;
          case "feedback":
            activeCategoriesArray[2].active = true;
            break;
          case "marketing":
            activeCategoriesArray[3].active = true;
            break;
        }
      });

      return activeCategoriesArray;
    },
    selectSection(section, index) {
      this.currentStep = index;
      this.getScrollPositions();

      if (this.isLocked(section.hardlockDuration)) {
        let msToUnlock =
          Date.parse(this.currentUser.dateJoined) +
          section.hardlockDuration * 86400000 -
          Date.now();
        let daysToUnlock = Math.floor(msToUnlock / (24 * 60 * 60 * 1000));
        let hoursToUnlock = Math.floor(msToUnlock / (60 * 60 * 1000));
        let minutesToUnlock = Math.ceil(msToUnlock / (60 * 1000));

        function generateMessage() {
          if (daysToUnlock > 0) {
            return (
              "Inhalte werden in " + daysToUnlock + " Tagen freigeschaltet"
            );
          } else if (hoursToUnlock > 0) {
            return (
              "Inhalte werden in " + hoursToUnlock + " Stunden freigeschaltet"
            );
          } else {
            return (
              "Inhalte werden in " + minutesToUnlock + " Minuten freigeschaltet"
            );
          }
        }

        this.$q.notify({
          message: generateMessage(),
          position: "bottom",
          timeout: 2000,
          textColor: "white",
          icon: "fas fa-lock-open",
          classes: "locked-notification"
        });
      }
    },
    onClick(value) {},
    markLessonViewed(id) {
      if (this.lessonsViewed) {
        if (!this.lessonsViewed.includes(parseInt(id))) {
          this.lessonsViewed.push(parseInt(id));
          localStorage.setItem(
            "lessons_viewed",
            JSON.stringify(this.lessonsViewed)
          );
        }
      } else {
        this.lessonsViewed.push(parseInt(id));
        return localStorage.setItem(
          "lessons_viewed",
          JSON.stringify([parseInt(id)])
        );
      }
    },

    setScrollPositions(event) {
      for (let [index, scrollarea] of this.$refs.scrollareas.entries()) {
        if (!scrollarea._inactive) {
          this.scrollPositionsHorizontal[scrollarea._uid] = event.position;
        }
      }
      // Only Userfull with reload (when Vue Instance is destroyed)
      // localStorage.setItem('nav_positions', JSON.stringify({
      //   scrollPositionsHorizontal: this.scrollPositionsHorizontal}))
    },
    getScrollPositions() {
      // Only Userfull with reload (when Vue Instance is destroyed)
      // let navPositions = JSON.parse(localStorage.getItem('nav_positions'))
      setTimeout(() => {
        for (const [index, position] of Object.entries(
          this.scrollPositionsHorizontal
        )) {
          try {
            this.$refs.scrollareas
              .find(bar => {
                return bar._uid == index;
              })
              .setScrollPosition(position);
          } catch (err) {
            // console.log(err)
            // Ignore
          }
        }
      }, 10);
    },
    isLocked(days) {
      // 24 * 60 * 60 * 1000 = 86400000
      if (
        Date.parse(this.currentUser.dateJoined) +
          days * 86400000 -
          Date.now() <=
        0
      ) {
        return false;
      } else {
        return true;
      }
    }
  },
  created() {
    this.$apollo
      .query({
        query: CHECK_CURRENT_USER,
        fetchPolicy: "no-cache"
      })
      .then(data => {})
      .catch(error => {
        console.log(error);
        localStorage.clear();
        location.reload();
      });
  },
  mounted() {
    localStorage.removeItem("nav_positions");
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);

    let tempLessonsViewed = JSON.parse(localStorage.getItem("lessons_viewed"));
    if (tempLessonsViewed) {
      this.lessonsViewed = tempLessonsViewed;
    }

    // this.scrollAreaHeight = document.querySelector('.q-stepper__content').offsetHeight
  },
  updated() {},
  activated() {
    this.getScrollPositions();
  },
  deactivated() {}
};
</script>

<style lang="scss" scoped>
.top-bar {
  min-height: 2.5rem;
  width: 104%;
  left: -2%;
  position: fixed;
  background: #ffffff;
  box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.35);
}

.main-container {
  height: 100vh;
  width: 100vw;
}

.card-container {
  display: flex;
  flex-direction: column;
  align-items: center;

  &::before {
    content: "-";
    height: 4.5rem;
    color: transparent;
  }
  &::after {
    content: "-";
    height: 5rem;
    color: transparent;
  }
}

.dialog-card {
  min-width: 95vw;
  max-width: 95vw;
  padding: 6vh 5vw 2.5vh 5vw;
}

.dialog-button-container {
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;
}

.dialog-buttons {
  width: 14vw;
  height: 14vw;
  // font-size: 4.25vw;
  font-weight: 900;
  margin: 2.25vw;

  // :nth-child(2) {
  //   line-height: 0;
  // }
}

.overlay-loading-long {
  position: fixed; /* Sit on top of the page content */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  z-index: 100;
  /* Duration must be indentical to animation duration */
  animation: 1.5s ease-in 0s 1 fadeIn;
}
@keyframes fadeIn {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.raise-it {
  z-index: 10;
}

.my-card {
  margin: 0.5rem;
  /* margin-bottom: 1rem; */
  min-width: 18rem;
  max-width: 18rem;
  min-height: 14rem;
  // min-width: 80vw;
  // max-width: 80vw;
  overflow: hidden;

  .overlay-locked {
    position: absolute;
    display: flex;
    justify-content: center;
    z-index: 3;
    min-width: 18rem;
    max-width: 18rem;
    height: 100%;
    background: rgba(0, 0, 0, 0.75);

    .overlay-locked-icon {
      top: 25%;
      color: rgba(255, 255, 255, 0.3);
      font-size: 4rem;
    }
  }

  .overlay-not-viewed {
    z-index: 1;
    position: absolute;
    display: flex;
    justify-content: center;
    // z-index: 0;
    min-width: 18rem;
    max-width: 18rem;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);

    .overlay-not-viewed-icon {
      top: 20%;
      color: rgba(255, 255, 255, 0.75);
      font-size: 4rem;
    }
  }

  .overlay-completed {
    z-index: 2;
    position: absolute;
    right: 5%;
    bottom: 18%;
    // FlatUI Dutch Palette
    color: #a3cb38; // Android Green
    font-size: 4rem;
    text-shadow: 0 0px 4px rgba(0, 148, 49, 0.5); // Pixelated Grass
    // animation-name: pulse;
    // animation-duration: 1s;
    // animation-iteration-count: 1;

    // @keyframes pulse {
    //   from { transform: scale(1); }
    //   50% { transform: scale(0.85); }
    //   to { transform: scale(1); }
    // }
  }

  .thumbnail {
    max-height: 10rem;
    min-height: 10rem;
    object-fit: cover;
    background: #000;
  }

  .card-categories-container {
    z-index: 1;
    flex: 1;
    position: absolute;
    top: 0;
    height: 10rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
  }

  .card-categories {
    display: flex;
    flex: 1;
    align-items: center;
    position: relative;
    z-index: 2;
    width: 8%;
    background: rgba(0, 0, 0, 0.6);

    &:first-child {
      padding-top: 0.5rem;
    }
    &:last-child {
      padding-bottom: 0.5rem;
    }
  }

  .card-section {
    z-index: 1;
    background: #fff;
    display: flex;
    // justify-content: center;
    align-items: center;
    min-height: 4rem;
    padding: 0 1rem;
  }
  // .card-text {
  //   font-size: 1rem;
  //   font-weight: 400;
  // }
}
</style>

