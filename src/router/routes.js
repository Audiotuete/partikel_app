import MyLayout from '../layouts/MyLayout'
import Index from '../pages'
import Error404 from '../pages'

const routes = [
  {
    path: '/',
    component: MyLayout,
    children: [
      { path: '', component: Index}
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


