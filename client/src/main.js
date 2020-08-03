import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App'
import router from './router'
import store from './store'
// const fb = require('./firebaseConfig.js') //Handle users
import { auth } from './firebaseConfig' 
import './assets/scss/app.scss'

Vue.use(VueAxios, axios)
Vue.config.productionTip = false

// handle page reloads
let app
auth.onAuthStateChanged(user => {
    if (!app) {
        app = new Vue({
            router,
            store,
            render: h => h(App)
        }).$mount('#app')
    }

    if (user) {
        store.dispatch('fetchUserProfile', user)
    }
})