const routes = [
  {
    path: '/',
    redirect: 'login'
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue')
  },
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/DashboardPage.vue'),
        // meta: { requiresAuth: true }  // نیازمند لاگین
      },
      {
        path: '/clients',
        component: () => import('pages/ClientsPage.vue'),
        // meta: { requiresAuth: true }  // نیازمند لاگین
      },
      {
        path: '/reports',
        component: () => import('pages/ReportPage.vue'),
        // meta: { requiresAuth: true }  // نیازمند لاگین
      },

      {
        path: '/lawyers',
        component: () => import('pages/LawyersPage.vue'),
        // meta: { requiresAuth: true }  // نیازمند لاگین
      },
      {
        path: '/home',
        component: () => import('pages/HomePage.vue'),
        // meta: { requiresAuth: true }  // نیازمند لاگین
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
