import { createRouter, createWebHistory } from 'vue-router'
import { STORAGE_KEYS } from '../config/constants'
import { useToast } from '../composables/useToast'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: () => import('../views/LandingView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/auth/RegisterView.vue')
  },
  {
    path: '/feed',
    name: 'feed',
    component: () => import('../views/FeedView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/event/:id',
    name: 'event-detail',
    component: () => import('../views/EventDetailView.vue')
  },
  {
    path: '/event/:id/edit',
    name: 'event-edit',
    component: () => import('../views/events/EditEventView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/SearchView.vue')
  },
  {
    path: '/collections',
    name: 'my-collections',
    component: () => import('../views/collections/MyCollectionsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/collections/:id',
    name: 'collection-detail',
    component: () => import('../views/collections/CollectionDetailView.vue')
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('../views/NotificationsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('../views/favorites/MyFavoritesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'my-profile',
    component: () => import('../views/profile/MyProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/:username',
    name: 'public-profile',
    component: () => import('../views/profile/PublicProfileView.vue')
  },
  {
    path: '/profile/:username/followers',
    name: 'followers',
    component: () => import('../views/profile/FollowListView.vue'),
    props: { kind: 'followers' }
  },
  {
    path: '/profile/:username/following',
    name: 'following',
    component: () => import('../views/profile/FollowListView.vue'),
    props: { kind: 'following' }
  },
  {
    path: '/following-events',
    name: 'following-events',
    component: () => import('../views/events/FollowingEventsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/my-events',
    name: 'my-events',
    component: () => import('../views/events/MyEventsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/liked-events',
    component: () => import('../views/events/LikedEventsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/events/create',
    name: 'event-create',
    component: () => import('../views/CreateEventView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    component: () => import('../components/layout/AdminLayout.vue'),
    redirect: { name: 'admin-dashboard' },
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('../views/admin/AdminDashboardView.vue')
      },
      {
        path: 'reports',
        name: 'admin-reports',
        component: () => import('../views/admin/AdminReportsView.vue')
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('../views/admin/AdminUsersView.vue')
      },
      {
        path: 'events',
        name: 'admin-events',
        component: () => import('../views/admin/AdminEventsView.vue')
      }
    ]
  },
  {
    path: '/admin/events/create',
    name: 'admin-event-create',
    component: () => import('../views/admin/EventCreateView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/events/:id/edit',
    name: 'admin-event-edit',
    component: () => import('../views/admin/EventEditView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null')
  } catch {
    return null
  }
}

router.beforeEach((to) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)

  if (to.meta.requiresAuth && !token) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresAdmin && !readStoredUser()?.isAdmin) {
    useToast().error('Você não tem permissão para acessar a administração.')
    return { name: 'feed' }
  }

  return true
})

export default router
