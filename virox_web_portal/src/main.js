import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App'
import router from './router'
import { store } from './store.js'
const fb = require('./firebaseConfig.js') //Handle users
import './assets/scss/app.scss'

Vue.use(VueAxios, axios)
Vue.config.productionTip = false

// handle page reloads
let app
fb.auth.onAuthStateChanged(() => {
    if (!app) {
        app = new Vue({
            el: '#app',
            router,
            store,
            render: h => h(App)
        })
    }
})