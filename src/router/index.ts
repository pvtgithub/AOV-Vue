import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import { AuthenticateUtil } from '@/utils/auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    beforeEnter: (to, from, next) => {
      const checkJwt = AuthenticateUtil.checkJwt();
      if(!checkJwt){
        next('/login');
      }
      else{
        next()
      }
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    beforeEnter: (to, from, next) => {
      const checkJwt = AuthenticateUtil.checkJwt();
      if(checkJwt){
        next('/');
      }
      else{
        next()
      }
    },
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
