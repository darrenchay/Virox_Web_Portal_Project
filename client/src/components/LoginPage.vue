<template>
    <div id="login">
        <transition name="fade">
            <div v-if="performingRequest" class="loading">
                <p>Loading...</p>
            </div>
        </transition>
        <section>
            <div class="col1">
                <h1>Virox Web Portal</h1>
                <img class="img-thumbnail" src="../assets/Virox-Logo.png">
            </div>
            <div class="col2" :class="{ 'signup-form': !showLogin }">
                <form v-if="showLogin" @submit.prevent>
                    <h1>Welcome Back</h1>

                    <label for="emailLogin">Email</label>
                    <input v-model.trim="loginForm.email" type="email" placeholder="you@email.com" id="emailLogin" />

                    <label for="passwordLogin">Password</label>
                    <input v-model.trim="loginForm.password" type="password" placeholder="******" id="passwordLogin" />

                    <button class="button" @click="login">Log In</button>

                    <div class="extras">
                        <a>Forgot Password</a>
                        <a @click="toggleForm">Create an Account</a>
                    </div>
                </form>
                <form v-else @submit.prevent>
                    <h1>Get Started</h1>

                    <label for="name">Name</label>
                    <input v-model.trim="signupForm.name" type="text" placeholder="First Name Last Name" id="name" />

                    <label for="emailSignUp">Email</label>
                    <input v-model.trim="signupForm.email" type="email" placeholder="you@email.com" id="emailSignUp" />

                    <label for="passwordSignUp">Password</label>
                    <input v-model.trim="signupForm.password" type="password" placeholder="min 6 characters" id="passwordSignUp" />

                    <button @click="signup" class="button">Sign Up</button>

                    <div class="extras">
                        <a @click="toggleForm">Back to Log In</a>
                    </div>
                </form>
                <transition name="fade">
                <div v-if="errorMsg !== ''" class="error-msg">
                    <p>{{ errorMsg }}</p>
                </div>
            </transition>
            </div>
        </section>
    </div>
</template>

<script>
    const fb = require('../firebaseConfig.js')

    export default {
        data() {
            return {
                loginForm: {
                    email: '',
                    password: ''
                },
                signupForm: {
                    name: '',
                    email: '',
                    password: ''
                },
                showLogin: true,
                performingRequest: false,
                errorMsg: ''
            }
        },
        methods: {
            toggleForm() {
                this.showLogin = !this.showLogin
                this.errorMsg = ''
            },
            login() {
                this.performingRequest = true
                fb.auth.signInWithEmailAndPassword(this.loginForm.email, this.loginForm.password).then(credential => {
                this.$store.commit('setCurrentUser', credential.user)
                console.log(credential.user.uid)
                this.$store.dispatch('fetchUserProfile')
                this.performingRequest = false
                this.$router.push('/records')
                }).catch(err => {
                    console.log(err)
                    this.errorMsg = err.message
                    this.performingRequest = false
                })
            },
            signup() {
                this.performingRequest = true
                fb.auth.createUserWithEmailAndPassword(this.signupForm.email, this.signupForm.password).then(credential => {
                    this.$store.commit('setCurrentUser', credential.user) //Make this user the current user
                    console.log(credential.user.email)
                    console.log(credential.user.displayName)
                    console.log(credential.user.uid)
                    console.log(this.signupForm.name)

                    console.log("Rerouting")
                    this.$store.dispatch('fetchUserProfile') //set that user's profile in store
                    this.performingRequest = false
                    this.$router.push('/records')
                    
                    // create user profile in firebase NOT WORKING
                    fb.usersCollection.add({
                        name: this.signupForm.name,
                        email: this.signupForm.email,
                        uid: credential.user.uid
                    }).then(() => {
                        
                    }).catch(err => {
                        console.log("SETTING ERROR")
                        console.log(err.message)
                        this.performingRequest = false
                        this.errorMsg = err.message
                    })
                    console.log("here")
                }).catch(err => {
                    console.log("CREATE ERROR")
                    this.performingRequest = false
                    this.errorMsg = err.message
                    console.log(err.message)
                })
            }
        }
    }
</script>