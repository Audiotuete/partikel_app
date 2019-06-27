
<template>
  <div class='main-container'>
    <div class='startscreen-container-outer'>
      <div class='startscreen-container-inner'>
        <div class='startscreen-heading' style='margin-top: 12%'>Verkehr im Vorderen Westen<br> ist dir nicht Wurst?</div>
        <span class='call-to-action-text'>Dann gib jetzt deinen </span>
        <div :style='background' class='image'><span class='text-block'>dazu!</span></div>
        <div class='startscreen-heading' style='margin: 0rem'>Abstimmen und gewinnen!</div>
        <BaseParagraph style='margin: 0; text-align: left'> Zum Dank verlosen wir unter allen
Teilnehmenden im <strong> Alter von 10 bis 21 Jahren Gutscheine</strong> für Läden und Gastronomie im Vorderen Westen.</BaseParagraph>
        <!-- <div class='startscreen-heading'>Umfrage endete am 15.03.2019</div> -->
      </div>
      <BaseButton @click='register()'>Umfrage starten</BaseButton>
      <p class='impressum-link' @click='showImpressum = true' style='margin-top: 0.5rem'>Impressum | Datenschutz</p>
    </div>
  </div>
</template>

<script>

// GraphQL
import CREATE_USER from '../graphql/users/createUser.gql'
import GET_TOKEN from '../graphql/auth/getToken.gql'


export default {
  name: 'welcome-screen',
  components: {},
  data () {
    return {
      background: {
        backgroundImage: 'url(' + 'https://umfrage.bewirken.org/wp-content/uploads/2019/05/Testumfrage.png' + ')'
      },
      showImpressum: false
    }
  },
    methods: {
  
    getBrowserInfo() { 
      var ua= navigator.userAgent, tem,
      M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []
      if(/trident/i.test(M[1])){
          tem=  /\brv[ :]+(\d+)/g.exec(ua) || []
          return 'IE '+(tem[1] || '')
      }
      if(M[1]=== 'Chrome'){
          tem= ua.match(/\b(OPR|Edge?)\/(\d+)/)
          if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera').replace('Edg ', 'Edge ')
      }
      M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?']
      if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1])
      return M.join(' ')
    },
    
    register() {
      this.$apollo.mutate({
        mutation: CREATE_USER,
        variables: {
          challengeId: 3,
          browserInfo: this.getBrowserInfo(),
          osInfo: navigator.platform
        }
      }).then((data) => {
        this.login(data.data.createUser.user.username)

      }).catch((error) => {
        // Error
        console.log('This is sparta')
        console.error(error)
      })
    },

    login(username) {
      this.$apollo.mutate({
        mutation: GET_TOKEN,
        variables: {
          username: username,
          password: process.env.USER_PASSWORD
        }
      }).then((data) => {
        // Result
        const token = data.data.tokenAuth.token
        localStorage.setItem(process.env.TOKEN_KEY, token)
        if (localStorage.getItem(process.env.TOKEN_KEY)) {
          this.$router.push('/')
        }
      }).catch((error) => {
        // Error
        console.error(error)
        // We restore the initial user input
      })
    },
  }
}
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
      width: 85%
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

    .text-block{
      position: absolute;
      bottom: 1rem;
      right: 0rem;
    }
  }

  .impressum-link {
    margin: 0rem .5rem 0 .5rem;
    font-size: 0.8rem;
    text-align: center;
    color: red;
    line-height: 1.3;
    font-weight: 500;
  }
</style>
