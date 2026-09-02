import { createRouter, createWebHistory } from 'vue-router';

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
    component: () => import('../views/FeedView.vue')
    },
    {
    path: '/event/:id',
    name: 'event-detail',
    component: () => import('../views/EventDetailView.vue')
    },
    {
    path: '/search',
    name: 'search',
    component: () => import('../views/SearchView.vue')
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
    path: '/profile/:id',
    name: 'public-profile',
    component: () => import('../views/profile/PublicProfileView.vue')
    },
    {
    path: '/admin',
    name: 'admin-dashboard',
    component: () => import('../views/admin/AdminDashboardView.vue'),
        meta: {
        requiresAuth: true,
        requiresAdmin: true
        }
    },
    {
    path: '/admin/events',
    name: 'admin-events',
    component: () => import('../views/admin/AdminEventsView.vue'),
        meta: {
        requiresAuth: true,
        requiresAdmin: true
        }
    },
    {
    path: '/admin/events/create',
    name: 'admin-event-create',
    component: () => import('../views/admin/EventCreateView.vue'),
        meta: {
        requiresAuth: true,
        requiresAdmin: true
        }
    },
    {
    path: '/admin/events/:id/edit',
    name: 'admin-event-edit',
    component: () => import('../views/admin/EventEditView.vue'),
        meta: {
        requiresAuth: true,
        requiresAdmin: true
        }
    },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('../views/admin/AdminUsersView.vue'),
        meta: {
        requiresAuth: true,
        requiresAdmin: true
        }
    },
    {
    path: '/admin/reports',
    name: 'admin-reports',
    component: () => import('../views/admin/AdminReportsView.vue'),
        meta: {
        requiresAuth: true,
        requiresAdmin: true
        }
    },
    { 
    path: '/pathmatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue') 
    }

    ]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router   