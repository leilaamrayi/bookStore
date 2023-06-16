import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import UserView from '@/views/UserView.vue';
import GuestView from '@/views/GuestView.vue';
import AdminView from '@/views/AdminView-user.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      name: 'auth',      
      children: [
        {
          path: 'login',
          name: 'login',
          component: LoginView
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
      children: [
        {
          path: '',
          name: 'guest',
          component: GuestView
        },
        {
          path: 'books',
          name: 'books',
          component: UserView
        },
        {
          path: 'profile',
          name: 'user',
          component: AdminView
        }
      ]
    }
    
  ]
});

export default router;
