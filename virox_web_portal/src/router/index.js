import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import LoginPage from '../components/LoginPage'
import RecordDetails from '../components/RecordDetails'
import RecordsLoggingPage from '../components/RecordsLoggingPage'

Vue.use(Router)
const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '*',
            redirect: 'records'
        },
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
            path: '/records',
            name: 'records',
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
        //console.log(requiresAuth)
        //console.log("not autheticated")
        next('/login')
    } else if (requiresAuth && currentUser) {
        //console.log(requiresAuth)
        console.log("autheticated")
        next()
    } else {
        next()
    }
})


export default router