import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

const fb = require('./firebaseConfig.js')

Vue.use(Vuex)

// handle page reload
fb.auth.onAuthStateChanged(user => {
    if (user) {
        store.commit('setCurrentUser', user)
        store.dispatch('fetchUserProfile')
    }
})

export const store = new Vuex.Store({
    state: {
        currentUser: null,
        userProfile: {},
        currentRecordID: null
    },
    actions: {
        clearData({ commit }) {
            commit('setCurrentUser', null)
            commit('setUserProfile', {})
        },
        fetchUserProfile({ commit, state }) {
            fb.usersCollection.doc(state.currentUser.uid).get().then(res => {
                commit('setUserProfile', res.data)
                //console.log(res.data())
            }).catch(err => {
                console.log(err)
            })
        },
    }, 
    mutations: {
        setCurrentUser(state, val) {
            state.currentUser = val
            //console.log(state.currentUser.email)
        },
        setUserProfile(state, val) {
            //console.log("the val" + val)
            state.userProfile = val
        },
        setCurrentRecordID(state, ID) {
            state.currentRecordID = ID
        }
    },

    plugins: [createPersistedState()]
})