
<template>
  <q-page>
    <q-carousel keep-alive animated swipeable v-model="currentScreen" height="100vh">
      <q-carousel-slide
        class="slide-container"
        v-for="(screen, index) in allOnboardingScreens"
        :key="index"
        :name="index"
        :img-src="screen.image.rendition.url"
      >
        <div class="welcome-top-container">
          <span class="welcome-title">{{screen.title}}</span>
          <span class="welcome-text">{{screen.text}}</span>
        </div>
        <div class="welcome-bottom-container">
          <div class="screen-indicator-container">
            <q-icon
              v-for="(dot, index) in allOnboardingScreens "
              :key="index"
              :class="{'screen-indicator': true, 'active': index == currentScreen}"
              name="fas fa-circle"
              size="3.5vw"
            ></q-icon>
          </div>
          <q-btn
            class="welcome-btn"
            @click="register()"
            color="white"
            text-color="primary"
          >Challenge Starten</q-btn>
          <div class="welcome-impressum-container">
            <img class="welcome-impressum-icon" src="../statics/app-logo-128x128.png" alt />
            <router-link to="/impressum" class="welcome-impressum-link">Impressum</router-link>
          </div>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </q-page>
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
      allOnboardingScreens: [],
      currentScreen: 0
    };
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
    register() {
      this.$apollo
        .mutate({
          mutation: CREATE_USER,
          variables: {
            challengeId: process.env.CHALLENGE_ID,
            // browserInfo and osInfo must be requested differently on native WebViews
            browserInfo: "this.getBrowserInfo()",
            osInfo: "navigator.platform"
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
    }
    // getBrowserInfo() {
    //   var ua= navigator.userAgent, tem,
    //   M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []
    //   if(/trident/i.test(M[1])){
    //       tem=  /\brv[ :]+(\d+)/g.exec(ua) || []
    //       return 'IE '+(tem[1] || '')
    //   }
    //   if(M[1]=== 'Chrome'){
    //       tem= ua.match(/\b(OPR|Edge?)\/(\d+)/)
    //       if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera').replace('Edg ', 'Edge ')
    //   }
    //   M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?']
    //   if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1])
    //   return M.join(' ')
    // },
  }
};
</script>

<style lang='scss'>
.slide-container {
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
  justify-content: center;
  align-items: center;
  margin-bottom: 2.5vh;
}
.welcome-btn {
  width: 90%;
  min-height: 11vw;
  font-size: 4vw;
  margin-bottom: 1rem;
}

.welcome-impressum-container {
  display: flex;
  justify-content: center;
  align-items: center;

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

  .screen-indicator {
    color: rgba(255, 255, 255, 0.6);

    &.active {
      color: #e94f35;
      border-radius: 50%;
      background: #e94f35;
      box-shadow: 0 0 6px 2px #e94f35;
    }
  }
}
</style>
