import BaseLayout from '../layouts/BaseLayout'
import Error404 from '../components/pages/Error404'

// Screens
import WelcomeScreen from '../screens/WelcomeScreen'
import OverviewScreen from '../screens/OverviewScreen'


const routes = [
  {
    path: '/',
    component: BaseLayout,
    children: [
      { path: 'welcome', component: WelcomeScreen },
      { path: '', component: OverviewScreen}
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: Error404
  })
}

export default routes


