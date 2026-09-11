import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '博客列表' },
  },
  {
    path: '/blog/:id',
    name: 'detail',
    component: () => import('@/views/DetailView.vue'),
    meta: { title: '博客详情' },
  },
  {
    path: '/publish',
    name: 'publish',
    component: () => import('@/views/PublishView.vue'),
    meta: { title: '发布博客', requiresAuth: true },
  },
  {
    path: '/blog/:id/edit',
    name: 'edit',
    component: () => import('@/views/EditView.vue'),
    meta: { title: '编辑博客', requiresAuth: true },
  },
  {
    path: '/mine',
    name: 'mine',
    component: () => import('@/views/MineView.vue'),
    meta: { title: '我的博客', requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 登录守卫
router.beforeEach((to) => {
  const userStore = useUserStore()
  document.title = to.meta.title ? `${to.meta.title} - 文的点赞系统` : '文的点赞系统'

  // 已登录访问 /login 自动跳首页
  if (to.path === '/login' && userStore.isLoggedIn) {
    return '/'
  }
  // 需登录的页面：未登录跳转登录页，并携带回跳地址
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  return true
})

export default router