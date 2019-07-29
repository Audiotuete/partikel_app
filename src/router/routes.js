import BaseLayout from '../layouts/BaseLayout'
import Error404 from '../components/pages/Error404'

// Screens
import WelcomeScreen from '../screens/WelcomeScreen'
import OverviewScreen from '../screens/OverviewScreen'
import LessonScreen from '../screens/LessonScreen'
import ImpressumScreen from '../screens/ImpressumScreen'



const routes = [
  {
    path: '/',
    component: BaseLayout,
    children: [
      {
        name: 'WelcomeScreen', 
        path: '', 
        component: WelcomeScreen,
        meta: { requiresNoChallenge: true }
      },
      {
        name: 'OverviewScreen', 
        path: 'overview', 
        component: OverviewScreen,
        meta: { requiresAuth: true }
      },      
      {
        name: 'LessonScreen', 
        path: 'lesson/:id', 
        component: LessonScreen,
        meta: { requiresAuth: true },
        props: true
      },
      {
        name: 'ImpressumScreen', 
        path: 'impressum', 
        component: ImpressumScreen,
        props: true
      },
    ]
  }
]

// routes: [

//   { path: '/tutorial',
//   components: { default: TutorialScreen, },
//   meta: { requiresAuth: true },
//   },
//   { path: '/verify/:activation_key',
//     components: { default: VerificationScreen },
//     meta: { requiresAuth: false },
//   },
// ]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: Error404
  })
}

export default routes


