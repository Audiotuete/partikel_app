
import CHECK_CURRENT_USER from '../graphql/users/checkCurrentUser.gql'

// "async" is optional
export default async ({ app, router }) => {
  router.beforeEach((to, from, next) => {
  
    if (to.matched.some(record => record.meta.requiresNoChallenge)) {
      console.log('Required NoChallenge')
      getUser().then((data) => {
        if(data.currentChallenge) {
          next('/overview')
        } else {
          next()
        }
      })
    } else if (to.matched.some(record => record.meta.requiresAuth)) {
      console.log('Required Auth')

      getUser().then((data) => {
        if(!data.currentChallenge) {
          next('/')
        } else {
          next()
        }
      })     
    } else {
      next()
    }
  })
    
  async function getUser() {
    let user = await app.apolloProvider.defaultClient.query({
      query: CHECK_CURRENT_USER,
      fetchPolicy: 'no-cache',
    }).then((data) => {
        return data.data.currentUser
    }).catch((error) => {
        return false
    })
    return user
  }
  
}
