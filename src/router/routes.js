import BaseLayout from '../layouts/BaseLayout'
import Error404 from '../components/pages/Error404'

// Screens
import WelcomeScreen from '../screens/WelcomeScreen'
import OverviewScreen from '../screens/OverviewScreen'
import LessonScreen from '../screens/LessonScreen'


const routes = [
  {
    path: '/',
    component: BaseLayout,
    children: [
      {name: 'WelcomeScreen', path: 'welcome', component: WelcomeScreen },
      {name: 'OverviewScreen', path: '', component: OverviewScreen},
      {name: 'LessonScreen', path: 'lesson/:id', component: LessonScreen, props: true}
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


