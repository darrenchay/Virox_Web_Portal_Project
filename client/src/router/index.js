import Vue from 'vue'
import Router from 'vue-router'
import { auth } from '../firebaseConfig'
import LoginPage from '../views/LoginPage'
import RecordDetails from '../views/RecordDetails'
import RecordsLoggingPage from '../views/RecordsLoggingPage'
import Search from '../views/Search'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: LoginPage
        },
        {
            path: '/recordDetails',
            name: 'recordDetails',
            component: RecordDetails,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/',
            name: 'records',
            component: RecordsLoggingPage,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/search',
            name: 'search',
            component: Search,
            meta: {
                requiresAuth: true
            }
        },
        {
          path: '/settings',
          name: 'settings',
          component: () => import( /* webpackChunkName: "settings" */ '../views/Settings.vue'),
          meta: {
            requiresAuth: true
          }
        }
        
    ]

});

// Check for authentication
router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
    let test = false;
    //if (requiresAuth && !auth.currentUser) {
    if (test && requiresAuth && !auth.currentUser) {
        next('/login')
    } else {
        next()
    }
})


export default router