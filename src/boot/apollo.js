import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
// import { withClientState } from 'apollo-link-state';
import VueApollo from 'vue-apollo'

import introspectionQueryResultData from '../graphql/fragmentTypes.json'

// "async" is optional
export default async ({ app, Vue }) => {
  // Create fragment matcher for fragmented Queries (... on "Type")
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData
  });

  // Setup the apollo state management
  const app_cache = new InMemoryCache({ fragmentMatcher })

  // const stateLink = withClientState({
  //   app_cache,
  //   resolvers: {
  //   },
  //   defaults: {
  //     Challenge: {
  //       __typename: 'Challenge',
  //       id: 0,
  //     },
  //     Project: {
  //       __typename: 'Project',
  //       id: 0,
  //     }
  //   }
  // })

  // Send JWT from local storage with every request
  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('CRkTFzpd')
    return {
      headers: {
        ...headers,
        authorization: token ? `JWT ${token}` : '',
      }
    }
  })

  // Create the apollo client 
  const apolloClient = new ApolloClient({
    cache: app_cache, 
    link: ApolloLink.from([
      authLink,
      new HttpLink({uri: 'https://leidenschaftlich-fuehren.de/graphql'})]
    ),
    connectToDevTools: true,
  })

  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
  })

  // Install the vue plugin
  Vue.use(VueApollo)
  app.apolloProvider = apolloProvider
  
}
