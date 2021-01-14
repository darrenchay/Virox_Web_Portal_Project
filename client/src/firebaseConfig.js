import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// firebase init 
const config = {
    apiKey: "#############################",
    authDomain: "#############################",
    databaseURL: "#############################",
    projectId: "#############################",
    storageBucket: "#############################",
    messagingSenderId: "#############################",
    appId: "#############################",
    measurementId: "#############################"
}

firebase.initializeApp(config)
// firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
//     .catch(function (error) {
//         // Handle Errors here.
//         // var errorCode = error.code;
//         // var errorMessage = error.message;
//         console.log(error)
//     });

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
