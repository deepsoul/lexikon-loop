import {createRouter, createWebHistory} from 'vue-router';
import Home from './components/Home.vue';
import Login from './components/Login.vue';
import NotFound from './components/NotFound.vue';

const ProtectedPage = () => import('./components/ProtectedPage.vue');
const IconsPage = () => import('./components/IconsPage.vue');

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/protected',
    name: 'Protected',
    component: ProtectedPage,
    meta: {requiresAuth: true},
  },
  {path: '/icons', name: 'Icons', component: IconsPage},
  {path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound},
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return {top: 0};
  },
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
