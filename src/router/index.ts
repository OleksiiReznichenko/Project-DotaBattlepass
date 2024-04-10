import IndexView from '@/pages/Index.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'game',
      component: IndexView
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('../pages/Tasks.vue')
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('../pages/Account.vue')
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../pages/FAQ.vue')
    },
    {
      path: '/termsOfUse',
      name: 'termsOfUse',
      component: () => import('../pages/TermsOfUse.vue')
    }
  ]
})

export default router
