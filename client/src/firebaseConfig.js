import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// firebase init goes here
const config = {
    apiKey: "AIzaSyBAhOCi3iNNWBnp1GLprImdS7nWSAIvXyg",
    authDomain: "virox-db.firebaseapp.com",
    databaseURL: "https://virox-db.firebaseio.com",
    projectId: "virox-db",
    storageBucket: "virox-db.appspot.com",
    messagingSenderId: "11654335923",
    appId: "1:11654335923:web:66b47ce8ed1c7316058fc6",
    measurementId: "G-20KFL6N8CH"
}

firebase.initializeApp(config)

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser


// firebase collections
const usersCollection = db.collection('users')

export {
    db,
    auth,
    currentUser,
    usersCollection,
}