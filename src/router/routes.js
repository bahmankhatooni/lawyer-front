

const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  return user?.role_id || null
}

// گارد نقش و احراز هویت
const requireAuth = (allowedRoles = []) => {
  return (to, from, next) => {
    const token = localStorage.getItem('token')
    const role = getUserRole()

    if (!token) {
      // اگر لاگین نیست، به صفحه ورود هدایت شود
      return next('/login')
    }

    if (allowedRoles.length && !allowedRoles.includes(role)) {
      // اگر نقش مجاز نیست، به داشبورد هدایت شود
      return next('/:catchAll(.*)*')
    }

    next()
  }
}

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue')
  },
  {
    path: '/forgot-password',
    component: () => import('pages/ForgotPasswordPage.vue')
  },

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('pages/DashboardPage.vue'),
        beforeEnter: requireAuth([1,2,3]) // همه نقش‌ها
      },
      {
        path: 'roles',
        component: () => import('pages/RolesPage.vue'),
        beforeEnter: requireAuth([1]) // دسترسی همه نقش‌ها
      },
      {
        path: 'clients',
        component: () => import('pages/ClientsPage.vue'),
        beforeEnter: requireAuth([1]) // دسترسی همه نقش‌ها
      },
      {
        path: 'files',
        component: () => import('pages/FilesPage.vue'),
        beforeEnter: requireAuth([1]) // دسترسی همه نقش‌ها
      },
      {
        path: 'reports',
        component: () => import('pages/ReportPage.vue'),
        beforeEnter: requireAuth([1,2]) // فقط مدیر سیستم و رئیس مرکز
      },
      {
        path: 'lawyers',
        component: () => import('pages/LawyersPage.vue'),
        beforeEnter: requireAuth([1]) // فقط مدیر سیستم
      },
      {
        path: '/profile',
        component: () => import('pages/ProfilePage.vue'), // ✅ صفحه پروفایل
        beforeEnter: requireAuth([1,2,3]) // فقط مدیر سیستم و رئیس مرکز
      },
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
