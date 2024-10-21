import { createRouter, createWebHistory } from 'vue-router';
import ToDoPage from '@/pages/ToDoPage.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import LoginForm from '@/pages/LoginForm.vue';
import RegisterForm from '@/pages/RegisterForm.vue';
import ForgotPasswordForm from '@/pages/ForgotPasswordForm.vue';
import UserSetting from '@/components/UserSetting.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        { path: '/login', component: LoginForm },
        { path: '/register', component: RegisterForm },
        { path: '/forgot', component: ForgotPasswordForm },
      ],
    },
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          redirect: '/todos',
        },
        {
          path: '/todos',
          name: 'allToDo',
          component: ToDoPage,
        },
        {
          path: '/setting',
          component: UserSetting,
        },
      ],
    },
    // {
    //   path: '/todos',
    //   name: 'allToDo',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: ToDoPage,
    // },
    {
      path: '/setting',
      component: UserSetting,
    },
  ],
});

export default router;

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     {
//       path: '/',
//       redirect: { name: 'allToDo' },
//     },
//     {
//       path: '/todos',
//       name: 'allToDo',
//       // route level code-splitting
//       // this generates a separate chunk (About.[hash].js) for this route
//       // which is lazy-loaded when the route is visited.
//       component: ToDoPage,
//     },
//   ],
// });
