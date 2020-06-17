import firebase from 'firebase'
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

// date issue fix according to firebase
const settings = {
    timestampsInSnapshots: true
}
db.settings(settings)

// firebase collections
const usersCollection = db.collection('users')
//const postsCollection = db.collection('posts')
//const commentsCollection = db.collection('comments')
//const likesCollection = db.collection('likes')

export {
    db,
    auth,
    currentUser,
    usersCollection,
}