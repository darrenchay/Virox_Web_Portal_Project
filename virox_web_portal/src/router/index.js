import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import LoginPage from '../components/LoginPage'
import Dashboard from '../components/Dashboard'

Vue.use(Router)
const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '*',
            redirect: 'dashboard'
        },
        {
            path: '/login',
            name: 'Login',
            component: LoginPage
        },
        {
            path: '/dashboard',
            name: 'Dashboard',
            component: Dashboard,
            meta: {
                requiresAuth: true
            }
        },
    ]

});

//Check for authentication
router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
    const currentUser = firebase.auth().currentUser

    //Not authenticated
    if (requiresAuth && !currentUser) {
        next('/login')
    } else if (requiresAuth && currentUser) {
        next()
    } else {
        next()
    }
})


export default router