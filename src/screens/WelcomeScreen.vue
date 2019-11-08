
<template>
  <transition name="fade">
    <q-page v-show="allOnboardingScreens">
      <q-carousel
        keep-alive
        animated
        swipeable
        v-model="currentScreen"
        height="100vh"
        class="carousel-container"
      >
        <q-carousel-slide
          class="carousel-slide-container"
          v-for="(screen, index) in allOnboardingScreens"
          :key="index"
          :name="index"
          :img-src="screen.image.rendition.url"
        >
          <div class="welcome-top-container">
            <span class="welcome-title">{{screen.title}}</span>
            <span class="welcome-text">{{screen.text}}</span>
          </div>
          <div
            :class="{'welcome-bottom-container': true, 'browser-adjustments': displayedInBrowser, 'ios-adjustments': displayedInIOS }"
          >
            <div class="screen-indicator-container">
              <q-icon
                v-show="currentScreen < allOnboardingScreens.length -1"
                @click="currentScreen += 1"
                class="screen-indicator-arrow"
                name="arrow_forward_ios"
              ></q-icon>
              <q-icon
                v-for="(dot, index) in allOnboardingScreens "
                :key="index"
                :class="{'screen-indicator-dot': true, 'active': index == currentScreen}"
                @click="currentScreen = index"
                name="lens"
                size="3.5vw"
              ></q-icon>
            </div>
            <q-btn
              class="welcome-btn"
              @click="register()"
              color="white"
              text-color="primary"
            >Challenge Starten</q-btn>
            <div @click="goToImpressum()" class="welcome-impressum-container">
              <img class="welcome-impressum-icon" src="../statics/app-logo-128x128.png" alt />
              <router-link to="/impressum" class="welcome-impressum-link">Impressum</router-link>
            </div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </q-page>
  </transition>
</template>

<script>
// GraphQL
import CREATE_USER from "../graphql/users/createUser.gql";
import GET_TOKEN from "../graphql/auth/getToken.gql";

import ALL_ONBOARDING_SCREENS from "../graphql/onboarding/allOnboardingScreens.gql";

export default {
  name: "welcome-screen",
  components: {},
  data() {
    return {
      allOnboardingScreens: null,
      currentScreen: 0
    };
  },
  computed: {
    displayedInBrowser() {
      return process.env.MODE == "spa";
    },
    displayedInIOS() {
      if (process.env.MODE == "cordova") {
        return device.platform == "iOS";
      } else if (this.getBrowserInfo().includes("Safari") && this.getOSInfo() != "MacIntel") {
        return true
      }
    }
  },
  apollo: {
    allOnboardingScreens: {
      query: ALL_ONBOARDING_SCREENS,
      variables: {
        challengeSlug: process.env.CHALLENGE_SLUG
      },
      fetchPolicy: "cache-and-network"
      // update(data) {
      //   console.log(data)
      // }
    }
  },
  methods: {
    goToImpressum() {
      this.$router.push({
        name: "ImpressumScreen"
      });
    },
    register() {
      this.$apollo
        .mutate({
          mutation: CREATE_USER,
          variables: {
            challengeId: process.env.CHALLENGE_ID,
            // browserInfo and osInfo must be requested differently on native WebViews
            browserInfo: this.getBrowserInfo(),
            osInfo: this.getOSInfo()
          }
        })
        .then(data => {
          this.login(data.data.createUser.user.username);
        })
        .catch(error => {
          // console.error(error)
        });
    },

    login(username) {
      this.$apollo
        .mutate({
          mutation: GET_TOKEN,
          variables: {
            username: username,
            password: process.env.USER_PASSWORD
          }
        })
        .then(data => {
          // Result
          const token = data.data.tokenAuth.token;
          localStorage.setItem(process.env.TOKEN_ID, token);
          if (localStorage.getItem(process.env.TOKEN_ID)) {
            this.$router.push("/overview");
          }
        })
        .catch(error => {
          // console.error(error)
        });
    },
    getOSInfo() {
      if (process.env.MODE == "cordova") {
        return device.platform;
      } else if (process.env.MODE == "spa") {
        return navigator.platform;
      }
    },
    getBrowserInfo() {
      if (process.env.MODE == "spa") {
        var ua = navigator.userAgent,
          tem,
          M =
            ua.match(
              /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
            ) || [];
        if (/trident/i.test(M[1])) {
          tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
          return "IE " + (tem[1] || "");
        }
        if (M[1] === "Chrome") {
          tem = ua.match(/\b(OPR|Edge?)\/(\d+)/);
          if (tem != null)
            return tem
              .slice(1)
              .join(" ")
              .replace("OPR", "Opera")
              .replace("Edg ", "Edge ");
        }
        M = M[2]
          ? [M[1], M[2]]
          : [navigator.appName, navigator.appVersion, "-?"];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        return M.join(" ");
      } else {
        return "-"
      }
    }
  }
};
</script>

<style lang='scss'>
.carousel-container {
  background: #121212;
}

.carousel-slide-container {
  display: flex;
  flex-direction: column;
}

.welcome-top-container {
  display: flex;
  flex: 5;
  flex-direction: column;
  align-items: center;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 5vh;
}

.welcome-title {
  font-size: 5.5vw;
  font-weight: 500;
  text-align: center;
  margin-bottom: 0.1rem;
}

.welcome-text {
  font-size: 5vw;
  font-weight: 400;
  text-align: center;
  padding: 0 6vw;
}

.welcome-bottom-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4vh;
}

.browser-adjustments {
  margin-bottom: 10vh;
}

.ios-adjustments {
  margin-bottom: 12.5vh;
}

.browser-adjustments.ios-adjustments {
  margin-bottom: 24vh;
}

.welcome-btn {
  width: 90%;
  min-height: 11vw;
  font-size: 4vw;
}

.welcome-impressum-container {
  display: flex;
  min-height: 10vh;
  justify-content: center;
  align-items: center;
  padding-top: 3vh;

  .welcome-impressum-icon {
    width: 10vw;
    margin: 0.25rem;
  }

  .welcome-impressum-link {
    text-decoration: none;
    color: #fff;
    font-size: 4.5vw;
    padding-right: 0.5rem;
  }
}

.screen-indicator-container {
  display: flex;
  width: 50%;
  height: 4vw;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 1.75rem;
  position: relative;

  .screen-indicator-arrow {
    position: absolute;
    top: -28vh;
    right: -25vw;
    font-size: 4rem;
    color: rgba(255, 255, 255, 0.15);

    &:hover {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  .screen-indicator-dot {
    color: rgba(255, 255, 255, 0.6);
    margin: 1rem;

    &.active {
      color: #e94f35;
      border-radius: 50%;
      background: #e94f35;
      box-shadow: 0 0 6px 2px #e94f35;
    }
  }
}

.fade-enter-active {
  transition: opacity 1s;
}

.fade-enter {
  opacity: 0;
}
</style>
