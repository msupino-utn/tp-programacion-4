import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CiudadesView from '../views/CiudadesView.vue'
import AtletasView from '../views/AtletasView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/ciudades',
      name: 'ciudades',
      component: CiudadesView,
    },
    {
      path: '/atletas',
      name: 'atletas',
      component: AtletasView,
    }
  ],
})

export default router
