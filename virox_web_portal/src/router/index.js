import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import LoginPage from '../components/LoginPage'
import Dashboard from '../components/Dashboard'
import RecordsLoggingPage from '../components/RecordsLoggingPage'

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
        {
            path: '/records',
            name: 'Records',
            component: RecordsLoggingPage,
            meta: {
                requiresAuth: true
            }
        }
    ]

});

//Check for authentication
router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
    const currentUser = firebase.auth().currentUser

    //Not authenticated
    if (requiresAuth && !currentUser) {
        console.log(requiresAuth)
        console.log("not autheticated")
        next('/login')
    } else if (requiresAuth && currentUser) {
        console.log(requiresAuth)
        console.log("autheticated")
        next()
    } else {
        console.log("wat")
        next()
    }
})


export default router