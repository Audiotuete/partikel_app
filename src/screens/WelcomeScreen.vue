
<template>
  <q-page>
    <q-carousel keep-alive animated navigation swipeable v-model="slide" height="100vh">
      <q-carousel-slide
        v-for="(screen, index) in allOnboardingScreens"
        :key="index"
        :name="index"
        :img-src="screen.image.rendition.url"
      ></q-carousel-slide>
    </q-carousel>
    <q-btn
      @click="register()"
      style="width:100%; position: absolute; bottom: 10px"
      color="primary"
      class
    >Challenge Starten</q-btn>
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
      allOnboardingScreens: [
        {
          id: 0,
          title: "Hello",
          image:
            "https://agrarproduktion-lindstedt.de/wp-content/uploads/2018/04/Platzhalter-3.png"
        }
      ],
      slide: 0
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
.startscreen-container-outer {
  display: flex;
  flex-direction: column;
  align-items: center;

  .startscreen-container-inner {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 85%;
  }
}

.call-to-action-text {
  font-size: 1rem;
  width: 70vw;
}

.startscreen-heading {
  margin-top: 1rem;
  margin-bottom: 0.25rem;
  font-size: 1.1rem;
  font-weight: 700;
}

.image {
  position: relative;
  z-index: -1;
  margin-top: -1.5rem;
  margin-left: 0.5rem;
  position: relative;
  background-repeat: no-repeat;
  background-size: auto;
  background-position: center;
  display: flex;
  width: 75vw;
  height: 14rem;
  background-size: 16rem 10.75rem;
  justify-content: center;
  align-items: center;

  .text-block {
    position: absolute;
    bottom: 1rem;
    right: 0rem;
  }
}

.impressum-link {
  margin: 0rem 0.5rem 0 0.5rem;
  font-size: 0.8rem;
  text-align: center;
  color: red;
  line-height: 1.3;
  font-weight: 500;
}
</style>
