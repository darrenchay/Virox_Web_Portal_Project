import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import * as fb from './firebaseConfig'
import router from './router/index'
// const fb = require('./firebaseConfig.js')

Vue.use(Vuex)

// handle page reload
// fb.auth.onAuthStateChanged(user => {
//     if (user) {
//         store.commit('setCurrentUser', user)
//         store.dispatch('fetchUserProfile')
//     }
// })

export default new Vuex.Store({
    // State variables 
    state: {
        currentUser: null,
        userProfile: {},
        currentRecordID: null,
        errorMsg: ''
    },
    actions: {
        // Fetches user data when logging in and authenticating user
        async login({ dispatch }, form) {
            try {
                // sign user in
                const { user } = await fb.auth.signInWithEmailAndPassword(form.email, form.password)

                // fetch user profile and set in state
                dispatch('fetchUserProfile', user)
                dispatch('setError', '')
            } catch (err) {
                // Sending error message if there is any
                dispatch('setError', err.message)
            }

        },
        // Signing up user and saving user data in users collection
        async signup({ dispatch }, form) {
            try {
                // sign user up
                const { user } = await fb.auth.createUserWithEmailAndPassword(form.email, form.password)

                // create user profile object in userCollections
                await fb.usersCollection.doc(user.uid).set({
                    name: form.name,
                    email: form.email
                })

                // fetch user profile and set in state
                dispatch('setError', '')
                dispatch('fetchUserProfile', user)
            } catch (err) {
                dispatch('setError', err.message)
            }

        },
        async fetchUserProfile({ commit }, user) {
            // fetch user profile
            const userProfile = await fb.usersCollection.doc(user.uid).get()

            // set user profile in state
            commit('setUserProfile', userProfile.data());

            // change route to dashboard
            if (router.currentRoute.path === '/login') {
                router.push('/')
            }
        },
        async logout({ commit }) {
            await fb.auth.signOut()

            // clear userProfile and redirect to /login
            commit('setUserProfile', {})
            // commit('setCurrentUser', null)
            router.push('/login')
        },
        async updateProfile({ dispatch }, user) {
            const userId = fb.auth.currentUser.uid
            // update user object
            await fb.usersCollection.doc(userId).update({
              name: user.name,
            })
          
            dispatch('fetchUserProfile', { uid: userId })
        },
        setError({ commit }, error) {
            console.log(error)
            commit('setErrorMsg', error)
        }
    },
    // Changing data in state
    mutations: {
        setCurrentUser(state, val) {
            state.currentUser = val
            //console.log(state.currentUser.email)
        },
        setUserProfile(state, val) {
            state.userProfile = val
        },
        setCurrentRecordID(state, ID) {
            state.currentRecordID = ID
        },
        setErrorMsg(state, val) {
            state.errorMsg = val;
        }
    },

    plugins: [createPersistedState()]
})