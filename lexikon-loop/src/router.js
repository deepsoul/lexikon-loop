import {createRouter, createWebHistory} from 'vue-router';
import Home from './components/Home.vue';

const isAuthenticated = true; // Dummy: später durch echte Authentifizierung ersetzen

const ProtectedPage = () => import('./components/ProtectedPage.vue');

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/protected',
    name: 'Protected',
    component: ProtectedPage,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated) {
        next();
      } else {
        alert('Nicht berechtigt!');
        next('/');
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return {top: 0};
  },
});

export default router;
