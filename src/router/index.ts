import IndexView from '@/pages/Index.vue';
import DemoPage from '@/demo/DemoPage.vue';
import { DEMO_MODE } from '@/demo/config';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'game', component: IndexView },
    {
      path: '/tasks', name: 'tasks',
      component: DEMO_MODE ? DemoPage : () => import('@/pages/Tasks.vue'),
    },
    {
      path: '/account', name: 'account',
      component: DEMO_MODE ? DemoPage : () => import('@/pages/Account.vue'),
    },
    {
      path: '/faq', name: 'faq',
      component: DEMO_MODE ? DemoPage : () => import('@/pages/FAQ.vue'),
    },
    {
      path: '/about', name: 'about',
      component: DemoPage,
    },
    ...(DEMO_MODE
      ? [{ path: '/termsOfUse', redirect: '/about' }]
      : [{ path: '/termsOfUse', name: 'termsOfUse', component: () => import('@/pages/TermsOfUse.vue') }]),
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});

export default router;
