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
                        <a @click="togglePasswordReset">Forgot Password</a>
                        <a @click="toggleForm">Create an Account</a>
                    </div>
                </form>
                <form v-if="!showLogin && !showPasswordReset" @submit.prevent>
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
                <form v-if="showPasswordReset" @submit.prevent class="password-reset">
                    <div v-if="!passwordResetSuccess">
                        <h1>Reset Password</h1>
                        <p>We will send you an email to reset your password</p>

                        <label for="email3">Email</label>
                        <input v-model.trim="passwordForm.email" type="text" placeholder="you@email.com" id="email3" />

                        <button @click="resetPassword" class="button">Submit</button>

                        <div class="extras">
                            <a @click="togglePasswordReset">Back to Log In</a>
                        </div>
                    </div>
                    <div v-else>
                        <h1>Email Sent</h1>
                        <p>check your email for a link to reset your password</p>
                        <button @click="togglePasswordReset" class="button">Back to login</button>
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
                passwordForm: {
                    email: ''
                },
                showLogin: true,
                showPasswordReset: false,
                performingRequest: false,
                passwordResetSuccess: false,
                errorMsg: ''
            }
        },
        methods: {
            toggleForm() {
                this.showLogin = !this.showLogin
                this.errorMsg = ''
            },
            login() {
                this.performingRequest = true;
                this.$store.dispatch('login', {
                    email: this.loginForm.email,
                    password: this.loginForm.password
                }).then(() => {
                    this.errorMsg = this.$store.state.errorMsg;
                    this.performingRequest = false;
                })

                },
            signup() {
                this.performingRequest = true
                this.$store.dispatch('signup', {
                    email: this.signupForm.email,
                    password: this.signupForm.password,
                    name: this.signupForm.name,
                }).then(() => {
                    this.errorMsg = this.$store.state.errorMsg;
                    this.performingRequest = false;
                })
            },
            resetPassword() {
                this.performingRequest = true
                fb.auth.sendPasswordResetEmail(this.passwordForm.email).then(() => {
                    this.performingRequest = false
                    this.passwordResetSuccess = true
                    this.passwordForm.email = ''
                    this.errorMsg = ''
                }).catch(err => {
                    console.log(err)
                    this.performingRequest = false
                    this.errorMsg = err.message
                })
            },
            // login() {
            //     this.performingRequest = true
            //     fb.auth.signInWithEmailAndPassword(this.loginForm.email, this.loginForm.password).then(user => {
            //     // this.$store.commit('setCurrentUser', credential.user)
            //     // console.log(credential.user.uid)
            //     this.$store.dispatch('fetchUserProfile', user)
            //     this.performingRequest = false
            //     this.$router.push('/')
            //     }).catch(err => {
            //         console.log(err)
            //         this.errorMsg = err.message
            //         this.performingRequest = false
            //     })
            // },
            // signup() {
            //     this.performingRequest = true
            //     fb.auth.createUserWithEmailAndPassword(this.signupForm.email, this.signupForm.password).then(credential => {
            //         this.$store.commit('setCurrentUser', credential.user) //Make this user the current user
            //         console.log(credential.user.email)
            //         console.log(credential.user.displayName)
            //         console.log(credential.user.uid)
            //         console.log(this.signupForm.name)

            //         console.log("Rerouting")
            //         this.$store.dispatch('fetchUserProfile') //set that user's profile in store
            //         this.performingRequest = false
            //         this.$router.push('/records')
                    
            //         // create user profile in firebase NOT WORKING
            //         fb.usersCollection.add({
            //             name: this.signupForm.name,
            //             email: this.signupForm.email,
            //             uid: credential.user.uid
            //         }).then(() => {
                        
            //         }).catch(err => {
            //             console.log("SETTING ERROR")
            //             console.log(err.message)
            //             this.performingRequest = false
            //             this.errorMsg = err.message
            //         })
            //         console.log("here")
            //     }).catch(err => {
            //         console.log("CREATE ERROR")
            //         this.performingRequest = false
            //         this.errorMsg = err.message
            //         console.log(err.message)
            //     })
            // },
            togglePasswordReset() {
                if (this.showPasswordReset) {
                    this.showLogin = true
                    this.showPasswordReset = false
                    this.passwordResetSuccess = false
                    this.errorMsg = ''
                } else {
                    this.errorMsg = ''
                    this.showLogin = false
                    this.showPasswordReset = true
                }
            }
        }
    }
</script>