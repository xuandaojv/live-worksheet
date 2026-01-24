import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'
import Results from '../views/Results.vue'
import ResultsV2 from '../views/ResultsV2.vue'

const routes = [
  { path: '/', name: 'Home', component: App },
  { path: '/results-v2', name: 'Results', component: Results },
  { path: '/results', name: 'ResultsV2', component: ResultsV2 }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
