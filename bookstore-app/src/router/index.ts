import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import SigninView from '@/views/SigninView.vue';
import RegisterView from '@/views/RegisterView.vue';
import LibraryView from '@/views/LibraryView.vue';
import UserView from '@/views/UserView.vue';
import GuestView from '@/views/GuestView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      name: 'auth',
      component: LoginView,
      children: [
        {
          path: 'login',
          name: 'login',
          component: SigninView
        },
        {
          path: 'register',
          name: 'register',
          component: RegisterView
        }
      ]
    },
    {
      path: '/library',
      name: 'library',
      component: LibraryView,
      children: [
        {
          path: '',
          name: 'guest',
          component: GuestView
        },
        {
          path: 'books',
          name: 'user',
          component: UserView
        }
      ]
    }
  ]
});

export default router;
